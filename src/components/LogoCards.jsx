export default function LogoCards({ size = 180 }) {
  const cards = [
    { suit: '♦', cx: 58,  cy: 76, r: -22 },
    { suit: '♥', cx: 86,  cy: 60, r:  -7 },
    { suit: '♣', cx: 114, cy: 60, r:   7 },
    { suit: '♠', cx: 142, cy: 76, r:  22 },
  ]

  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 200 130"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="lc-card" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#1c1c38" />
          <stop offset="100%" stopColor="#08080f" />
        </linearGradient>
        <linearGradient id="lc-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="lc-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b3b7a" />
          <stop offset="100%" stopColor="#14143a" />
        </linearGradient>
        <filter id="lc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {cards.map((c, i) => (
        <g
          key={i}
          transform={`translate(${c.cx}, ${c.cy}) rotate(${c.r}) translate(-25, -36)`}
          filter="url(#lc-shadow)"
        >
          {/* Card body */}
          <rect width="50" height="72" rx="5" ry="5" fill="url(#lc-card)" stroke="url(#lc-edge)" strokeWidth="0.8" />
          {/* Gloss sheen */}
          <rect x="2" y="2" width="46" height="18" rx="3" fill="rgba(255,255,255,0.05)" />
          {/* Top-left A */}
          <text x="5" y="14" fontSize="11" fontWeight="900" fill="#93c5fd" fontFamily="-apple-system, sans-serif">A</text>
          <text x="5.5" y="23" fontSize="9" fill="#60a5fa" fontFamily="-apple-system, sans-serif">{c.suit}</text>
          {/* Center suit */}
          <text
            x="25" y="38"
            fontSize="26"
            fill="url(#lc-suit)"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="-apple-system, sans-serif"
          >{c.suit}</text>
          {/* Bottom-right A (rotated) */}
          <text
            x="45" y="60"
            fontSize="11" fontWeight="900" fill="#93c5fd"
            textAnchor="end" fontFamily="-apple-system, sans-serif"
            transform="rotate(180, 45, 56)"
          >A</text>
        </g>
      ))}
    </svg>
  )
}
