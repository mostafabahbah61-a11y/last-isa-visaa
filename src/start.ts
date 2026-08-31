import { createStart } from "@tanstack/react-start";
import type { createMiddleware as tanstackCreateMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Import our middleware factory as a fallback for Vercel production environments
// where the TanStack export may not be properly available
import { createMiddleware as createMiddlewareWrapper } from "./lib/middleware-factory";

// Use TanStack's createMiddleware if available, fallback to our wrapper
let createMiddleware: typeof tanstackCreateMiddleware;
try {
  const tanstackMiddleware = require("@tanstack/react-start").createMiddleware;
  createMiddleware =
    typeof tanstackMiddleware === "function"
      ? tanstackMiddleware
      : createMiddlewareWrapper;
} catch {
  createMiddleware = createMiddlewareWrapper;
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
// Equivalent of TanStack's createCsrfMiddleware, written manually because the
// built-in is an isomorphic factory that resolves to undefined in the Vercel
// production server bundle ("createCsrfMiddleware is not a function").
// Blocks cross-site requests to server functions using Sec-Fetch-Site, then
// Origin, then Referer — same rules as the upstream implementation.
const csrfMiddleware = createMiddleware().server(async ({ next, request, context }) => {
  const ctx = context as unknown as { handlerType?: string };
  if (ctx.handlerType !== "serverFn") return next();

  const requestOrigin = new URL(request.url).origin;
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite !== null) {
    if (fetchSite === "same-origin") return next();
    return new Response("Forbidden", { status: 403 });
  }
  const origin = request.headers.get("Origin");
  if (origin !== null) {
    if (origin === requestOrigin) return next();
    return new Response("Forbidden", { status: 403 });
  }
  const referer = request.headers.get("Referer");
  if (referer !== null) {
    if (referer === requestOrigin) return next();
    if (referer.startsWith(requestOrigin)) {
      const code = referer.charCodeAt(requestOrigin.length);
      if (referer.length === requestOrigin.length || code === 47 || code === 63 || code === 35) {
        return next();
      }
    }
    return new Response("Forbidden", { status: 403 });
  }
  return next();
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
