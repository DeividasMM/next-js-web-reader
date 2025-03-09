import React, { useState, useEffect } from 'react';
// /reading/:id
export default function Reading() {
    const [theme, setTheme] = useState('light');

    const [notes, setNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [notification, setNotification] = useState('');

    //example fileID
    const fileId = '132';

    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        setNotes(storedNotes);
    }, []);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const handleEditClick = () => {
        window.location.href = `/edit/${fileId}`;
    };

    const handleThemeChange = (e) => {
        const selectedTheme = e.targed.value || 'light';
        setTheme(selectedTheme);
    };

    const handleSaveNote = () => {
        const trimmedText = newNoteText.trim();
        if (!trimmedText) return;

        setNotes((prevNotes) => [...prevNotes, { text: trimmedText}]);
        setNewNoteText('');

        setNotification('Note saved!');
        setTimeout(() => setNotification(''), 2000);
    };

    return (
      <>
        <div className={`reading-container theme-${theme}`}>
          <header>
            <h1>Reading:</h1>
            <button className="editBtn" onClick={handleEditClick} data-file-id={fileId}>Edit</button>
          </header>
  
          <div>
            <label htmlFor="themeSelect">Theme:</label>
            <select id="themeSelect" value={theme} onChange={handleThemeChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
  
          <div>
            <iframe src="#" width="600" height="800"></iframe>
          </div>
  
          <div>
            <h2>My Notes</h2>
            <ul id="notesList">
                {notes.map((note, index) => (
                <li key={index}>{note.text}</li>
            ))}
            </ul>
  
            <textarea id="newNoteText" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)}></textarea>
            <button id="saveNoteBtn" onClick={handleSaveNote}>Save note</button>
            {notification && <div id="notification">{notification}</div>}
          </div>
  
          <div>BLINK</div>
        </div>
      </>
    );
  }
