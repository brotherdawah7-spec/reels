import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Character, Defs, INK } from "./Character";
import { Rug, Books, Plant, Steam, Drop } from "./Props";
import { Captions, chunk, FONTS, CREAM, blinkAt, pop, Sparkle, Title, ease } from "./Common";

export const VO = { L1: 30, L2: 180, L3: 486, L4: 690, L5: 1170, L6: 1540 };
const LEN = { L1: 85, L2: 199, L3: 125, L4: 325, L5: 252, L6: 180 };
const TXT = {
  L1: "Have you ever noticed something strange about wudu?",
  L2: "When our wudu breaks, we don't wash the place it broke from. We wash our hands, our face, our arms, our feet.",
  L3: "So wudu isn't only about cleaning dirt. It's something spiritual.",
  L4: "The Prophet ﷺ said his ummah will come on the Day of Judgment, shining from the traces of wudu. Like a dark horse with a white blaze, easy to spot among hundreds.",
  L5: "And whoever makes wudu well, then bears witness to the shahada, the eight gates of Jannah open for them. They may enter from whichever they wish.",
  L6: "A few splashes of water, every day. Never a small thing.",
};
const CAPS = (Object.keys(VO) as (keyof typeof VO)[]).flatMap((k) => chunk(TXT[k], VO[k], VO[k] + LEN[k] + (k === "L6" ? -60 : 0)));

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
    <Defs />{children}
  </svg>
);
const XFade: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 10, from + dur - 10, from + dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Sequence from={from} durationInFrames={dur}><AbsoluteFill style={{ opacity: from === 0 ? (f < from + dur - 10 ? 1 : o) : o }}>{children}</AbsoluteFill></Sequence>;
};

