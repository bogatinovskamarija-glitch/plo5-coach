const ICONS = {
  'Spot Assessment': '🎯',
  'Hand Strength': '🃏',
  'Line Analysis': '📊',
  'Key Takeaway': '⚡',
}

function suitColor(card) {
  if (!card) return '#888'
  return 'hd'.includes(card.slice(-1)) ? '#e05555' : '#e0e0e0'
}

function parseAnalysis(text) {
  const sections = []
  let current = null
  for (const line of text.split('\n')) {
    const m = line.match(/^\*\*(.+?)\*\*/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1], body: line.replace(/\*\*(.+?)\*\*/, '').replace(/^[\s—:-]+/, '').trim() }
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line
    } else {
      sections.push({ title: null, body: line })
    }
  }
  if (current) sections.push(current)
  return sections.filter(s => s.body.trim())
}

export default function Coaching({ analysis, handData, onNew, onHome }) {
  const sections = parseAnalysis(analysis)

  function share() {
    const text = `PLO5 Hand\nHole: ${handData.holeCards.join(' ')}\nBoard: ${handData.boardCards.join(' ') || 'Preflop'}\n\n${analysis}`
    if (navigator.share) {
      navigator.share({ title: 'PLO5 Analysis', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Analysis copied to clipboard!')
    }
  }

  return (
    <div className="screen coaching-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onHome}>← Home</button>
        <h2 className="screen-title">AI Analysis</h2>
      </div>

      <div className="hand-summary">
        <div className="card-row">
          {handData.holeCards.map((c, i) => (
            <span key={i} className="mini-card" style={{ color: suitColor(c) }}>{c}</span>
          ))}
        </div>
        {handData.boardCards.length > 0 && (
          <div className="board-row">
            <span className="board-label">Board</span>
            <div className="card-row">
              {handData.boardCards.map((c, i) => (
                <span key={i} className="mini-card" style={{ color: suitColor(c) }}>{c}</span>
              ))}
            </div>
          </div>
        )}
        <div className="meta-row">
          <span className="meta">{handData.position} vs {handData.vsPosition}</span>
          <span className="meta-dot">·</span>
          <span className="meta">{handData.potSize} BB pot</span>
          <span className="meta-dot">·</span>
          <span className="meta">{handData.stackSize} BB eff.</span>
        </div>
      </div>

      <div className="divider" />

      {sections.map((s, i) => (
        <div key={i} className="section">
          {s.title && (
            <div className="section-header">
              <span className="section-icon">{ICONS[s.title] || '▸'}</span>
              <span className="section-title">{s.title}</span>
            </div>
          )}
          <p className="section-body">{s.body.trim()}</p>
        </div>
      ))}

      <div className="action-row">
        <button className="btn-gold" onClick={onNew}>Analyze Another Hand</button>
        <button className="btn-ghost" onClick={share}>Share Analysis</button>
      </div>
    </div>
  )
}
