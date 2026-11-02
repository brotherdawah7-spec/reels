import React from "react";

export type Eyes = "open" | "happy" | "wide" | "up" | "closed" | "side";
export type Pose = "mug" | "rest" | "wave" | "think" | "present" | "wash" | "point" | "shrug";

export const PAL = {
  aslamah: { main: "#F2C28E", light: "#F8D9B0", shade: "#E3AC72" },
  friend: { main: "#B9CFA8", light: "#D5E4C8", shade: "#9DB78A" },
};
export const INK = "#5B3A29";
const SKIN = "#FBE3D2";
const EYE = "#3B2418";

type P = {
  x: number; y: number; scale?: number;
  eyes?: Eyes; pose?: Pose; tilt?: number; blink?: boolean;
  who?: "aslamah" | "friend"; sitting?: boolean; mud?: number; glow?: number;
  lookX?: number; bob?: number; flip?: boolean;
};

const HANDS: Record<Pose, [number, number, number, number]> = {
  mug: [176, 392, 224, 392],
  rest: [168, 430, 232, 430],
  wave: [168, 430, 350, 205],
  think: [168, 430, 262, 262],
  present: [96, 330, 304, 330],
  wash: [186, 350, 214, 350],
  point: [168, 430, 352, 318],
  shrug: [92, 300, 308, 300],
};

function sleeve(sx: number, sy: number, hx: number, hy: number, fill: string) {
  const dx = hx - sx, dy = hy - sy, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const w0 = 30, w1 = 24;
  const a = [sx + nx * w0, sy + ny * w0], b = [sx - nx * w0, sy - ny * w0];
  const c = [hx - nx * w1 - dx * 0.06, hy - ny * w1 - dy * 0.06], d = [hx + nx * w1 - dx * 0.06, hy + ny * w1 - dy * 0.06];
  return (
    <path d={`M${a} Q${(a[0] + d[0]) / 2 + nx * 8},${(a[1] + d[1]) / 2 + ny * 8} ${d} L${c} Q${(b[0] + c[0]) / 2 - nx * 6},${(b[1] + c[1]) / 2 - ny * 6} ${b} Z`}
      fill={fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  );
}

const Hand: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y} rx={17} ry={15} fill={SKIN} stroke={INK} strokeWidth={4} />
    <path d={`M${x - 9},${y + 4} q5,4 10,1`} stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
  </g>
);