/* ---------- Scene 1: puzzled on the rug ---------- */
const RugScene: React.FC<{ happy?: boolean; endText?: boolean }> = ({ happy, endText }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = happy ? Math.sin(f / 14) * 3 : interpolate(f, [20, 40], [0, -8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + Math.sin(f / 20) * 1.5;
  const q = pop(f, 45, fps);
  const eyes = happy ? (f > 40 ? "happy" : "open") : f < 40 ? "open" : "up";
  return (
    <Svg>
      <Rug x={540} y={1300} w={900} />
      <Plant x={905} y={1205} sway={Math.sin(f / 25) * 3} />
      <Books x={900} y={1290} />
      <Character x={540} y={1300} scale={1.75} pose="mug" eyes={eyes as any} tilt={tilt} blink={blinkAt(f)} bob={Math.sin(f / 18) * 3} />
      <Steam x={540} y={980} t={f} />
      {!happy && (
        <g transform={`translate(800,470) scale(${q})`}>
          <ellipse cx={0} cy={0} rx={95} ry={80} fill="#fff" stroke={INK} strokeWidth={5} />
          <circle cx={-90} cy={95} r={18} fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={-120} cy={130} r={10} fill="#fff" stroke={INK} strokeWidth={4} />
          <text x={0} y={42} textAnchor="middle" fontFamily="Gaegu" fontSize={130} fill={INK}>?</text>
        </g>
      )}
      {happy && [0, 1, 2, 3, 4].map((i) => {
        const t = (f + i * 23) % 70;
        return <Sparkle key={i} x={300 + i * 120} y={600 - t * 3 + (i % 2) * 80} s={0.6 + 0.3 * Math.sin((f + i * 10) / 8)} o={interpolate(t, [0, 15, 55, 70], [0, 1, 1, 0])} />;
      })}
    </Svg>
  );
};

/* ---------- Scene 2: what we wash ---------- */
const PartCard: React.FC<{ x: number; y: number; label: string; start: number; icon: "hand" | "face" | "arm" | "foot" }> = ({ x, y, label, start, icon }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, start, fps);
  const chk = pop(f, start + 10, fps);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-200} y={-120} width={400} height={240} rx={36} fill="#FFFAF0" stroke={INK} strokeWidth={5} />
      <g transform="translate(-95,-10)">
        {icon === "hand" && <g><ellipse cx={0} cy={10} rx={42} ry={48} fill="#FBE3D2" stroke={INK} strokeWidth={4} />{[-26, -9, 8, 25].map((dx) => <rect key={dx} x={dx - 7} y={-62} width={15} height={50} rx={7} fill="#FBE3D2" stroke={INK} strokeWidth={4} />)}<rect x={34} y={-6} width={15} height={40} rx={7} transform="rotate(-35 40 10)" fill="#FBE3D2" stroke={INK} strokeWidth={4} /></g>}
        {icon === "face" && <g><circle cx={0} cy={0} r={56} fill="#F2C28E" stroke={INK} strokeWidth={4} /><path d="M-44,-12 Q0,-30 44,-12 L44,14 Q0,4 -44,14 Z" fill="#FBE3D2" stroke={INK} strokeWidth={3} /><circle cx={-18} cy={0} r={6} fill="#3B2418" /><circle cx={18} cy={0} r={6} fill="#3B2418" /></g>}
        {icon === "arm" && <g><path d="M-60,40 Q-20,-10 30,-30 L48,-8 Q0,10 -38,58 Z" fill="#FBE3D2" stroke={INK} strokeWidth={4} /><circle cx={44} cy={-24} r={20} fill="#FBE3D2" stroke={INK} strokeWidth={4} /></g>}
        {icon === "foot" && <g><path d="M-40,-50 h36 v60 q50,4 54,30 q0,20 -30,20 h-60 Z" fill="#FBE3D2" stroke={INK} strokeWidth={4} /></g>}
        <Drop x={52} y={-62} s={1.1} />
      </g>
      <text x={55} y={20} textAnchor="middle" fontFamily="Gaegu" fontSize={74} fill={INK}>{label}</text>
      <g transform={`translate(165,-95) scale(${chk})`}>
        <circle r={30} fill="#8FA35E" stroke={INK} strokeWidth={4} />
        <path d="M-13,1 l9,10 l17,-20" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const WashScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = VO.L2 - 165; // local offset of voice start
  const notS = pop(f, o + 20, fps);
  const notO = interpolate(f, [o + 95, o + 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drops = [];
  for (let i = 0; i < 14; i++) {
    const t = (f * 6 + i * 53) % 260;
    drops.push(<Drop key={i} x={420 + ((i * 47) % 240)} y={1140 + t} s={0.7} />);
  }
  return (
    <Svg>
      {notO > 0 && (
        <g transform={`translate(540,620) scale(${notS})`} opacity={notO}>
          <rect x={-380} y={-110} width={760} height={220} rx={40} fill="#FFFAF0" stroke={INK} strokeWidth={5} />
          <text x={40} y={-8} textAnchor="middle" fontFamily="Gaegu" fontSize={72} fill={INK}>not the place</text>
          <text x={40} y={66} textAnchor="middle" fontFamily="Gaegu" fontSize={72} fill={INK}>it broke from</text>
          <g transform="translate(-290,0)"><circle r={50} fill="#E88B7E" stroke={INK} strokeWidth={4} /><path d="M-20,-20 L20,20 M20,-20 L-20,20" stroke="#fff" strokeWidth={10} strokeLinecap="round" /></g>
        </g>
      )}
      <PartCard x={300} y={450} label="Hands" start={o + 115} icon="hand" />
      <PartCard x={780} y={450} label="Face" start={o + 133} icon="face" />
      <PartCard x={300} y={760} label="Arms" start={o + 151} icon="arm" />
      <PartCard x={780} y={760} label="Feet" start={o + 170} icon="foot" />
      {drops}
      <Character x={540} y={1530} scale={1.2} pose="wash" eyes={f > o + 115 ? "happy" : "open"} sitting={false} blink={blinkAt(f, 2)} bob={Math.abs(Math.sin(f / 9)) * -6} />
    </Svg>
  );
};

/* ---------- Scene 3: spiritual ---------- */
const SpiritScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg>
      <Character x={540} y={1440} scale={1.6} pose="present" eyes={f > 60 ? "happy" : "open"} sitting={false} glow={glow} blink={blinkAt(f, 3)} />
      {[...Array(9)].map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + f / 50;
        const r = 380 + Math.sin(f / 12 + i) * 30;
        return <Sparkle key={i} x={540 + Math.cos(a) * r} y={960 + Math.sin(a) * r * 0.9} s={(0.5 + 0.35 * Math.sin(f / 7 + i)) * glow} o={glow} />;
      })}
    </Svg>
  );
};

