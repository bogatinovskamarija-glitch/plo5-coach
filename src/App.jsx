import { useState } from 'react'
import Home from './screens/Home'
import HandInput from './screens/HandInput'
import Coaching from './screens/Coaching'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [analysis, setAnalysis] = useState(null)
  const [handData, setHandData] = useState(null)

  function goTo(s) { setScreen(s) }

  function showCoaching(result, data) {
    setAnalysis(result)
    setHandData(data)
    setScreen('coaching')
  }

  return (
    <div className="app">
      {screen === 'home' && <Home onStart={() => goTo('input')} />}
      {screen === 'input' && <HandInput onBack={() => goTo('home')} onResult={showCoaching} />}
      {screen === 'coaching' && <Coaching analysis={analysis} handData={handData} onNew={() => goTo('input')} onHome={() => goTo('home')} />}
    </div>
  )
}
