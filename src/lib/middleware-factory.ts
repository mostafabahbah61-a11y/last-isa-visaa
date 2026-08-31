/**
 * Middleware factory wrapper - compatible with Vercel's server environment
 * This works around the isomorphic module resolution issue where
 * createMiddleware from @tanstack/react-start resolves to undefined
 * in the Vercel production server bundle.
 */

type MiddlewareContext = {
  handlerType?: string;
  [key: string]: unknown;
};

type MiddlewareOptions = {
  type?: 'function' | 'server' | 'client';
};

type MiddlewareHandler = (options: {
  next: (opts?: { headers?: Record<string, string> }) => Promise<Response>;
  request?: Request;
  context?: MiddlewareContext;
}) => Promise<Response>;

type MiddlewareFactory = {
  server: (handler: MiddlewareHandler) => MiddlewareHandler;
  client: (handler: MiddlewareHandler) => MiddlewareHandler;
};

/**
 * Create a middleware factory that's compatible with both client and server
 * environments. Returns an object with .server() and .client() methods.
 */
export function createMiddleware(options?: MiddlewareOptions): MiddlewareFactory {
  return {
    server: (handler: MiddlewareHandler) => handler,
    client: (handler: MiddlewareHandler) => handler,
  };
}

// Type exports for external use
export type { MiddlewareContext, MiddlewareOptions, MiddlewareHandler };
