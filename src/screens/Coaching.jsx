import PlayingCard from '../components/PlayingCard'

const ICONS = {
  'Spot Assessment': '🎯',
  'Hand Strength': '🃏',
  'Line Analysis': '📊',
  'Key Takeaway': '⚡',
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#e0e0e0', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function parseAnalysis(text) {
  const lines = text.split('\n')
  const blocks = []
  let bulletGroup = []

  const flushBullets = () => {
    if (bulletGroup.length > 0) {
      blocks.push({ type: 'bullets', items: [...bulletGroup] })
      bulletGroup = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed === '---') { flushBullets(); continue }
    if (trimmed.startsWith('### ')) {
      flushBullets()
      const title = trimmed.replace(/^###\s*\d+\.\s*/, '')
      blocks.push({ type: 'heading', title })
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushBullets()
      blocks.push({ type: 'subtitle', text: trimmed.slice(3) })
      continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      bulletGroup.push(trimmed.slice(2))
      continue
    }
    flushBullets()
    blocks.push({ type: 'paragraph', text: trimmed })
  }
  flushBullets()
  return blocks
}

export default function Coaching({ analysis, handData, onNew, onHome }) {
  const blocks = parseAnalysis(analysis)

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
            <PlayingCard key={i} card={c} small />
          ))}
        </div>
        {handData.boardCards.length > 0 && (
          <div className="board-row">
            <span className="board-label">Board</span>
            <div className="card-row">
              {handData.boardCards.map((c, i) => (
                <PlayingCard key={i} card={c} small />
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

      {blocks.map((block, i) => {
        if (block.type === 'subtitle') {
          return <p key={i} className="analysis-subtitle">{renderInline(block.text)}</p>
        }
        if (block.type === 'heading') {
          return (
            <div key={i} className="section">
              <div className="section-header">
                <span className="section-icon">{ICONS[block.title] || '▸'}</span>
                <span className="section-title">{block.title}</span>
              </div>
            </div>
          )
        }
        if (block.type === 'bullets') {
          return (
            <ul key={i} className="analysis-bullets">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }
        if (block.type === 'paragraph') {
          return <p key={i} className="section-body">{renderInline(block.text)}</p>
        }
        return null
      })}

      <div className="action-row">
        <button className="btn-gold" onClick={onNew}>Analyze Another Hand</button>
        <button className="btn-ghost" onClick={share}>Share Analysis</button>
      </div>
    </div>
  )
}
