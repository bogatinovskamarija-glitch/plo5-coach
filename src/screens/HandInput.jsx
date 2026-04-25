import { useState } from 'react'
import CardPicker from '../components/CardPicker'
import { analyzePLO5Hand } from '../claude'

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB']

function streetLabel(boardCards) {
  const n = boardCards.filter(Boolean).length
  if (n === 0) return 'Preflop'
  if (n <= 3) return 'Flop'
  if (n === 4) return 'Turn'
  return 'River'
}

export default function HandInput({ onBack, onResult, prefill }) {
  const [holeCards, setHoleCards] = useState(prefill?.holeCards || Array(5).fill(null))
  const [boardCards, setBoardCards] = useState(prefill?.boardCards || Array(5).fill(null))
  const [position, setPosition] = useState(prefill?.position || 'BTN')
  const [vsPositions, setVsPositions] = useState(prefill?.vsPositions || [prefill?.vsPosition || 'BB'])
  const [potSize, setPotSize] = useState(prefill?.potSize || '')
  const [stackSize, setStackSize] = useState(prefill?.stackSize || '')
  const [actionHistory, setActionHistory] = useState(prefill?.actionHistory || '')
  const [context, setContext] = useState(prefill?.additionalContext || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isContinuation = !!prefill

  const usedCards = [...holeCards, ...boardCards].filter(Boolean)
  const filledHole = holeCards.filter(Boolean)
  const filledBoard = boardCards.filter(Boolean)

  function toggleVillain(pos) {
    if (pos === position) return // can't be both hero and villain
    if (vsPositions.includes(pos)) {
      if (vsPositions.length > 1) setVsPositions(vsPositions.filter(p => p !== pos))
    } else if (vsPositions.length < 3) {
      setVsPositions([...vsPositions, pos])
    }
  }

  async function handleAnalyze() {
    if (filledHole.length < 5) { setError('Add all 5 hole cards first.'); return }
    if (!potSize || !stackSize || !actionHistory.trim()) { setError('Fill in pot size, stack size, and the action.'); return }
    setError(null)
    setLoading(true)
    try {
      const data = { holeCards: filledHole, boardCards: filledBoard, position, vsPositions, potSize, stackSize, actionHistory, additionalContext: context }
      const result = await analyzePLO5Hand(data)
      onResult(result, data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function clearAll() {
    setHoleCards(Array(5).fill(null))
    setBoardCards(Array(5).fill(null))
    setPotSize('')
    setStackSize('')
    setActionHistory('')
    setContext('')
  }

  return (
    <div className="screen input-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="screen-title">
          {isContinuation ? `Continue · ${streetLabel(boardCards)}` : 'New Hand'}
        </h2>
      </div>

      <div className="form">
        <CardPicker
          label="Your 5 Hole Cards"
          cards={holeCards}
          maxCards={5}
          onChange={setHoleCards}
          usedCards={usedCards}
        />
        <CardPicker
          label={`Board — ${streetLabel(boardCards)} (skip for preflop)`}
          cards={boardCards}
          maxCards={5}
          onChange={setBoardCards}
          usedCards={usedCards}
        />

        <div className="field">
          <label className="field-label">Hero Position</label>
          <div className="pills">
            {POSITIONS.map(p => (
              <button key={p} className={`pill ${position === p ? 'active' : ''}`} onClick={() => setPosition(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Villain Position(s) <span style={{ color: '#555', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— tap to add up to 3</span></label>
          <div className="pills">
            {POSITIONS.map(p => (
              <button
                key={p}
                className={`pill ${vsPositions.includes(p) ? 'active' : ''} ${p === position ? 'pill-disabled' : ''}`}
                onClick={() => toggleVillain(p)}
                disabled={p === position}
              >{p}</button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">Pot Size (BB)</label>
            <input className="input" type="number" placeholder="e.g. 12" value={potSize} onChange={e => setPotSize(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Stack (BB)</label>
            <input className="input" type="number" placeholder="e.g. 100" value={stackSize} onChange={e => setStackSize(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Action Sequence</label>
          <textarea className="input textarea" rows={3} placeholder="e.g. BTN raises 3x, BB calls. Flop: BTN bets 2/3 pot, BB raises pot, BTN?" value={actionHistory} onChange={e => setActionHistory(e.target.value)} />
        </div>

        <div className="field">
          <label className="field-label">Extra Context (optional)</label>
          <textarea className="input textarea" rows={2} placeholder="e.g. Villain is a reg who over-folds to 3-bets, 500NL live game" value={context} onChange={e => setContext(e.target.value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn-gold" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze with AI Coach →'}
        </button>

        {!isContinuation && (
          <button className="btn-ghost" onClick={clearAll}>Clear Hand</button>
        )}
      </div>
    </div>
  )
}
