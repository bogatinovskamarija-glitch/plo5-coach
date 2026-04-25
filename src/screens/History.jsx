import { useState } from 'react'
import PlayingCard from '../components/PlayingCard'
import { getHistory, deleteHand } from '../utils/storage'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function streetLabel(n) {
  if (n === 0) return 'Preflop'
  if (n <= 3) return 'Flop'
  if (n === 4) return 'Turn'
  return 'River'
}

export default function History({ onBack, onView }) {
  const [items, setItems] = useState(() => getHistory())

  function remove(id, e) {
    e.stopPropagation()
    deleteHand(id)
    setItems(getHistory())
  }

  return (
    <div className="screen history-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <h2 className="screen-title">Hand History</h2>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No hands saved yet. Analyze a hand to build your history.</p>
      ) : (
        <div className="history-list">
          {items.map(item => {
            const { handData, analysis, id, date } = item
            const holeCards = handData.holeCards || []
            const boardCards = (handData.boardCards || []).filter(Boolean)
            const villains = handData.vsPositions || (handData.vsPosition ? [handData.vsPosition] : ['?'])
            return (
              <div key={id} className="history-item" onClick={() => onView(handData, analysis)}>
                <div className="history-item-top">
                  <span className="history-meta">
                    {handData.position} vs {villains.join(', ')} · {streetLabel(boardCards.length)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="history-date">{formatDate(date)}</span>
                    <button className="delete-btn" onClick={e => remove(id, e)}>✕</button>
                  </div>
                </div>
                <div className="history-cards">
                  <div className="card-row">
                    {holeCards.map((c, i) => <PlayingCard key={i} card={c} small />)}
                  </div>
                  {boardCards.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <span className="board-label">Board</span>
                      <div className="card-row">
                        {boardCards.map((c, i) => <PlayingCard key={i} card={c} small />)}
                      </div>
                    </div>
                  )}
                </div>
                <span className="meta" style={{ marginTop: 6 }}>
                  {handData.potSize} BB pot · {handData.stackSize} BB eff.
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
