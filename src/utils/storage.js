const HISTORY_KEY = 'plo5_history'
const NOTES_KEY = 'plo5_notes'

export function saveHand(handData, analysis) {
  const history = getHistory()
  history.unshift({ id: Date.now(), date: new Date().toISOString(), handData, analysis })
  if (history.length > 100) history.splice(100)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') }
  catch { return [] }
}

export function deleteHand(id) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h.id !== id)))
}

export function getNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]') }
  catch { return [] }
}

export function saveNote(note) {
  const notes = getNotes()
  const i = notes.findIndex(n => n.id === note.id)
  if (i >= 0) notes[i] = note
  else notes.unshift(note)
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export function deleteNote(id) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(getNotes().filter(n => n.id !== id)))
}