/* ---------- Scene 4a: crowd on the Day of Judgment ---------- */
const CrowdScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [20, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const people = [];
  const cols = ["#9C8E86", "#8D8378", "#A3968B", "#857A72"];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      const x = 90 + c * 150 + (r % 2) * 75;
      const y = 720 + r * 150;
      if (r >= 2 && r <= 4 && x > 330 && x < 750) continue;
      const s = 0.8 + r * 0.06;
      people.push(
        <g key={r + "-" + c} transform={`translate(${x},${y + Math.sin(f / 15 + c + r) * 3}) scale(${s})`}>
          <path d="M-42,80 Q-40,10 0,6 Q40,10 42,80 Z" fill={cols[(r + c) % 4]} stroke="#6B5F58" strokeWidth={3} />
          <circle cx={0} cy={-18} r={30} fill={cols[(r + c + 1) % 4]} stroke="#6B5F58" strokeWidth={3} />
        </g>
      );
    }
  }
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#5E5470, #8D7E8E 60%, #C9B39C)" }}>
      <Svg>
        {[...Array(30)].map((_, i) => <circle key={i} cx={(i * 137) % 1080} cy={(i * 71) % 520 + 60} r={2 + (i % 3)} fill="#FFF6D8" opacity={0.4 + 0.4 * Math.sin(f / 10 + i)} />)}
        {people}
        <Character x={540} y={1430} scale={1.05} pose="present" eyes="happy" sitting={false} glow={glow} blink={blinkAt(f, 4)} />
        {[[400, 1060], [680, 1060], [380, 1360], [700, 1360], [540, 820]].map(([x, y], i) => (
          <Sparkle key={i} x={x} y={y} s={(0.45 + 0.25 * Math.sin(f / 6 + i)) * glow} o={glow} />
        ))}
      </Svg>
      <Title text="shining from the traces of wudu" y={200} size={80} start={40} color="#FFF4D6" />
    </AbsoluteFill>
  );
};

