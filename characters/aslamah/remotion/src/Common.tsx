import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { INK } from "./Character";

export const FONTS = `
@font-face{font-family:Gaegu;src:url(${staticFile("fonts/gaegu.woff2")})}
@font-face{font-family:Nunito;font-weight:700;src:url(${staticFile("fonts/nunito.woff2")})}
@font-face{font-family:Nunito;font-weight:800;src:url(${staticFile("fonts/nunito800.woff2")})}
`;
export const CREAM = "#FBF1DF";

export const blinkAt = (f: number, seed = 0) => {
  const p = (f + seed * 37) % 100;
  return p < 4;
};

export const pop = (f: number, start: number, fps: number) =>
  spring({ frame: f - start, fps, config: { damping: 11, stiffness: 160, mass: 0.6 } });

export const fade = (f: number, a: number, b: number, len = 8) =>
  interpolate(f, [a, a + len, b - len, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Sparkle: React.FC<{ x: number; y: number; s: number; o?: number; c?: string }> = ({ x, y, s, o = 1, c = "#FFD66B" }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o}
    d="M0,-30 C4,-8 8,-4 30,0 C8,4 4,8 0,30 C-4,8 -8,4 -30,0 C-8,-4 -4,-8 0,-30 Z" fill={c} stroke={INK} strokeWidth={2 / Math.max(s, 0.3)} />
);

/** Caption chunks: [startFrame, endFrame, text] */
export const Captions: React.FC<{ chunks: [number, number, string][]; y?: number }> = ({ chunks, y = 1650 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = chunks.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, t] = cur;
  const s = interpolate(pop(f, a, fps), [0, 1], [0.85, 1]);
  const o = interpolate(f, [a, a + 4, b - 3, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, display: "flex", justifyContent: "center", opacity: o, transform: `scale(${s})` }}>
      <div style={{ background: "rgba(255,250,240,0.94)", border: `4px solid ${INK}`, borderRadius: 34, padding: "18px 34px", fontFamily: "Nunito", fontWeight: 800, fontSize: 56, lineHeight: 1.22, color: INK, textAlign: "center", boxShadow: "0 8px 0 rgba(91,58,41,0.18)" }}>
        {t}
      </div>
    </div>
  );
};

/** split a sentence into caption chunks across [start, end] by word count */
export function chunk(text: string, start: number, end: number, maxWords = 6): [number, number, string][] {
  const words = text.split(" ");
  const groups: string[][] = [];
  let g: string[] = [];
  for (const w of words) {
    g.push(w);
    if (g.length >= maxWords || /[.,?!]$/.test(w) && g.length >= 3) { groups.push(g); g = []; }
  }
  if (g.length) groups.push(g);
  const total = words.reduce((s, w) => s + w.length + 2, 0);
  let t = start;
  return groups.map((gr) => {
    const len = gr.reduce((s, w) => s + w.length + 2, 0);
    const d = ((end - start) * len) / total;
    const r: [number, number, string] = [Math.round(t), Math.round(t + d), gr.join(" ")];
    t += d;
    return r;
  });
}

export const Title: React.FC<{ text: string; y?: number; size?: number; start?: number; color?: string }> = ({ text, y = 150, size = 96, start = 0, color = INK }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, start, fps);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, textAlign: "center", fontFamily: "Gaegu", fontSize: size, color, transform: `scale(${s})`, lineHeight: 1.05 }}>
      {text}
    </div>
  );
};

export const ease = Easing.bezier(0.33, 1, 0.68, 1);
