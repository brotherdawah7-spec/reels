import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Character, Defs, INK, PAL, Eyes, Pose } from "./Character";
import { Plant, Drop } from "./Props";
import { FONTS, blinkAt, pop, Sparkle } from "./Common";
import data from "./reel2.json";

type B = { who: "A" | "F"; text: string; eyes: Eyes; pose: Pose; at: number };
const BUB = data.bubbles as B[];
const END = data.end;
const BOTTOM = 1150, GAP = 26, MAXW = 760, FS = 50, LH = 64;

function lines(text: string) {
  // rough wrap estimate: Nunito 800 @50px ~ 27px/char average
  const per = Math.floor((MAXW - 70) / 27);
  let n = 1, cur = 0;
  for (const w of text.split(" ")) {
    if (cur + w.length > per && cur > 0) { n++; cur = w.length + 1; } else cur += w.length + 1;
  }
  return n;
}
const H = BUB.map((b) => lines(b.text) * LH + 48);

const Bubble: React.FC<{ b: B; y: number; s: number; o: number }> = ({ b, y, s, o }) => {
  const left = b.who === "A";
  const c = left ? PAL.aslamah : PAL.friend;
  return (
    <div style={{ position: "absolute", top: y, left: left ? 60 : undefined, right: left ? undefined : 60, maxWidth: MAXW, opacity: o,
      transform: `scale(${s})`, transformOrigin: left ? "bottom left" : "bottom right" }}>
      <div style={{ background: left ? "#FFF3E2" : "#EEF5E6", border: `4.5px solid ${INK}`, borderRadius: 40,
        borderBottomLeftRadius: left ? 10 : 40, borderBottomRightRadius: left ? 40 : 10,
        padding: "20px 32px", fontFamily: "Nunito", fontWeight: 800, fontSize: FS, lineHeight: `${LH}px`, color: INK,
        boxShadow: `0 7px 0 ${c.shade}` }}>
        {b.text}
      </div>
    </div>
  );
};

const Typing: React.FC<{ x: number; y: number; f: number; s: number }> = ({ x, y, f, s }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-80} y={-40} width={160} height={80} rx={40} fill="#fff" stroke={INK} strokeWidth={4.5} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-38 + i * 38} cy={Math.sin(f / 4 - i) * -7} r={11} fill={INK} opacity={0.75} />)}
  </g>
);

