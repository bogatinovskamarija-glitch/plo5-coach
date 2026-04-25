const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' }
const RED_SUITS = ['h', 'd']

function suitColor(suit) {
  return RED_SUITS.includes(suit) ? '#c0392b' : '#1a1a2e'
}

// [x, y] positions for pip symbols — cards are 52x72 viewBox
const PIP_LAYOUTS = {
  'A':  { size: 20, pips: [[26, 40]] },
  '2':  { size: 12, pips: [[26, 24], [26, 55]] },
  '3':  { size: 12, pips: [[26, 24], [26, 39], [26, 55]] },
  '4':  { size: 12, pips: [[17, 24], [35, 24], [17, 55], [35, 55]] },
  '5':  { size: 12, pips: [[17, 24], [35, 24], [26, 39], [17, 55], [35, 55]] },
  '6':  { size: 12, pips: [[17, 23], [35, 23], [17, 39], [35, 39], [17, 55], [35, 55]] },
  '7':  { size: 11, pips: [[17, 22], [35, 22], [26, 30], [17, 38], [35, 38], [17, 54], [35, 54]] },
  '8':  { size: 11, pips: [[17, 22], [35, 22], [26, 30], [17, 38], [35, 38], [26, 46], [17, 54], [35, 54]] },
  '9':  { size: 10, pips: [[17, 21], [35, 21], [17, 31], [35, 31], [26, 39], [17, 47], [35, 47], [17, 57], [35, 57]] },
  '10': { size: 9,  pips: [[17, 20], [35, 20], [26, 27], [17, 34], [35, 34], [17, 44], [35, 44], [26, 51], [17, 58], [35, 58]] },
}

function CardFace({ rank, suit, small }) {
  const sym = SUIT_SYMBOLS[suit]
  const color = suitColor(suit)
  const w = small ? 40 : 52
  const h = small ? 56 : 72
  const isFace = ['J', 'Q', 'K'].includes(rank)
  const layout = PIP_LAYOUTS[rank]

  return (
    <svg width={w} height={h} viewBox="0 0 52 72" style={{ display: 'block' }}>
      <rect x="1" y="1" width="50" height="70" rx="5" ry="5" fill="#f8f6f0" stroke="#ddd" strokeWidth="1" />
      {/* Top-left corner */}
      <text x="5" y="14" fontSize="11" fontWeight="800" fill={color} fontFamily="-apple-system, sans-serif">{rank}</text>
      <text x="5.5" y="23" fontSize="9" fill={color} fontFamily="-apple-system, sans-serif">{sym}</text>
      {/* Bottom-right corner (rotated 180°) */}
      <text x="47" y="61" fontSize="11" fontWeight="800" fill={color} textAnchor="end" fontFamily="-apple-system, sans-serif" transform="rotate(180, 47, 57)">{rank}</text>
      <text x="46.5" y="69" fontSize="9" fill={color} textAnchor="end" fontFamily="-apple-system, sans-serif" transform="rotate(180, 47, 66)">{sym}</text>

      {/* Face cards: large rank letter + suit */}
      {isFace && (
        <>
          <text x="26" y="36" fontSize="22" fontWeight="900" fill={color} textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif">{rank}</text>
          <text x="26" y="53" fontSize="14" fill={color} textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif">{sym}</text>
        </>
      )}

      {/* Pip cards (A through 10) */}
      {!isFace && layout && layout.pips.map(([px, py], i) => (
        <text
          key={i}
          x={px}
          y={py}
          fontSize={layout.size}
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="-apple-system, sans-serif"
        >{sym}</text>
      ))}
    </svg>
  )
}

function CardBack({ small, empty }) {
  const w = small ? 40 : 52
  const h = small ? 56 : 72
  const opacity = empty ? 0.45 : 1

  return (
    <svg width={w} height={h} viewBox="0 0 52 72" style={{ display: 'block', opacity }}>
      <rect x="1" y="1" width="50" height="70" rx="5" ry="5" fill="#0d1b4b" stroke="#1d3a8a" strokeWidth="1" />
      <pattern id="dp" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M4,0 L8,4 L4,8 L0,4 Z" fill="none" stroke="#1a3580" strokeWidth="0.6" />
      </pattern>
      <rect x="4" y="4" width="44" height="64" rx="3" fill="url(#dp)" />
      <rect x="4" y="4" width="44" height="64" rx="3" fill="none" stroke="#2a4fa0" strokeWidth="1" />
      <text x="26" y="38" fontSize="18" fontWeight="900" fill="#4a90e2" textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif" letterSpacing="-1">DD</text>
      <line x1="10" y1="22" x2="42" y2="22" stroke="#2a4fa0" strokeWidth="0.6" />
      <line x1="10" y1="50" x2="42" y2="50" stroke="#2a4fa0" strokeWidth="0.6" />
      {empty && (
        <text x="26" y="14" fontSize="10" fill="#4a90e2" textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif" opacity="0.9">+</text>
      )}
    </svg>
  )
}

export default function PlayingCard({ card, small, empty, onClick, onRemove }) {
  let rank = null
  let suit = null
  if (card) {
    rank = card.slice(0, -1)
    suit = card.slice(-1)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
      {card
        ? <CardFace rank={rank} suit={suit} small={small} />
        : <CardBack small={small} empty={empty} />
      }
      {card && onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{
            position: 'absolute', top: -6, right: -6,
            width: 18, height: 18, borderRadius: '50%',
            background: '#222', border: 'none', color: '#aaa',
            fontSize: 9, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, padding: 0,
          }}
        >✕</button>
      )}
    </div>
  )
}
