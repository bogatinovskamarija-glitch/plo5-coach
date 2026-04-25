export default function Home({ onStart }) {
  return (
    <div className="screen home-screen">
      <div className="home-header">
        <h1 className="home-title">PLO5 Coach</h1>
        <p className="home-sub">For Dragan</p>
      </div>

      <div className="home-card">
        <span className="home-card-label">AI Hand Analysis</span>
        <p className="home-card-desc">
          Input any hand — preflop or postflop — and get a GTO-grounded breakdown with exploitative layers.
        </p>
        <button className="btn-gold" onClick={onStart}>
          Analyze a Hand →
        </button>
      </div>

      <p className="home-footer">Powered by Claude · 5-Card PLO specialist</p>
    </div>
  )
}
