const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' }
const RED_SUITS = ['h', 'd']

function suitColor(suit) {
  return RED_SUITS.includes(suit) ? '#c0392b' : '#1a1a2e'
}

// Card face — real poker card look
function CardFace({ rank, suit, small }) {
  const sym = SUIT_SYMBOLS[suit]
  const color = suitColor(suit)
  const w = small ? 40 : 52
  const h = small ? 56 : 72

  return (
    <svg width={w} height={h} viewBox={`0 0 52 72`} style={{ display: 'block' }}>
      <rect x="1" y="1" width="50" height="70" rx="5" ry="5" fill="#f8f6f0" stroke="#ddd" strokeWidth="1" />
      {/* Top-left rank + suit */}
      <text x="5" y="15" fontSize="11" fontWeight="800" fill={color} fontFamily="-apple-system, sans-serif">{rank}</text>
      <text x="5" y="25" fontSize="9" fill={color} fontFamily="-apple-system, sans-serif">{sym}</text>
      {/* Center suit */}
      <text x="26" y="44" fontSize="22" fill={color} textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif">{sym}</text>
      {/* Bottom-right rank + suit (rotated) */}
      <text x="47" y="61" fontSize="11" fontWeight="800" fill={color} textAnchor="end" fontFamily="-apple-system, sans-serif" transform="rotate(180, 47, 57)">{rank}</text>
      <text x="47" y="69" fontSize="9" fill={color} textAnchor="end" fontFamily="-apple-system, sans-serif" transform="rotate(180, 47, 66)">{sym}</text>
    </svg>
  )
}

// Card back — DD monogram with design (used for both empty slots and actual card backs)
function CardBack({ small, empty }) {
  const w = small ? 40 : 52
  const h = small ? 56 : 72
  const opacity = empty ? 0.45 : 1

  return (
    <svg width={w} height={h} viewBox="0 0 52 72" style={{ display: 'block', opacity }}>
      <rect x="1" y="1" width="50" height="70" rx="5" ry="5" fill="#0d1b4b" stroke="#1d3a8a" strokeWidth="1" />
      {/* Diamond pattern */}
      <pattern id="dp" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M4,0 L8,4 L4,8 L0,4 Z" fill="none" stroke="#1a3580" strokeWidth="0.6" />
      </pattern>
      <rect x="4" y="4" width="44" height="64" rx="3" fill="url(#dp)" />
      <rect x="4" y="4" width="44" height="64" rx="3" fill="none" stroke="#2a4fa0" strokeWidth="1" />
      {/* DD monogram */}
      <text x="26" y="38" fontSize="18" fontWeight="900" fill="#4a90e2" textAnchor="middle" dominantBaseline="middle" fontFamily="-apple-system, sans-serif" letterSpacing="-1">DD</text>
      {/* Decorative lines */}
      <line x1="10" y1="22" x2="42" y2="22" stroke="#2a4fa0" strokeWidth="0.6" />
      <line x1="10" y1="50" x2="42" y2="50" stroke="#2a4fa0" strokeWidth="0.6" />
      {/* "+" overlay for empty slots */}
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
