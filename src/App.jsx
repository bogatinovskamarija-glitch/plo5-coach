import { useState } from 'react'
import Home from './screens/Home'
import HandInput from './screens/HandInput'
import Coaching from './screens/Coaching'
import History from './screens/History'
import Notes from './screens/Notes'
import { saveHand } from './utils/storage'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [analysis, setAnalysis] = useState(null)
  const [handData, setHandData] = useState(null)
  const [prefill, setPrefill] = useState(null)

  function showCoaching(result, data) {
    saveHand(data, result)
    setAnalysis(result)
    setHandData(data)
    setScreen('coaching')
  }

  function startNew(prefillData = null) {
    setPrefill(prefillData)
    setScreen('input')
  }

  function handleNextStreet(data) {
    setPrefill(data)
    setScreen('input')
  }

  function viewFromHistory(data, anal) {
    setHandData(data)
    setAnalysis(anal)
    setScreen('coaching')
  }

  return (
    <div className="app">
      {screen === 'home'     && <Home onStart={() => startNew()} onHistory={() => setScreen('history')} onNotes={() => setScreen('notes')} />}
      {screen === 'input'    && <HandInput key={prefill?.id || 'new'} onBack={() => setScreen('home')} onResult={showCoaching} prefill={prefill} />}
      {screen === 'coaching' && <Coaching analysis={analysis} handData={handData} onNew={() => startNew()} onHome={() => setScreen('home')} onNextStreet={handleNextStreet} />}
      {screen === 'history'  && <History onBack={() => setScreen('home')} onView={viewFromHistory} />}
      {screen === 'notes'    && <Notes onBack={() => setScreen('home')} />}
    </div>
  )
}
