import { useState } from 'react'
import PlayingCard from './PlayingCard'

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS = [
  { symbol: '♠', key: 's', color: '#e0e0e0' },
  { symbol: '♥', key: 'h', color: '#e05555' },
  { symbol: '♦', key: 'd', color: '#e05555' },
  { symbol: '♣', key: 'c', color: '#e0e0e0' },
]

export default function CardPicker({ label, cards, maxCards, onChange, usedCards = [] }) {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const slots = Array.from({ length: maxCards }, (_, i) => cards[i] || null)

  function openPicker(i) {
    setSelectedIndex(i)
    setOpen(true)
  }

  function selectCard(rank, suit) {
    const card = `${rank}${suit}`
    if (usedCards.includes(card) && cards[selectedIndex] !== card) return
    const updated = [...cards]
    updated[selectedIndex] = card
    onChange(updated)
    setOpen(false)
  }

  function removeCard(i) {
    const updated = [...cards]
    updated[i] = null
    onChange(updated)
  }

  return (
    <div className="picker-group">
      <label className="field-label">{label}</label>
      <div className="card-row">
        {slots.map((card, i) => (
          <PlayingCard
            key={i}
            card={card}
            empty={!card}
            onClick={() => openPicker(i)}
            onRemove={card ? () => removeCard(i) : null}
          />
        ))}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Pick a card</span>
              <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            {SUITS.map(suit => (
              <div key={suit.key} className="suit-row">
                <span className="suit-symbol" style={{ color: suit.color }}>{suit.symbol}</span>
                <div className="rank-grid">
                  {RANKS.map(rank => {
                    const card = `${rank}${suit.key}`
                    const used = usedCards.includes(card) && cards[selectedIndex] !== card
                    return (
                      <button
                        key={rank}
                        className={`rank-btn ${used ? 'used' : ''}`}
                        style={{ color: used ? '#333' : suit.color }}
                        onClick={() => !used && selectCard(rank, suit.key)}
                        disabled={used}
                      >
                        {rank}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
