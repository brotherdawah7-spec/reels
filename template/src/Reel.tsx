import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import tl from "./timeline.json";
import { Body, Crumble, CREAM, GOLD, PaintTexture, Ship, SoftRays, Vignette } from "./Scenes";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const YELLOW = "#FFD54A";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fontHandle = delayRender("fonts");
const fonts: [string, string, string][] = [
  ["Pop", "fonts/Poppins-Bold.ttf", "700"],
  ["Pop", "fonts/Poppins-Medium.ttf", "500"],
  ["Amiri", "fonts/amiri.woff2", "700"],
  ["Cinzel", "fonts/cinzel.woff2", "700"],
  ["PlayfairI", "fonts/playfair-i.woff2", "400"],
];
Promise.all(
  fonts.map(([fam, file, w]) => {
    const ff = new FontFace(fam, `url(${staticFile(file)})`, { weight: w });
    return ff.load().then((l) => document.fonts.add(l));
  }),
).then(() => continueRender(fontHandle));

const fadeInOut = (frame: number, dur: number, k = 6) =>
  interpolate(frame, [0, k, dur - k, dur], [0, 1, 1, 0], clamp);

const HOOK = f(tl.hook.dur);

// ---------- A-roll ----------
const shotStarts = [0, ...tl.captions.map((c) => c.s)];
const ARoll: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = 0;
  for (let i = 0; i < shotStarts.length; i++) if (t >= shotStarts[i]) idx = i;
  const base = 1.0;
  const drift = 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${base * drift})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("aroll.mp4")} muted />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(10,6,3,0.62) 68%, rgba(10,6,3,0.7) 80%, rgba(10,6,3,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay" }}>
      <svg width="1080" height="1920">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- header card covering burned-in title ----------
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 13 } });
  const glow = 0.6 + 0.4 * Math.sin(frame / 14);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 236,
        height: 262,
        borderRadius: 26,
        background: "linear-gradient(180deg, rgb(22,15,8) 0%, rgb(10,7,4) 100%)",
        border: `2px solid rgba(232,185,90,${0.35 + 0.25 * glow})`,
        boxShadow: `0 0 ${24 + 16 * glow}px rgba(232,185,90,0.22), 0 18px 40px rgba(0,0,0,0.55)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${0.92 + 0.08 * s})`,
      }}
    >
      <div style={{ fontFamily: "Cinzel", fontSize: 78, color: GOLD, letterSpacing: 4, lineHeight: 1.05, textShadow: `0 0 ${18 * glow}px rgba(232,185,90,0.5)` }}>
        SHIP OF THESEUS
      </div>
      <div style={{ fontFamily: "Pop", fontWeight: 500, fontSize: 40, color: CREAM, marginTop: 10, letterSpacing: 2 }}>
        Rooh, Jism aur Islam
      </div>
    </div>
  );
};

