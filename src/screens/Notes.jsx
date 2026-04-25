import { useState } from 'react'
import { getNotes, saveNote, deleteNote } from '../utils/storage'

export default function Notes({ onBack }) {
  const [notes, setNotes] = useState(() => getNotes())
  const [modal, setModal] = useState(null) // null | { id, name, text }

  function openAdd() { setModal({ id: null, name: '', text: '' }) }
  function openEdit(n) { setModal({ id: n.id, name: n.name, text: n.text }) }

  function handleSave() {
    if (!modal.name.trim()) return
    saveNote({ id: modal.id || Date.now(), name: modal.name.trim(), text: modal.text.trim(), updatedAt: new Date().toISOString() })
    setNotes(getNotes())
    setModal(null)
  }

  function handleDelete(id, e) {
    e.stopPropagation()
    deleteNote(id)
    setNotes(getNotes())
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <h2 className="screen-title">Villain Notes</h2>
        <button className="add-note-btn" onClick={openAdd}>+ Add</button>
      </div>

      {notes.length === 0 ? (
        <p className="empty-state">No villain notes yet.<br />Track tendencies, stats, and reads here.</p>
      ) : (
        <div className="notes-list">
          {notes.map(n => (
            <div key={n.id} className="note-card" onClick={() => openEdit(n)}>
              <div className="note-header">
                <span className="note-name">{n.name}</span>
                <button className="delete-btn" onClick={e => handleDelete(n.id, e)}>✕</button>
              </div>
              <p className="note-text">{n.text || <span style={{ color: '#555' }}>Tap to add notes</span>}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal.id ? 'Edit Villain' : 'Add Villain'}</span>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">Name / Screen Name</label>
              <input
                className="input"
                placeholder="e.g. Hero123, Seat 3 reg"
                value={modal.name}
                onChange={e => setModal(m => ({ ...m, name: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="field" style={{ marginBottom: 20 }}>
              <label className="field-label">Notes & Tendencies</label>
              <textarea
                className="input textarea"
                rows={5}
                placeholder="e.g. Over-folds to 3-bets. Never bluffs river. Overbets nuts. Fish in PLO, reg in NLHE..."
                value={modal.text}
                onChange={e => setModal(m => ({ ...m, text: e.target.value }))}
              />
            </div>
            <button className="btn-gold" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}
