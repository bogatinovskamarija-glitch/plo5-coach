import { getHistory } from '../utils/storage'

export default function Home({ onStart, onHistory, onNotes }) {
  const historyCount = getHistory().length

  return (
    <div className="screen home-screen">
      <div className="home-header">
        <h1 className="home-title">PLO5 Coach</h1>
        <p className="home-sub">For Dragan</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="home-card">
          <span className="home-card-label">AI Hand Analysis</span>
          <p className="home-card-desc">
            Input any hand — preflop or postflop — and get a GTO-grounded breakdown with exploitative layers.
          </p>
          <button className="btn-gold" onClick={onStart}>
            Analyze a Hand →
          </button>
        </div>

        <div className="home-secondary-row">
          <button className="home-secondary-btn" onClick={onHistory}>
            <span className="home-secondary-icon">📋</span>
            <span className="home-secondary-label">Hand History</span>
            {historyCount > 0 && <span className="home-badge">{historyCount}</span>}
          </button>
          <button className="home-secondary-btn" onClick={onNotes}>
            <span className="home-secondary-icon">📝</span>
            <span className="home-secondary-label">Villain Notes</span>
          </button>
        </div>
      </div>

      <p className="home-footer">Powered by Claude · 5-Card PLO specialist</p>
    </div>
  )
}