// ---------- HOOK: high-motion first seconds ----------
type Beat = { from: number; to: number; kind: string; text?: string; sub?: string };
const PIPFace: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 11, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        bottom: 250,
        width: 400,
        height: 520,
        borderRadius: 30,
        overflow: "hidden",
        border: `4px solid ${GOLD}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(232,185,90,0.4)",
        opacity: Math.min(1, s * 1.4),
      }}
    >
      <div style={{ position: "absolute", left: -70, top: -250, width: 540, height: 960 }}>
        <Sequence from={-startFrame}>
          <OffthreadVideo src={staticFile("aroll.mp4")} muted style={{ width: 540, height: 960 }} />
        </Sequence>
      </div>
    </div>
  );
};

const Slam: React.FC<{ text: string; sub?: string; top: number; size?: number }> = ({ text, sub, top, size = 130 }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 8, stiffness: 260 } });
  const sc = 2.2 - 1.2 * s;
  return (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center" }}>
      <div
        style={{
          fontFamily: "Pop",
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1,
          color: "white",
          transform: `scale(${sc})`,
          opacity: Math.min(1, s * 2),
          textShadow: `-6px 0 0 rgba(255,60,60,${0.6 * (1 - s)}), 6px 0 0 rgba(60,200,255,${0.6 * (1 - s)}), 0 8px 30px rgba(0,0,0,0.9)`,
          letterSpacing: 2,
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "Pop",
            fontWeight: 700,
            fontSize: size * 0.62,
            color: GOLD,
            marginTop: 8,
            transform: `scale(${spring({ frame: frame - 3, fps: FPS, config: { damping: 9, stiffness: 240 } })})`,
            textShadow: "0 0 26px rgba(232,185,90,0.7), 0 6px 20px rgba(0,0,0,0.9)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};


const Infographic: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur * 0.9], [0, 1], clamp);
  const k = Math.round(p * 36);
  const day = 1 + Math.round(p * 99);
  const s = spring({ frame, fps: FPS, config: { damping: 14 } });
  const q = spring({ frame: frame - Math.round(dur * 0.55), fps: FPS, config: { damping: 9, stiffness: 220 } });
  const tag = (txt: string, col: string, x: number, y: number, d: number) => {
    const o = spring({ frame: frame - d, fps: FPS, config: { damping: 14 } });
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${0.7 + 0.3 * o})`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: col, border: "2px solid #2a170b" }} />
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 34, color: CREAM, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{txt}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Ship dur={dur} mode="replace" speed={1.5} />
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", opacity: s }}>
        <div style={{ fontFamily: "Cinzel", fontSize: 54, color: GOLD, letterSpacing: 6, textShadow: "0 0 20px rgba(232,185,90,0.6)" }}>SHIP OF THESEUS</div>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 50, color: "white", marginTop: 8, textShadow: "0 4px 16px rgba(0,0,0,0.85)" }}>Roz 1 lakdi badlo…</div>
      </div>
      <div style={{ position: "absolute", top: 410, width: "100%", textAlign: "center", opacity: Math.min(1, q * 1.5), transform: `scale(${1.8 - 0.8 * q})` }}>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 104, color: GOLD, textShadow: "0 0 26px rgba(232,185,90,0.7), 0 6px 20px rgba(0,0,0,0.9)" }}>SAME SHIP?</div>
      </div>
      {tag("purani lakdi", "#5b3820", 90, 1250, 6)}
      {tag("nayi lakdi", "#c98b50", 90, 1305, 10)}
      <div style={{ position: "absolute", left: 60, top: 1390, width: 520, padding: "26px 30px", borderRadius: 24, background: "rgba(14,9,5,0.92)", border: `2px solid ${GOLD}`, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", opacity: s }}>
        <div style={{ fontFamily: "Pop", fontWeight: 500, fontSize: 30, color: CREAM, letterSpacing: 3 }}>DAY</div>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 96, color: "white", lineHeight: 1 }}>{day}</div>
        <div style={{ fontFamily: "Pop", fontWeight: 500, fontSize: 30, color: CREAM, marginTop: 14 }}>Nayi lakdiyan: <span style={{ color: GOLD, fontWeight: 700 }}>{k}/36</span></div>
        <div style={{ marginTop: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: GOLD, boxShadow: "0 0 12px #E8B95A" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HookBeat: React.FC<{ b: Beat; dur: number }> = ({ b, dur }) => {
  const frame = useCurrentFrame();
  const flash = b.from === 0 ? 0 : interpolate(frame, [0, 4], [0.6, 0], clamp);
  const shake = 0;
  const sx = (random(`hx${b.from}-${frame}`) - 0.5) * shake;
  const sy = (random(`hy${b.from}-${frame}`) - 0.5) * shake;
  const blur = 0;
  let scene: React.ReactNode = null;
  const isFace = b.kind === "face";
  if (isFace) {
    const z = 1.4;
    scene = (
      <AbsoluteFill style={{ background: "black" }}>
        <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 85%" }}>
          <Sequence from={-b.from}>
            <OffthreadVideo src={staticFile("aroll.mp4")} muted />
          </Sequence>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)" }} />
      </AbsoluteFill>
    );
  }
  if (b.kind === "ship-replace") scene = <Ship dur={dur} mode="replace" speed={2} />;
  if (b.kind === "infographic") scene = <Infographic dur={dur} />;
  if (b.kind === "ship-explode") scene = <Ship dur={dur} mode="explode" speed={2} />;
  if (b.kind === "cells") scene = <Body dur={dur} mode="cells" />;
  if (b.kind === "soul") scene = <Body dur={dur} mode="soul" />;
  return (
    <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px)`, filter: `blur(${blur}px)` }}>
      {scene}
      {!isFace && <PIPFace startFrame={b.from} />}
      {b.text && b.kind !== "infographic" && <Slam text={b.text} sub={b.sub} top={isFace ? 1180 : 330} size={isFace ? 120 : 130} />}
      <AbsoluteFill style={{ background: "white", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, HOOK], [-40, 140]);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: 0.45,
        background: `radial-gradient(ellipse 40% 60% at ${x}% 30%, rgba(255,150,60,0.8), rgba(0,0,0,0) 70%)`,
      }}
    />
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / HOOK;
  return (
    <AbsoluteFill>
      {(tl.hook.beats as Beat[]).map((b, i) => (
        <Sequence key={i} from={b.from} durationInFrames={b.to - b.from}>
          <HookBeat b={b} dur={b.to - b.from} />
        </Sequence>
      ))}
      <LightLeak />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${progress * 100}%`, background: GOLD, boxShadow: "0 0 20px #E8B95A" }} />
    </AbsoluteFill>
  );
};

