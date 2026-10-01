import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export const GOLD = "#E8B95A";
export const CREAM = "#F6EBD3";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PaintTexture: React.FC<{ o?: number }> = ({ o = 0.22 }) => (
  <AbsoluteFill style={{ opacity: o, mixBlendMode: "soft-light" }}>
    <svg width="1080" height="1920">
      <filter id="paint2">
        <feTurbulence type="turbulence" baseFrequency="0.012 0.05" numOctaves="4" seed={11} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="1080" height="1920" filter="url(#paint2)" />
    </svg>
  </AbsoluteFill>
);

export const Vignette: React.FC<{ s?: number }> = ({ s = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s}) 100%)`,
    }}
  />
);

export const SoftRays: React.FC<{ cx: number; cy: number; n?: number; a?: number; spin?: number }> = ({
  cx,
  cy,
  n = 18,
  a = 0.06,
  spin = 0,
}) => {
  const rays = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * 360 + spin;
    const w = 4 + random(`ray${i}`) * 7;
    const p = (d: number) =>
      `${cx + 2600 * Math.cos(((ang + d) * Math.PI) / 180)},${cy + 2600 * Math.sin(((ang + d) * Math.PI) / 180)}`;
    rays.push(<polygon key={i} points={`${cx},${cy} ${p(-w / 2)} ${p(w / 2)}`} fill={`rgba(255,214,150,${a})`} />);
  }
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", filter: "blur(14px)" }}>
      {rays}
    </svg>
  );
};

// ---------------- SHIP ----------------
// mode: "replace" -> planks renew one by one; "explode" -> planks fly apart
export const Ship: React.FC<{ dur: number; mode: "replace" | "explode" | "calm"; speed?: number }> = ({
  dur,
  mode,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const p = interpolate(frame, [0, dur * 0.9], [0, 1], clamp);
  const bob = Math.sin(t * 1.6 * speed) * 1.6;
  const lift = Math.sin(t * 1.3 * speed) * 8;
  const zoom = interpolate(frame, [0, dur], [1.0, 1.1]);
  const rows = 6;
  const cols = 6;
  const planks = [];
  const order: number[] = [];
  for (let i = 0; i < rows * cols; i++) order.push(i);
  order.sort((a, b) => random(`o${a}`) - random(`o${b}`));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const rank = order.indexOf(i) / (rows * cols);
      const x = 200 + c * 113;
      const y = 1000 + r * 32;
      let fill = r % 2 ? "#4e301b" : "#5b3820";
      let dx = 0,
        dy = 0,
        rot = 0,
        glow = 0;
      if (mode === "replace") {
        const k = interpolate(p, [rank * 0.92, rank * 0.92 + 0.08], [0, 1], clamp);
        glow = k > 0 && k < 1 ? 1 : 0;
        fill = k >= 1 ? (r % 2 ? "#b77a43" : "#c98b50") : fill;
        dy = k > 0 && k < 1 ? -14 * Math.sin(k * Math.PI) : 0;
      }
      if (mode === "explode") {
        const k = interpolate(p, [0.08, 0.9], [0, 1], clamp);
        const ang = random(`a${i}`) * Math.PI * 2;
        const sp = 300 + random(`s${i}`) * 700;
        dx = Math.cos(ang) * sp * k;
        dy = Math.sin(ang) * sp * k - 200 * k + 600 * k * k;
        rot = (random(`r${i}`) - 0.5) * 540 * k;
      }
      planks.push(
        <g key={i} transform={`translate(${x + 56 + dx},${y + 15 + dy}) rotate(${rot})`}>
          <rect
            x={-56}
            y={-15}
            width={110}
            height={30}
            rx={3}
            fill={fill}
            stroke="#2a170b"
            strokeWidth={2}
            style={glow ? { filter: "drop-shadow(0 0 14px #ffcf7a)" } : undefined}
          />
          <line x1={-40} y1={-4} x2={30} y2={-6} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
        </g>,
      );
    }
  }
  const waves = (y: number, amp: number, ph: number, col: string, k: number) => {
    let d = `M -50 ${y}`;
    for (let x = -50; x <= 1130; x += 30) {
      d += ` L ${x} ${y + Math.sin(x / 90 + t * 1.4 * speed + ph) * amp + Math.sin(x / 37 + t * 2.2 * speed) * amp * 0.3}`;
    }
    d += ` L 1130 1920 L -50 1920 Z`;
    return <path key={k} d={d} fill={col} />;
  };
  const hullClip = "M 190 995 L 890 995 Q 870 1150 760 1200 L 320 1200 Q 210 1150 190 995 Z";
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #2b1a2e 0%, #7a3b2c 28%, #d27a3e 47%, #f2b766 55%, #3b2a2a 58%, #1b1414 100%)",
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 62% 52%, rgba(255,232,180,0.95) 0%, rgba(255,180,90,0.5) 8%, rgba(0,0,0,0) 28%)",
          }}
        />
        <SoftRays cx={670} cy={1000} n={20} a={0.05} spin={frame * 0.1} />
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          {waves(1120, 10, 0, "#3d2a2b", 1)}
          <g transform={`translate(0,${lift}) rotate(${bob} 540 1100)`}>
            {mode !== "explode" && (
              <>
                <line x1={540} y1={1000} x2={540} y2={470} stroke="#2a170b" strokeWidth={14} />
                <line x1={380} y1={560} x2={700} y2={560} stroke="#2a170b" strokeWidth={8} />
                <path
                  d={`M 392 568 L 688 568 Q ${700 + Math.sin(t * 2) * 14} 740 672 905 Q 540 ${960 + Math.sin(t * 2) * 10} 408 905 Q ${380 + Math.sin(t * 2) * 14} 740 392 568 Z`}
                  fill="#efe0c0"
                  opacity={0.96}
                />
                <path d="M 540 570 L 540 930" stroke="rgba(120,80,40,0.35)" strokeWidth={4} />
                <path d="M 420 700 Q 540 730 660 700 M 415 820 Q 540 860 665 820" stroke="rgba(120,80,40,0.25)" strokeWidth={3} fill="none" />
                <path d={`M 540 470 L 600 ${485 + Math.sin(t * 5) * 6} L 540 500 Z`} fill="#a8382a" />
              </>
            )}
            {mode !== "explode" && <path d={hullClip} fill="#2a170b" />}
            <clipPath id="hull">
              <path d={hullClip} />
            </clipPath>
            <g clipPath={mode === "explode" ? undefined : "url(#hull)"}>{planks}</g>
          </g>
          {waves(1170, 14, 1.3, "#2a1d1f", 2)}
          {waves(1260, 18, 2.4, "#1b1214", 3)}
          {[...Array(30)].map((_, i) => (
            <circle
              key={i}
              cx={(random(`gx${i}`) * 1080 + t * 20) % 1080}
              cy={1130 + random(`gy${i}`) * 200}
              r={2 + random(`gr${i}`) * 3}
              fill="#ffd79a"
              opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 3 + i))}
            />
          ))}
        </svg>
      </AbsoluteFill>
      <PaintTexture o={0.3} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------- HUMAN SILHOUETTE + particles ----------------
const inside = (x: number, y: number) => {
  if ((x - 540) ** 2 + (y - 640) ** 2 < 78 ** 2) return true;
  if (x > 515 && x < 565 && y > 700 && y < 760) return true;
  if (x > 420 && x < 660 && y > 750 && y < 1130) {
    const top = y < 800 ? (Math.abs(x - 540) < 120 - (800 - y) * 0.8 ? 1 : 0) : 1;
    return !!top;
  }
  if (((x > 360 && x < 418) || (x > 662 && x < 720)) && y > 790 && y < 1120) return true;
  if (((x > 445 && x < 532) || (x > 548 && x < 635)) && y > 1125 && y < 1520) return true;
  return false;
};
const PTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let y = 560; y < 1520; y += 17)
    for (let x = 350; x < 730; x += 17) {
      const jx = x + (random(`jx${x},${y}`) - 0.5) * 8;
      const jy = y + (random(`jy${x},${y}`) - 0.5) * 8;
      if (inside(jx, jy)) out.push([jx, jy]);
    }
  return out;
})();

export const Silhouette: React.FC<{ fill: string; scale?: number; opacity?: number }> = ({
  fill,
  scale = 1,
  opacity = 1,
}) => (
  <g transform={`translate(540 1520) scale(${scale}) translate(-540 -1520)`} fill={fill} opacity={opacity}>
    <circle cx={540} cy={640} r={78} />
    <rect x={515} y={700} width={50} height={60} />
    <path d="M 420 1130 L 420 820 Q 420 760 480 752 L 600 752 Q 660 760 660 820 L 660 1130 Z" />
    <rect x={360} y={790} width={58} height={330} rx={29} />
    <rect x={662} y={790} width={58} height={330} rx={29} />
    <rect x={445} y={1120} width={87} height={400} rx={30} />
    <rect x={548} y={1120} width={87} height={400} rx={30} />
  </g>
);

// mode: "cells" (cells dying & renewing), "grow" (child grows), "soul" (glowing rooh), "rebuild" (dust reassembles)
export const Body: React.FC<{ dur: number; mode: "cells" | "grow" | "soul" | "rebuild"; label?: string }> = ({
  dur,
  mode,
  label,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const zoom = interpolate(frame, [0, dur], [1.0, 1.08]);
  const growS = mode === "grow" ? interpolate(frame, [4, dur - 6], [0.55, 1], clamp) : 1;
  const dots = PTS.map(([x, y], i) => {
    let o = 0.85,
      col = "#ffcf8a",
      px = x,
      py = y,
      r = 4.2;
    if (mode === "cells") {
      const period = 1.6 + random(`p${i}`) * 1.4;
      const ph = random(`ph${i}`) * period;
      const k = ((t + ph) % period) / period;
      o = k < 0.15 ? k / 0.15 : k > 0.8 ? (1 - k) / 0.2 : 1;
      const gen = Math.floor((t + ph) / period);
      col = gen % 2 ? "#ffd894" : "#e88a4c";
      r = 3 + 2.5 * o;
    }
    if (mode === "rebuild") {
      const k = interpolate(frame, [random(`d${i}`) * dur * 0.35, dur * 0.4 + random(`d${i}`) * dur * 0.35], [0, 1], clamp);
      const e = 1 - (1 - k) ** 3;
      const sx = random(`sx${i}`) * 1300 - 110;
      const sy = 1450 + random(`sy${i}`) * 500;
      px = sx + (x - sx) * e;
      py = sy + (y - sy) * e;
      o = 0.3 + 0.7 * e;
    }
    if (mode === "grow") {
      px = 540 + (x - 540) * growS;
      py = 1520 + (y - 1520) * growS;
      o = 0.5 + 0.3 * Math.sin(t * 4 + i);
    }
    if (mode === "soul") {
      o = 0.18;
      col = "#c89060";
    }
    return <circle key={i} cx={px} cy={py} r={r} fill={col} opacity={o} />;
  });
  const glow = 0.75 + 0.25 * Math.sin(t * 4);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a160a 0%, #0c0705 60%, #050302 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {mode === "soul" && <SoftRays cx={540} cy={900} n={22} a={0.07} spin={frame * 0.3} />}
        <svg width="1080" height="1920" style={{ position: "absolute" }}>
          {mode === "grow" && <Silhouette fill="#ffcf8a" scale={0.55} opacity={0.12} />}
          <Silhouette fill={mode === "soul" ? "#1c0f07" : "#140b06"} scale={growS} opacity={0.9} />
          {dots}
          {mode === "soul" && (
            <>
              <circle cx={540} cy={900} r={160 * glow} fill="url(#sg)" />
              <defs>
                <radialGradient id="sg">
                  <stop offset="0%" stopColor="#fffbe8" stopOpacity={1} />
                  <stop offset="35%" stopColor="#ffd27a" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ff9a3a" stopOpacity={0} />
                </radialGradient>
              </defs>
              {[...Array(40)].map((_, i) => {
                const k = ((t * 0.5 + random(`u${i}`)) % 1);
                return (
                  <circle
                    key={i}
                    cx={540 + (random(`ux${i}`) - 0.5) * 300 + Math.sin(t * 2 + i) * 20}
                    cy={900 - k * 700}
                    r={2 + random(`ur${i}`) * 4}
                    fill="#ffe2a8"
                    opacity={(1 - k) * 0.9}
                  />
                );
              })}
            </>
          )}
        </svg>
      </AbsoluteFill>
      {label && (
        <div
          style={{
            position: "absolute",
            top: 330,
            width: "100%",
            textAlign: "center",
            fontFamily: "Cinzel",
            fontSize: 64,
            color: GOLD,
            letterSpacing: 6,
            textShadow: "0 0 24px rgba(232,185,90,0.6)",
            opacity: interpolate(frame, [4, 12], [0, 1], clamp),
          }}
        >
          {label}
        </div>
      )}
      <PaintTexture />
      <Vignette s={0.8} />
    </AbsoluteFill>
  );
};

// ---------------- crumbling text ----------------
export const Crumble: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  return (
    <AbsoluteFill style={{ background: "#080504", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(200,110,50,0.3), rgba(0,0,0,0) 55%)" }} />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: 960, marginTop: -200 }}>
        {chars.map((c, i) => {
          const st = dur * 0.35 + random(`c${i}`) * dur * 0.25;
          const k = Math.max(0, frame - st) / 30;
          return (
            <span
              key={i}
              style={{
                fontFamily: "Pop",
                fontWeight: 700,
                fontSize: 130,
                color: i < 4 ? "#f6ebd3" : GOLD,
                display: "inline-block",
                whiteSpace: "pre",
                transform: `translate(${(random(`cx${i}`) - 0.5) * 200 * k}px, ${1400 * k * k}px) rotate(${(random(`cr${i}`) - 0.5) * 400 * k}deg)`,
                opacity: 1 - Math.min(1, k * 1.2),
                textShadow: "0 0 20px rgba(232,185,90,0.4)",
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
      <PaintTexture />
      <Vignette />
    </AbsoluteFill>
  );
};
