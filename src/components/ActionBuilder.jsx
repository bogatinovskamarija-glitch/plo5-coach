import { useState } from 'react'

const ACTION_TYPES = [
  { key: 'check',  label: 'Check',    needsSize: false },
  { key: 'call',   label: 'Call',     needsSize: false },
  { key: 'fold',   label: 'Fold',     needsSize: false },
  { key: 'bet',    label: 'Bet',      needsSize: true  },
  { key: 'raise',  label: 'Raise',    needsSize: true  },
  { key: 'allin',  label: 'All-In',   needsSize: false },
  { key: 'decide', label: 'My Turn ?', needsSize: false },
]

export function actionsToString(actions) {
  return actions.map(a => {
    if (a.type === 'check')  return `${a.actor} checks`
    if (a.type === 'call')   return `${a.actor} calls`
    if (a.type === 'fold')   return `${a.actor} folds`
    if (a.type === 'allin')  return `${a.actor} all-in`
    if (a.type === 'bet')    return `${a.actor} bets ${a.size ? a.size + 'BB' : ''}`
    if (a.type === 'raise')  return `${a.actor} raises ${a.size ? a.size + 'BB' : ''}`
    if (a.type === 'decide') return `${a.actor} ?`
    return ''
  }).filter(Boolean).join(' · ')
}

export default function ActionBuilder({ value = [], onChange, positions = [] }) {
  const [actor, setActor] = useState(positions[0] || '')
  const [pendingType, setPendingType] = useState(null)
  const [size, setSize] = useState('')

  function addImmediate(type) {
    onChange([...value, { actor, type }])
  }

  function startSized(type) {
    setPendingType(type)
    setSize('')
  }

  function confirmSize() {
    if (!size.trim()) return
    onChange([...value, { actor, type: pendingType, size: size.trim() }])
    setPendingType(null)
    setSize('')
  }

  function cancelSize() {
    setPendingType(null)
    setSize('')
  }

  function removeAction(i) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  const hasDecide = value.some(a => a.type === 'decide')

  return (
    <div className="action-builder">
      {/* Built sequence */}
      {value.length > 0 && (
        <div className="action-sequence">
          {value.map((a, i) => (
            <div key={i} className={`action-chip ${a.type === 'decide' ? 'action-chip-decide' : ''}`}>
              <span>{actionsToString([a])}</span>
              <button className="action-chip-remove" onClick={() => removeAction(i)}>×</button>
            </div>
          ))}
        </div>
      )}

      {!hasDecide && (
        <>
          {/* Actor picker */}
          <div className="field" style={{ marginBottom: 10 }}>
            <label className="field-label">Who acts</label>
            <div className="pills">
              {positions.map(p => (
                <button key={p} className={`pill ${actor === p ? 'active' : ''}`} onClick={() => setActor(p)}>{p}</button>
              ))}
            </div>
          </div>

          {/* Size input (for Bet / Raise) */}
          {pendingType ? (
            <div className="size-confirm-row">
              <span className="field-label" style={{ whiteSpace: 'nowrap' }}>{pendingType === 'bet' ? 'Bet' : 'Raise'} (BB)</span>
              <input
                className="input"
                type="number"
                placeholder="e.g. 12"
                value={size}
                onChange={e => setSize(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmSize()}
                autoFocus
                style={{ flex: 1 }}
              />
              <button className="action-confirm-btn" onClick={confirmSize}>Add</button>
              <button className="action-cancel-btn" onClick={cancelSize}>✕</button>
            </div>
          ) : (
            <div className="field">
              <label className="field-label">Action</label>
              <div className="action-btns-grid">
                {ACTION_TYPES.map(t => (
                  <button
                    key={t.key}
                    className={`action-btn ${t.key === 'decide' ? 'action-btn-decide' : ''}`}
                    onClick={() => t.needsSize ? startSized(t.key) : addImmediate(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {value.length > 0 && (
        <button className="action-clear-btn" onClick={() => onChange([])}>Clear actions</button>
      )}
    </div>
  )
}
