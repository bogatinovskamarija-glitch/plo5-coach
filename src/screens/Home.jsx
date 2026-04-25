import { getHistory } from '../utils/storage'

export default function Home({ onStart, onHistory, onNotes, gameMode, setGameMode }) {
  const historyCount = getHistory().length

  return (
    <div className="screen home-screen">
      <div className="home-header">
        <h1 className="home-title">DD Poker</h1>
        <p className="home-sub">AI Coach for Dragan</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Game mode selector */}
        <div className="mode-selector">
          <button
            className={`mode-btn ${gameMode === 'plo4' ? 'mode-btn-active' : ''}`}
            onClick={() => setGameMode('plo4')}
          >
            <span className="mode-btn-label">PLO 4</span>
            <span className="mode-btn-sub">4 hole cards</span>
          </button>
          <button
            className={`mode-btn ${gameMode === 'plo5' ? 'mode-btn-active' : ''}`}
            onClick={() => setGameMode('plo5')}
          >
            <span className="mode-btn-label">PLO 5</span>
            <span className="mode-btn-sub">5 hole cards</span>
          </button>
        </div>

        <div className="home-card">
          <span className="home-card-label">AI Hand Analysis · {gameMode === 'plo4' ? 'PLO4' : 'PLO5'}</span>
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

      <p className="home-footer">Powered by Claude · PLO4 & PLO5 specialist</p>
    </div>
  )
}
