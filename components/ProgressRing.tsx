export default function ProgressRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = size / 2 - 11;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--glass-brd)" strokeWidth={11} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={11}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
      />
    </svg>
  );
}