/* ---------- Scene 4b: horses ---------- */
const Horse: React.FC<{ x: number; y: number; s?: number; blaze?: boolean; t: number; flip?: boolean }> = ({ x, y, s = 1, blaze, t, flip }) => {
  const body = blaze ? "#4A2E22" : ["#3F2A22", "#5A3B2B", "#2F241F"][Math.abs(Math.round(x + y)) % 3];
  const leg = (lx: number, ph: number) => (
    <g key={lx}>
      <rect x={lx - 9} y={18} width={18} height={70} rx={8} fill={body} stroke={INK} strokeWidth={3} transform={`rotate(${Math.sin(t / 8 + ph) * 4},${lx},20)`} />
      {blaze && <rect x={lx - 9} y={60} width={18} height={28} rx={6} fill="#fff" stroke={INK} strokeWidth={3} transform={`rotate(${Math.sin(t / 8 + ph) * 4},${lx},20)`} />}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <path d="M-70,-20 q-40,10 -36,60" stroke={body} strokeWidth={16} fill="none" strokeLinecap="round" />
      {leg(-50, 0)}{leg(-25, 2)}{leg(35, 1)}{leg(58, 3)}
      <ellipse cx={0} cy={0} rx={82} ry={44} fill={body} stroke={INK} strokeWidth={3.5} />
      <path d="M48,-20 L74,-82 L104,-74 L84,-6 Z" fill={body} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <g transform={`rotate(${Math.sin(t / 15) * 4},88,-80)`}>
        <ellipse cx={104} cy={-78} rx={40} ry={22} transform="rotate(28 104 -78)" fill={body} stroke={INK} strokeWidth={3.5} />
        <path d="M80,-100 l-4,-26 l18,18 Z" fill={body} stroke={INK} strokeWidth={3} />
        {blaze && <path d="M92,-92 Q112,-80 130,-58 L122,-54 Q104,-74 86,-86 Z" fill="#fff" />}
        <circle cx={96} cy={-86} r={4.5} fill="#fff" />
      </g>
      <path d="M66,-80 q-8,24 -16,50 M74,-86 q-6,22 -12,44" stroke="#1E1612" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};

const HorseScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = pop(f, 50, fps);
  const horses: [number, number, number, boolean][] = [
    [190, 820, 0.7, false], [540, 800, 0.66, true], [890, 820, 0.7, true],
    [120, 1010, 0.8, true], [960, 1010, 0.8, false],
    [210, 1400, 0.95, false], [870, 1400, 0.95, true],
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#CFE6EE, #EAF2E2 38%, #B9CC8E 40%, #A3BB78)" }}>
      <Svg>
        <circle cx={880} cy={220} r={80} fill="#FFF1B8" opacity={0.9} />
        {horses.slice(0, 5).map(([x, y, s, fl], i) => <Horse key={i} x={x} y={y} s={s} t={f + i * 7} flip={fl} />)}
        <g opacity={ring}>
          <ellipse cx={540} cy={1150} rx={300 * ring} ry={240 * ring} fill="url(#halo)" />
        </g>
        <Horse x={500} y={1190} s={1.6} blaze t={f} />
        {horses.slice(5).map(([x, y, s, fl], i) => <Horse key={i + 7} x={x} y={y} s={s} t={f + i * 5} flip={fl} />)}
        <g transform={`translate(${800},${930}) scale(${ring})`}>
          <path d="M0,0 C20,-40 120,-60 160,-20" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M-4,-2 l20,-6 M-4,-2 l6,-20" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </g>
      </Svg>
      <Title text="easy to spot" y={560} size={92} start={60} />
      <Title text="among hundreds" y={170} size={96} start={150} />
      <div style={{ position: "absolute", right: 40, top: 1500, fontFamily: "Nunito", fontWeight: 700, fontSize: 34, color: INK, opacity: 0.75 }}>Sahih Muslim</div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 5: eight gates ---------- */
const Gate: React.FC<{ x: number; y: number; open: number; n: number }> = ({ x, y, open, n }) => {
  const w = 190, h = 300;
  const arch = `M${-w / 2},${h / 2} V${-h / 2 + w / 2} A${w / 2},${w / 2} 0 0 1 ${w / 2},${-h / 2 + w / 2} V${h / 2} Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={arch} fill="#FFF6D2" stroke={INK} strokeWidth={5} transform="scale(1.14)" />
      <path d={arch} fill="url(#halo)" />
      <path d={arch} fill="#FFF8DA" opacity={open * 0.8} />
      <g transform={`translate(${-w / 2},0) scale(${1 - open * 0.92},1) translate(${w / 2},0)`}>
        <path d={arch} fill="#6FA59A" stroke={INK} strokeWidth={4.5} />
        <path d={`M0,${-h / 2 + 30} V${h / 2}`} stroke={INK} strokeWidth={3} opacity={0.5} />
        <circle cx={w / 2 - 26} cy={20} r={8} fill="#E9C46A" stroke={INK} strokeWidth={3} />
      </g>
      <text x={0} y={h / 2 + 70} textAnchor="middle" fontFamily="Gaegu" fontSize={54} fill={INK}>{n}</text>
    </g>
  );
};

const GatesScene: React.FC = () => {
  const f = useCurrentFrame();
  const o = VO.L5 - 1140;
  const opens = (i: number) => interpolate(f, [o + 120 + i * 9, o + 136 + i * 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#FBF1DF, #F6E3C2)" }}>
      <Svg>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Gate key={i} n={i + 1} x={165 + (i % 4) * 250} y={520 + Math.floor(i / 4) * 460} open={opens(i)} />
        ))}
        {f > o + 200 && [...Array(8)].map((_, i) => <Sparkle key={i} x={140 + i * 115} y={1290 + Math.sin(f / 9 + i) * 30} s={0.5 + 0.2 * Math.sin(f / 5 + i)} />)}
        <Character x={540} y={1560} scale={0.95} pose={f > o + 120 ? "present" : "rest"} eyes={f > o + 130 ? "wide" : "open"} sitting={false} blink={blinkAt(f, 5)} />
      </Svg>
      <Title text="The 8 gates of Jannah" y={110} size={92} start={o + 110} />
      <div style={{ position: "absolute", right: 40, top: 1500, fontFamily: "Nunito", fontWeight: 700, fontSize: 34, color: INK, opacity: 0.75 }}>Sahih Muslim</div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 6 end ---------- */
const EndScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, 150, fps);
  return (
    <>
      <RugScene happy />
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, textAlign: "center", transform: `scale(${s})` }}>
        <div style={{ fontFamily: "Gaegu", fontSize: 118, color: INK, lineHeight: 1 }}>Purity is half</div>
        <div style={{ fontFamily: "Gaegu", fontSize: 118, color: INK, lineHeight: 1.05 }}>of faith</div>
        <div style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 38, color: INK, opacity: 0.75, marginTop: 14 }}>Sahih Muslim</div>
      </div>
    </>
  );
};

export const Reel1: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <style>{FONTS}</style>
    <XFade from={0} dur={175}><RugScene /></XFade>
    <XFade from={165} dur={310}><AbsoluteFill style={{ background: CREAM }}><WashScene /></AbsoluteFill></XFade>
    <XFade from={465} dur={205}><AbsoluteFill style={{ background: CREAM }}><SpiritScene /><Title text="It's spiritual" y={300} size={120} start={95} /></AbsoluteFill></XFade>
    <XFade from={660} dur={230}><CrowdScene /></XFade>
    <XFade from={880} dur={270}><HorseScene /></XFade>
    <XFade from={1140} dur={385}><GatesScene /></XFade>
    <XFade from={1515} dur={285}><AbsoluteFill style={{ background: CREAM }}><EndScene /></AbsoluteFill></XFade>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}><Defs /><rect width={1080} height={1920} fill="url(#vig)" opacity={0.6} /></svg>
    </AbsoluteFill>
    <Captions chunks={CAPS} />
  </AbsoluteFill>
);
