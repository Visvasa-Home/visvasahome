import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => onComplete(), 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        transition: "opacity 0.65s cubic-bezier(0.4,0,0.2,1)",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Animated logo mark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          transform: phase === "enter" ? "translateY(18px)" : "translateY(0)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
        }}
      >
        {/* Brand icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(29,78,216,0.25)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 6L30 12V24L18 30L6 24V12L18 6Z"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M18 12L24 15.5V22.5L18 26L12 22.5V15.5L18 12Z"
              fill="white"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Brand name with letter-by-letter animation */}
        <BrandName phase={phase} />

        {/* Tagline */}
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 500,
            marginTop: 2,
            opacity: phase === "hold" || phase === "exit" ? 1 : 0,
            transition: "opacity 0.4s ease 0.3s",
          }}
        >
          Trusted Local Services
        </p>
      </div>

      {/* Bottom progress line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
          width: phase === "enter" ? "0%" : phase === "hold" ? "70%" : "100%",
          transition:
            phase === "enter"
              ? "width 0.8s ease"
              : phase === "hold"
              ? "width 0.9s cubic-bezier(0.4,0,0.2,1)"
              : "width 0.5s ease",
          borderRadius: "0 2px 0 0",
        }}
      />
    </div>
  );
}

function BrandName({ phase }: { phase: string }) {
  const word1 = "Visvasa";
  const word2 = "Home";

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ display: "flex" }}>
        {word1.split("").map((char, i) => (
          <span
            key={i}
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.5px",
              display: "inline-block",
              transform: phase === "enter" ? "translateY(10px)" : "translateY(0)",
              opacity: phase === "enter" ? 0 : 1,
              transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s, opacity 0.4s ease ${i * 0.04}s`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
      <span style={{ display: "flex" }}>
        {word2.split("").map((char, i) => (
          <span
            key={i}
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#1d4ed8",
              letterSpacing: "-0.5px",
              display: "inline-block",
              transform: phase === "enter" ? "translateY(10px)" : "translateY(0)",
              opacity: phase === "enter" ? 0 : 1,
              transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${(word1.length + i) * 0.04 + 0.05}s, opacity 0.4s ease ${(word1.length + i) * 0.04 + 0.05}s`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}
