import React from "react";
import { INK } from "./Character";

export const Rug: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 760 }) => {
  const h = w * 0.2;
  const fr = [];
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    fr.push(<path key={"l" + i} d={`M${x - w / 2 + 8},${y - h / 2 + 10 + t * (h - 20)} l-28,${(t - 0.5) * 6}`} stroke="#9C6A43" strokeWidth={4} strokeLinecap="round" />);
    fr.push(<path key={"r" + i} d={`M${x + w / 2 - 8},${y - h / 2 + 10 + t * (h - 20)} l28,${(t - 0.5) * 6}`} stroke="#9C6A43" strokeWidth={4} strokeLinecap="round" />);
  }
  const hearts = [];
  for (let i = 0; i < 9; i++) {
    const hx = x - w / 2 + 70 + i * ((w - 140) / 8);
    hearts.push(<path key={"h" + i} d={`M${hx},${y + h / 2 - 22} c-8,-9 -16,0 0,10 c16,-10 8,-19 0,-10 Z`} fill="#A8714A" />);
    hearts.push(<path key={"t" + i} d={`M${hx},${y - h / 2 + 16} c-8,-9 -16,0 0,10 c16,-10 8,-19 0,-10 Z`} fill="#A8714A" />);
  }
  return (
    <g>
      {fr}
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill="#EBC896" stroke={INK} strokeWidth={4.5} />
      <rect x={x - w / 2 + 34} y={y - h / 2 + 34} width={w - 68} height={h - 68} rx={30} fill="#E2B57E" stroke="#9C6A43" strokeWidth={4} />
      <ellipse cx={x} cy={y} rx={w * 0.17} ry={h * 0.2} fill="none" stroke="#9C6A43" strokeWidth={4} />
      <ellipse cx={x - w * 0.27} cy={y} rx={w * 0.07} ry={h * 0.16} fill="none" stroke="#9C6A43" strokeWidth={4} />
      <ellipse cx={x + w * 0.27} cy={y} rx={w * 0.07} ry={h * 0.16} fill="none" stroke="#9C6A43" strokeWidth={4} />
      {hearts}
    </g>
  );
};

export const Books: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {[["#A0583A", 0], ["#F6EEE2", 1], ["#8A4B2F", 2], ["#F6EEE2", 3]].map(([col, i]) => (
      <g key={i as number} transform={`translate(${x + (i as number % 2) * 8},${y - (i as number) * 30})`}>
        <rect x={-70} y={-28} width={140} height={28} rx={5} fill={col as string} stroke={INK} strokeWidth={4} />
        <path d="M-60,-8 h120" stroke={INK} strokeWidth={2} opacity={0.4} />
      </g>
    ))}
    <rect x={x + 30} y={y - 58} width={8} height={30} fill="#C9302C" />
  </g>
);

export const Plant: React.FC<{ x: number; y: number; sway?: number }> = ({ x, y, sway = 0 }) => (
  <g>
    <g transform={`rotate(${sway},${x},${y - 80})`}>
      <path d={`M${x},${y - 80} C${x - 4},${y - 140} ${x + 6},${y - 180} ${x},${y - 230}`} stroke="#6E7F45" strokeWidth={6} fill="none" />
      {[[-1, 150], [1, 175], [-1, 205], [1, 225]].map(([s, h], i) => (
        <path key={i} d={`M${x},${y - h} q${s * 30},-26 ${s * 64},-10 q${-s * 20},${30} ${-s * 64},10 Z`} fill="#8FA35E" stroke={INK} strokeWidth={3.5} />
      ))}
    </g>
    <path d={`M${x - 48},${y - 90} h96 l-10,90 h-76 Z`} fill="#F0C79A" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={x - 54} y={y - 100} width={108} height={18} rx={6} fill="#F6D4AB" stroke={INK} strokeWidth={4} />
  </g>
);

export const Steam: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g opacity={0.75}>
    {[0, 1, 2].map((i) => {
      const ph = t / 18 + i * 2.1;
      const o = 0.5 + 0.5 * Math.sin(ph);
      return <path key={i} d={`M${x - 16 + i * 16},${y} c-10,-14 10,-22 0,-36 c-10,-14 10,-22 0,-36`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={o} transform={`translate(0,${-((t + i * 9) % 30) / 3})`} />;
    })}
  </g>
);

export const Drop: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#9ED3EA" }) => (
  <path d={`M${x},${y - 16 * s} C${x + 11 * s},${y - 2 * s} ${x + 11 * s},${y + 10 * s} ${x},${y + 10 * s} C${x - 11 * s},${y + 10 * s} ${x - 11 * s},${y - 2 * s} ${x},${y - 16 * s} Z`} fill={c} stroke={INK} strokeWidth={2.5 * Math.min(1, s)} />
);