// ---------- captions ----------
const Caption: React.FC<{ ru: string; en: string; dur: number }> = ({ ru, en, dur }) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame, fps: FPS, config: { damping: 11, stiffness: 180 } });
  const out = interpolate(frame, [dur - 3, dur], [1, 0], clamp);
  const enIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: 1290, left: 60, right: 60, textAlign: "center", opacity: out }}>
      <div
        style={{
          fontFamily: "Pop",
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.18,
          color: "white",
          transform: `scale(${0.82 + 0.18 * pop})`,
          opacity: Math.min(1, pop * 1.5),
          textShadow: "0 4px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
        }}
      >
        {ru}
      </div>
      <div
        style={{
          fontFamily: "Pop",
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.25,
          marginTop: 16,
          color: CREAM,
          opacity: enIn * 0.95,
          transform: `translateY(${(1 - enIn) * 14}px)`,
          textShadow: "0 3px 10px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {en}
      </div>
    </div>
  );
};

const BigTitle: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const frame = useCurrentFrame();
  const s1 = spring({ frame, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const s2 = spring({ frame: frame - 5, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const shake = 0;
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 4) }}>
      <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 96, lineHeight: 1, color: "white", transform: `scale(${s1})`, textShadow: "0 6px 24px rgba(0,0,0,0.85)" }}>
          {a}
        </div>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 124, lineHeight: 1.05, color: GOLD, transform: `scale(${s2})`, textShadow: "0 0 30px rgba(232,185,90,0.55), 0 6px 24px rgba(0,0,0,0.85)" }}>
          {b}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type BR = { kind: string; s: number; e: number; text?: string };
const BRoll: React.FC<{ b: BR; dur: number }> = ({ b, dur }) => {
  const frame = useCurrentFrame();
  let inner: React.ReactNode = null;
  if (b.kind === "ship-calm") inner = <Ship dur={dur} mode="calm" />;
  if (b.kind === "ship-replace") inner = <Ship dur={dur} mode="replace" />;
  if (b.kind === "ship-explode") inner = <Ship dur={dur} mode="explode" />;
  if (b.kind === "cells") inner = <Body dur={dur} mode="cells" label={b.text} />;
  if (b.kind === "grow") inner = <Body dur={dur} mode="grow" label={b.text} />;
  if (b.kind === "soul") inner = <Body dur={dur} mode="soul" label={b.text} />;
  if (b.kind === "rebuild") inner = <Body dur={dur} mode="rebuild" label={b.text} />;
  if (b.kind === "crumble") inner = <Crumble dur={dur} text={b.text ?? ""} />;
  return <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 5) }}>{inner}</AbsoluteFill>;
};