const Garden: React.FC<{ f: number; wet: number }> = ({ f, wet }) => (
  <g>
    <path d="M0 1390 Q270 1350 540 1380 T1080 1370 V1920 H0 Z" fill="#B7CB8A" stroke={INK} strokeWidth={4} />
    <path d="M0 1500 Q300 1470 600 1500 T1080 1490 V1920 H0 Z" fill="#A6BD78" />
    {[...Array(16)].map((_, i) => (
      <path key={i} d={`M${40 + i * 68},${1420 + (i % 3) * 30} q6,-26 ${4 + Math.sin(f / 20 + i) * 6},-44`} stroke="#6E8A45" strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
    {[[120, 1460, "#F4A9A0"], [950, 1450, "#F7D66B"], [70, 1560, "#F7D66B"], [1010, 1580, "#F4A9A0"]].map(([x, y, c], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${Math.sin(f / 22 + i) * 6})`}>
        <path d="M0,0 v-40" stroke="#6E8A45" strokeWidth={5} />
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-58} rx={9} ry={16} fill={c as string} stroke={INK} strokeWidth={2.5} transform={`rotate(${a} 0 -44)`} />)}
        <circle cx={0} cy={-44} r={8} fill="#F2B04A" stroke={INK} strokeWidth={2.5} />
      </g>
    ))}
    {/* tap on a little post */}
    <g transform="translate(990,1350)">
      <rect x={-14} y={-150} width={28} height={190} rx={8} fill="#C9A27A" stroke={INK} strokeWidth={4} />
      <path d="M-14,-140 h-46 q-14,0 -14,14 v10" stroke={INK} strokeWidth={4} fill="#AFC3CC" />
      <rect x={-84} y={-150} width={30} height={22} rx={6} fill="#AFC3CC" stroke={INK} strokeWidth={4} />
      {wet > 0 && [0, 1, 2, 3, 4].map((i) => <Drop key={i} x={-74} y={-100 + ((f * 7 + i * 40) % 200)} s={0.6} />)}
    </g>
    <Plant x={70} y={1400} sway={Math.sin(f / 25) * 3} />
  </g>
);

export const Reel2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = BUB.map((b) => f >= b.at);
  const sp = BUB.map((b) => spring({ frame: f - b.at, fps, config: { damping: 14, stiffness: 140 } }));
  // stack positions
  const ys: number[] = BUB.map(() => 0);
  for (let i = 0; i < BUB.length; i++) {
    let off = 0;
    for (let j = i + 1; j < BUB.length; j++) if (shown[j]) off += (H[j] + GAP) * sp[j];
    ys[i] = BOTTOM - H[i] - off;
  }
  const lastIdx = shown.lastIndexOf(true);
  const cur = lastIdx >= 0 ? BUB[lastIdx] : null;
  const next = BUB.find((b) => b.at > f);
  const typing = next && next.at - f <= 22 && next.at - f > 0 && f > 20;
  const lastA = [...BUB].reverse().find((b) => b.who === "A" && b.at <= f);
  const lastF = [...BUB].reverse().find((b) => b.who === "F" && b.at <= f);
  const talkA = cur?.who === "A" ? Math.abs(Math.sin((f - cur.at) / 5)) * -8 * (f - cur.at < 40 ? 1 : 0) : 0;
  const talkF = cur?.who === "F" ? Math.abs(Math.sin((f - cur!.at) / 5)) * -8 * (f - cur!.at < 40 ? 1 : 0) : 0;
  const endS = pop(f, END, fps);
  const titleO = interpolate(f, [0, 8, 60, 75], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const titleS = pop(f, 0, fps);
  const mud = f > END ? 0.25 : 1;
  const threadO = interpolate(f, [END - 10, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#D9ECF0, #FBF1DF 55%)" }}>
      <style>{FONTS}</style>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs />
        <circle cx={900} cy={170} r={70} fill="#FFF1B8" />
        {[[180, 200], [520, 120]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x + ((f * 0.3 + i * 200) % 400) - 100},${y})`} opacity={0.9}>
            <ellipse cx={0} cy={0} rx={70} ry={30} fill="#fff" /><ellipse cx={40} cy={-18} rx={44} ry={30} fill="#fff" /><ellipse cx={-36} cy={-10} rx={36} ry={24} fill="#fff" />
          </g>
        ))}
        <Garden f={f} wet={f > BUB[11].at ? 1 : 0} />
        <Character x={300} y={1720} scale={1.15} who="aslamah" sitting={false} eyes={lastA?.eyes ?? "open"} pose={lastA?.pose ?? "rest"}
          blink={blinkAt(f)} bob={talkA} tilt={cur?.who === "F" ? 4 : 0} lookX={4} />
        <Character x={790} y={1720} scale={1.15} who="friend" sitting={false} eyes={f < 75 ? "wide" : lastF?.eyes ?? "open"} pose={f < 75 ? "shrug" : lastF?.pose ?? "rest"}
          blink={blinkAt(f, 3)} bob={talkF} tilt={cur?.who === "A" ? -4 : 0} lookX={-4} mud={mud} />
        {typing && next && <Typing x={next.who === "A" ? 470 : 620} y={1240} f={f} s={0.9} />}
        {f > END && [...Array(7)].map((_, i) => <Sparkle key={i} x={150 + i * 130} y={420 + Math.sin(f / 8 + i) * 30} s={(0.4 + 0.2 * Math.sin(f / 5 + i)) * endS} />)}
      </svg>
      <div style={{ opacity: threadO }}>
        {BUB.map((b, i) => shown[i] && ys[i] > -200 ? (
          <Bubble key={i} b={b} y={ys[i]} s={interpolate(sp[i], [0, 1], [0.6, 1])} o={interpolate(ys[i], [-120, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        ) : null)}
      </div>
      {f < 80 && (
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", opacity: titleO, transform: `scale(${titleS})` }}>
          <div style={{ fontFamily: "Gaegu", fontSize: 140, color: INK }}>Dirty or impure?</div>
        </div>
      )}
      {f >= END && (
        <div style={{ position: "absolute", top: 560, left: 40, right: 40, textAlign: "center", transform: `scale(${endS})` }}>
          <div style={{ fontFamily: "Gaegu", fontSize: 150, color: INK, lineHeight: 1 }}>Dirty ≠ Impure</div>
          <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 52, color: INK, marginTop: 30, lineHeight: 1.3 }}>In fiqh, purity is a legal word.<br />No najasa = pure.</div>
        </div>
      )}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}><Defs /><rect width={1080} height={1920} fill="url(#vig)" opacity={0.5} /></svg>
    </AbsoluteFill>
  );
};
