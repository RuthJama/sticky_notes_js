import React, { useState } from 'react';
import './StickyNotes.css';

function StickyNotes() {
  const user = localStorage.getItem('user');
  const [notes, setNotes] = useState(() => {
    if (user) {
      try {
        return JSON.parse(localStorage.getItem(`notes_${user}`)) || [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [fullscreenNote, setFullscreenNote] = useState(null);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    if (user) {
      localStorage.setItem(`notes_${user}`, JSON.stringify(newNotes));
    }
  };

  const addNote = () => {
    if (input.trim() === '') return;
    // Default to yellow theme for new notes
    const newNotes = [...notes, { id: Date.now(), text: input, theme: 'yellow' }];
    saveNotes(newNotes);
    setInput('');
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    saveNotes(newNotes);
  };


  const [editStates, setEditStates] = useState({});
  const [editThemes, setEditThemes] = useState({});
  const [themeMenuOpen, setThemeMenuOpen] = useState({}); // { [noteId]: boolean }
  // Handle theme menu open/close
  const toggleThemeMenu = (id) => {
    setThemeMenuOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const selectTheme = (id, theme) => {
    const newNotes = notes.map(note => note.id === id ? { ...note, theme } : note);
    saveNotes(newNotes);
    setThemeMenuOpen(prev => ({ ...prev, [id]: false }));
  };

  const handleEditChange = (id, value) => {
    setEditStates({ ...editStates, [id]: value });
  };
  const handleEditThemeChange = (id, value) => {
    setEditThemes({ ...editThemes, [id]: value });
  };

  const startEdit = (id, currentText, currentTheme) => {
    setEditStates({ ...editStates, [id]: currentText });
    setEditThemes({ ...editThemes, [id]: currentTheme || 'yellow' });
  };

  const cancelEdit = (id) => {
    setEditStates({ ...editStates, [id]: undefined });
    setEditThemes({ ...editThemes, [id]: undefined });
  };

  const updateNote = (id) => {
    if (editStates[id] !== undefined && editStates[id].trim() !== '') {
      const newNotes = notes.map(note => note.id === id ? { ...note, text: editStates[id], theme: editThemes[id] || 'yellow' } : note);
      saveNotes(newNotes);
      setEditStates({ ...editStates, [id]: undefined });
      setEditThemes({ ...editThemes, [id]: undefined });
    }
  };

  return (
    <div className="sticky-notes-board">
      <div className="add-note">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your note here..."
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <div className={`sticky-note theme-${note.theme || 'yellow'}`} key={note.id}>
            {editStates[note.id] !== undefined ? (
              <>
                <textarea
                  value={editStates[note.id]}
                  onChange={e => handleEditChange(note.id, e.target.value)}
                />
                <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
                  <select value={editThemes[note.id] || 'yellow'} onChange={e => handleEditThemeChange(note.id, e.target.value)} style={{padding:'4px 8px',borderRadius:6,border:'1.5px solid #b2dfdb',fontSize:'1rem',background:'#f9fbe7',cursor:'pointer'}}>
                    <option value="yellow">Yellow</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="purple">Purple</option>
                  </select>
                  <div className="note-btn-group">
                    <button className="note-btn save-btn" onClick={() => updateNote(note.id)}>SAVE</button>
                    <button className="note-btn cancel-btn" onClick={() => cancelEdit(note.id)}>Cancel</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ position: 'relative', width: '100%' }}>
                  {/* 3 dots theme menu button */}
                  <button
                    className="theme-menu-btn"
                    style={{ position: 'absolute', top: 0, right: 32, zIndex: 3, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: '24px', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => toggleThemeMenu(note.id)}
                    title="Change note theme"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5" cy="12" r="2" fill="#888" />
                      <circle cx="12" cy="12" r="2" fill="#888" />
                      <circle cx="19" cy="12" r="2" fill="#888" />
                    </svg>
                  </button>
                  {/* Theme menu dropdown */}
                  {themeMenuOpen[note.id] && (
                    <div style={{ position: 'absolute', top: 30, right: 32, zIndex: 10, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', padding: '6px 0', minWidth: 120 }}>
                      {[
                        { value: 'yellow', label: 'Yellow' },
                        { value: 'blue', label: 'Blue' },
                        { value: 'green', label: 'Green' },
                        { value: 'pink', label: 'Pink' },
                        { value: 'purple', label: 'Purple' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => selectTheme(note.id, opt.value)}
                          style={{
                            display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', padding: '7px 16px', cursor: 'pointer', fontSize: '1rem', color: '#333',
                            backgroundColor: note.theme === opt.value ? '#f5f5f5' : 'transparent',
                          }}
                        >
                          <span style={{
                            display: 'inline-block', width: 18, height: 18, borderRadius: '50%', marginRight: 10,
                            background: opt.value === 'yellow' ? '#fffde7'
                              : opt.value === 'blue' ? '#e3f2fd'
                              : opt.value === 'green' ? '#e8f5e9'
                              : opt.value === 'pink' ? '#fce4ec'
                              : opt.value === 'purple' ? '#ede7f6' : '#fffde7',
                            border: '2px solid ' + (
                              opt.value === 'yellow' ? '#fbc02d'
                              : opt.value === 'blue' ? '#64b5f6'
                              : opt.value === 'green' ? '#81c784'
                              : opt.value === 'pink' ? '#f06292'
                              : opt.value === 'purple' ? '#9575cd' : '#fbc02d'
                            ),
                          }}></span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    className="delete-btn"
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
                    onClick={() => deleteNote(note.id)}
                  >
                    &times;
                  </button>
                  <button
                    className="edit-icon-btn"
                    style={{ position: 'absolute', top: 0, right: 64, zIndex: 2, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: '24px', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => startEdit(note.id, note.text, note.theme)}
                    title="Edit"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.85 2.85a2.121 2.121 0 0 1 3 3l-9.5 9.5-4 1 1-4 9.5-9.5Zm2.12-2.12a4.121 4.121 0 0 0-5.83 0l-9.5 9.5A2 2 0 0 0 1 12.34V17a2 2 0 0 0 2 2h4.66a2 2 0 0 0 1.41-.59l9.5-9.5a4.121 4.121 0 0 0 0-5.83Z" fill="#388e3c"/>
                    </svg>
                  </button>
                  <button
                    className="fullscreen-btn"
                    style={{ position: 'absolute', top: 0, right: 96, zIndex: 2, background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: '24px', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setFullscreenNote(note)}
                    title="Open fullscreen"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3h5V1H1v7h2V3zm14 0v5h2V1h-7v2h5zm0 14h-5v2h7v-7h-2v5zM3 17v-5H1v7h7v-2H3z" fill="#388e3c"/>
                    </svg>
                  </button>
                  <textarea
                    value={note.text}
                    readOnly
                    style={{ background: 'transparent', border: 'none', resize: 'none', outline: 'none', width: '100%', minHeight: '60px', marginTop: '28px' }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {fullscreenNote && (
        <div className="fullscreen-modal" onClick={() => setFullscreenNote(null)}>
          <div className="fullscreen-content" onClick={e => e.stopPropagation()}>
            <button className="close-fullscreen-btn" onClick={() => setFullscreenNote(null)}>&times;</button>
            <h2>Note</h2>
            <div className="fullscreen-note-text">{fullscreenNote.text}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StickyNotes;