type V = { s: number; e: number; ar: string; en: string; ref: string };
const Verse: React.FC<{ v: V; dur: number }> = ({ v, dur }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 16 } });
  const s2 = spring({ frame: frame - 8, fps: FPS, config: { damping: 16 } });
  const s3 = spring({ frame: frame - 14, fps: FPS, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 7) }}>
      <AbsoluteFill style={{ background: "rgba(8,5,2,0.86)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(232,170,80,0.28), rgba(0,0,0,0) 55%)" }} />
      <SoftRays cx={540} cy={800} n={16} a={0.05} spin={frame * 0.15} />
      <div style={{ position: "absolute", inset: 0, padding: "0 80px 120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 160, height: 2, background: GOLD, opacity: 0.7 * s, marginBottom: 50 }} />
        <div style={{ fontFamily: "Amiri", fontSize: v.ar.length > 40 ? 76 : 100, lineHeight: 1.75, direction: "rtl", color: "#FFF1D2", opacity: s, transform: `translateY(${(1 - s) * 30}px)`, textShadow: "0 0 24px rgba(232,185,90,0.55)" }}>
          {v.ar}
        </div>
        <div style={{ fontFamily: "PlayfairI", fontSize: 46, lineHeight: 1.35, color: CREAM, marginTop: 40, opacity: s2 }}>“{v.en}”</div>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 44, color: YELLOW, marginTop: 34, opacity: s3, transform: `scale(${0.7 + 0.3 * s3})` }}>{v.ref}</div>
        <div style={{ width: 160, height: 2, background: GOLD, opacity: 0.7 * s, marginTop: 50 }} />
      </div>
      <PaintTexture />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], clamp) * interpolate(frame, [dur - 10, dur], [1, 0], clamp);
  const s = spring({ frame: frame - 4, fps: FPS, config: { damping: 10 } });
  const s2 = spring({ frame: frame - 14, fps: FPS, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: "#070503", opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(232,170,80,0.35), rgba(0,0,0,0) 50%)" }} />
      <SoftRays cx={540} cy={800} spin={frame * 0.3} />
      <PaintTexture />
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: "Cinzel", fontSize: 120, color: GOLD, transform: `scale(${s})`, textShadow: "0 0 40px rgba(232,185,90,0.6)", letterSpacing: 6 }}>
          {tl.endCard.title}
        </div>
        <div style={{ fontFamily: "PlayfairI", fontSize: 58, color: CREAM, opacity: s2, marginTop: 10 }}>{tl.endCard.sub}</div>
        <div style={{ fontFamily: "Pop", fontWeight: 700, fontSize: 40, color: YELLOW, opacity: s2, marginTop: 60 }}>@brother.dawah</div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const mid = (s: number, e: number) => (s + e) / 2;
  const covered = (s: number, e: number) => (tl.verses as V[]).some((v) => mid(s, e) > v.s && mid(s, e) < v.e) || e <= tl.hook.dur + 0.05;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={f(tl.duration)}>
        <ARoll />
      </Sequence>
      <Sequence from={HOOK - 2} durationInFrames={f(tl.duration) - HOOK + 2}>
        <Header />
      </Sequence>
      {tl.titles.map((t, i) => (
        <Sequence key={`t${i}`} from={f(t.s)} durationInFrames={f(t.e - t.s)}>
          <BigTitle a={t.a} b={t.b} dur={f(t.e - t.s)} />
        </Sequence>
      ))}
      {(tl.broll as BR[]).map((b, i) => (
        <Sequence key={`b${i}`} from={f(b.s)} durationInFrames={f(b.e - b.s)}>
          <BRoll b={b} dur={f(b.e - b.s)} />
        </Sequence>
      ))}
      {(tl.verses as V[]).map((v, i) => (
        <Sequence key={`v${i}`} from={f(v.s)} durationInFrames={f(v.e - v.s)}>
          <Verse v={v} dur={f(v.e - v.s)} />
        </Sequence>
      ))}
      {tl.captions.map((c, i) =>
        covered(c.s, c.e) ? null : (
          <Sequence key={`c${i}`} from={Math.max(f(c.s), HOOK)} durationInFrames={Math.max(1, f(c.e) - Math.max(f(c.s), HOOK))}>
            <Caption ru={c.ru} en={c.en} dur={f(c.e) - Math.max(f(c.s), HOOK)} />
          </Sequence>
        ),
      )}
      <Sequence durationInFrames={HOOK}>
        <Hook />
      </Sequence>
      <Sequence from={f(tl.endCard.s)} durationInFrames={f(tl.endCard.dur)}>
        <EndCard dur={f(tl.endCard.dur)} />
      </Sequence>
      {null}
    </AbsoluteFill>
  );
};