const EyeShape: React.FC<{ cx: number; cy: number; e: Eyes; blink: boolean; left: boolean; lookX: number }> = ({ cx, cy, e, blink, left, lookX }) => {
  const outer = left ? -1 : 1;
  if (blink || e === "closed") return <path d={`M${cx - 11},${cy + 2} Q${cx},${cy + 9} ${cx + 11},${cy + 2}`} stroke={EYE} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
  if (e === "happy") return <path d={`M${cx - 12},${cy + 5} Q${cx},${cy - 10} ${cx + 12},${cy + 5}`} stroke={EYE} strokeWidth={5} fill="none" strokeLinecap="round" />;
  const r = (e === "wide" ? 1.25 : 1) * 1.15;
  const oy = e === "up" ? -4 : 0;
  const ox = (e === "side" ? 4 : 0) + lookX;
  return (
    <g>
      <ellipse cx={cx + ox} cy={cy + oy} rx={9.5 * r} ry={12.5 * r} fill={EYE} />
      <circle cx={cx + ox - 3} cy={cy + oy - 5} r={3.6 * r} fill="#fff" />
      <circle cx={cx + ox + 3} cy={cy + oy + 4} r={1.6} fill="#fff" opacity={0.8} />
      <path d={`M${cx + outer * 8},${cy - 9 * r} l${outer * 7},-5 M${cx + outer * 10},${cy - 4 * r} l${outer * 8},-2`} stroke={EYE} strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
};

export const Character: React.FC<P> = ({ x, y, scale = 1, eyes = "open", pose = "rest", tilt = 0, blink = false, who = "aslamah", sitting = true, mud = 0, glow = 0, lookX = 0, bob = 0, flip = false }) => {
  const c = PAL[who];
  const [lx, ly, rx, ry] = HANDS[pose];
  const browLift = eyes === "wide" ? -6 : eyes === "up" ? -3 : 0;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${flip ? -scale : scale},${scale}) translate(-200,-500)`}>
      {glow > 0 && (
        <g opacity={glow}>
          <ellipse cx={200} cy={300} rx={230} ry={270} fill="url(#halo)" />
        </g>
      )}
      {/* shadow */}
      <ellipse cx={200} cy={500} rx={160} ry={16} fill="#000" opacity={0.08} />
      {/* cloak */}
      <path d="M128 252 C104 330 74 420 50 492 Q200 520 350 492 C326 420 296 330 272 252 Z" fill={c.main} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M150 300 C140 370 125 430 112 488 M250 300 C260 370 275 430 288 488 M200 330 L200 500" stroke={c.shade} strokeWidth={4} fill="none" strokeLinecap="round" />
      {sitting && (
        <g>
          <ellipse cx={160} cy={500} rx={20} ry={11} fill={SKIN} stroke={INK} strokeWidth={3.5} />
          <ellipse cx={240} cy={500} rx={20} ry={11} fill={SKIN} stroke={INK} strokeWidth={3.5} />
          <path d="M70 486 Q200 470 330 486" stroke={INK} strokeWidth={4} fill="none" />
        </g>
      )}
      {mud > 0 && (
        <g opacity={mud} fill="#8A5A3B">
          <ellipse cx={130} cy={440} rx={26} ry={14} /><ellipse cx={255} cy={400} rx={18} ry={11} />
          <ellipse cx={215} cy={470} rx={30} ry={12} /><circle cx={160} cy={380} r={8} /><circle cx={285} cy={455} r={10} />
          <circle cx={102} cy={470} r={6} /><ellipse cx={180} cy={330} rx={12} ry={7} />
        </g>
      )}
      {/* sleeves + hands */}
      {ly >= 340 && sleeve(150, 300, lx, ly, c.main)}
      {ry >= 340 && sleeve(250, 300, rx, ry, c.main)}
      {/* khimar cape */}
      <path d="M96 200 C84 290 104 352 200 362 C296 352 316 290 304 200 Z" fill={c.main} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M130 300 C150 330 175 345 200 348 M270 300 C250 330 225 345 200 348" stroke={c.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {ly < 340 && sleeve(150, 300, lx, ly, c.main)}
      {ry < 340 && sleeve(250, 300, rx, ry, c.main)}
      <Hand x={lx} y={ly} />
      <Hand x={rx} y={ry} />
      {pose === "mug" && (
        <g>
          <path d="M175 368 h50 v42 q0,14 -14,14 h-22 q-14,0 -14,-14 Z" fill="#CFE6D6" stroke={INK} strokeWidth={4} />
          <ellipse cx={200} cy={369} rx={25} ry={6} fill="#7A4A2E" stroke={INK} strokeWidth={3} />
          <Hand x={lx} y={ly} /><Hand x={rx} y={ry} />
        </g>
      )}
      {/* head */}
      <g transform={`rotate(${tilt},200,270)`}>
        <path d="M200 22 C288 22 326 96 320 178 C316 246 284 284 200 290 C116 284 84 246 80 178 C74 96 112 22 200 22 Z" fill={c.main} stroke={INK} strokeWidth={4.5} />
        <path d="M200 26 C190 50 186 70 184 84 M120 70 C140 60 160 56 176 58" stroke={c.shade} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* face opening */}
        <path d="M200 74 C254 74 288 112 288 162 C288 222 252 252 200 254 C148 252 112 222 112 162 C112 112 146 74 200 74 Z" fill={c.light} stroke={INK} strokeWidth={4} />
        {/* skin band */}
        <clipPath id={`face-${who}`}><path d="M200 74 C254 74 288 112 288 162 C288 222 252 252 200 254 C148 252 112 222 112 162 C112 112 146 74 200 74 Z" /></clipPath>
        <g clipPath={`url(#face-${who})`}>
          <path d="M100 132 Q200 104 300 132 L300 180 Q200 168 100 180 Z" fill={SKIN} />
          <path d="M100 180 Q200 168 300 180" stroke={INK} strokeWidth={4} fill="none" />
          <path d="M100 132 Q200 104 300 132" stroke={INK} strokeWidth={4} fill="none" />
        </g>
        {/* brows */}
        <path d={`M150,${130 + browLift} q14,-7 26,-1`} stroke={EYE} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d={`M224,${129 + browLift} q12,-6 26,1`} stroke={EYE} strokeWidth={3} fill="none" strokeLinecap="round" />
        <EyeShape cx={164} cy={153} e={eyes} blink={blink} left lookX={lookX} />
        <EyeShape cx={236} cy={153} e={eyes} blink={blink} left={false} lookX={lookX} />
        {/* blush */}
        <ellipse cx={158} cy={194} rx={14} ry={7.5} fill="#F4A9A0" opacity={0.85} />
        <ellipse cx={242} cy={194} rx={14} ry={7.5} fill="#F4A9A0" opacity={0.85} />
        {glow > 0 && <path d="M100 132 Q200 104 300 132 L300 180 Q200 168 100 180 Z" fill="#FFF6D8" opacity={glow * 0.35} clipPath={`url(#face-${who})`} />}
      </g>
    </g>
  );
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="halo">
      <stop offset="0%" stopColor="#FFF4C8" stopOpacity={0.95} />
      <stop offset="55%" stopColor="#FFE7A0" stopOpacity={0.45} />
      <stop offset="100%" stopColor="#FFE7A0" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="60%" stopColor="#FBF1DF" stopOpacity={0} />
      <stop offset="100%" stopColor="#D9B992" stopOpacity={0.55} />
    </radialGradient>
  </defs>
);
