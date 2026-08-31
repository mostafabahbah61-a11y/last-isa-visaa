import { useEffect, useState } from "react";
import logo from "@/assets/globevisa-logo-transparent.png";
import { useLang } from "@/lib/i18n";

const LOGO_MS = 3000; // phase 1: rotating logo, exactly 3s
const PHRASE_MS = 2200; // phase 2: journey phrase
const EXIT_MS = 600; // fade-out

export function SplashScreen() {
  const { t } = useLang();
  const [phase, setPhase] = useState<"logo" | "phrase" | "exiting" | "done">("logo");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("phrase"), LOGO_MS);
    const t2 = setTimeout(() => setPhase("exiting"), LOGO_MS + PHRASE_MS);
    const t3 = setTimeout(() => setPhase("done"), LOGO_MS + PHRASE_MS + EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100]"
      style={
        phase === "exiting"
          ? { animation: `gv-splash-exit ${EXIT_MS}ms ease forwards` }
          : undefined
      }
    >
      {/* Shared premium brand backdrop — deep navy with a soft gold aura */}
      <div className="absolute inset-0 bg-navy-deep" />
      <div className="absolute inset-0 bg-[radial-gradient(75%_55%_at_50%_38%,oklch(0.34_0.08_256/0.9),transparent_70%),radial-gradient(60%_40%_at_50%_78%,oklch(0.74_0.108_84/0.14),transparent_65%),radial-gradient(120%_100%_at_50%_50%,transparent_55%,oklch(0.13_0.03_264/0.9))]" />

      {/* Phase 1 — transparent logo rotating in 3D for exactly 3s */}
      <div
        className={`absolute inset-0 logo-3d-stage flex items-center justify-center transition-opacity duration-500 ${
          phase === "logo" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          {/* soft gold halo lighting, matched to the backdrop */}
          <div className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,oklch(0.9_0.07_90/0.22),oklch(0.74_0.108_84/0.10)_45%,transparent_75%)] blur-xl" />
          <img
            src={logo}
            alt=""
            width={754}
            height={572}
            fetchPriority="high"
            className="logo-3d relative h-44 w-auto sm:h-64"
          />
        </div>
      </div>

      {/* Phase 2 — journey phrase over the same brand backdrop */}
      {phase !== "logo" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h2
            className="relative px-6 text-center font-display text-3xl text-white sm:text-5xl lg:text-6xl"
            style={{ animation: "gv-splash-phrase 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {t("splash.phrase")}
          </h2>
        </div>
      )}
    </div>
  );
}
