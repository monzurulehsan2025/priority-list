import { useState, useEffect } from 'react'
import './index.css'

interface Entry {
  id: string;
  text: string;
  timestamp: number;
}

function App() {
  const [view, setView] = useState<'home' | 'post' | 'read'>('home');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [inputText, setInputText] = useState('');

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('diary_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to parse entries", e);
      }
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('diary_entries', JSON.stringify(entries));
  }, [entries]);

  const handlePost = () => {
    if (!inputText.trim()) return;
    
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      text: inputText,
      timestamp: Date.now(),
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setInputText('');
    setView('read'); // Show all entries after posting
  };

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Priority List</h1>
        <p style={{ color: 'var(--text-muted)' }}>Capture your thoughts, instantly.</p>
      </header>

      <div className="actions">
        <button 
          className={`btn ${view === 'post' ? 'btn-primary' : ''}`}
          onClick={() => setView('post')}
        >
          <span>✍️</span> Post Entry
        </button>
        <button 
          className={`btn ${view === 'read' ? 'btn-primary' : ''}`}
          onClick={() => setView('read')}
        >
          <span>📖</span> Read All
        </button>
      </div>

      <main>
        {view === 'post' && (
          <div className="entry-form">
            <div className="input-group">
              <label>What's on your mind?</label>
              <textarea 
                className="input-field"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your entry here..."
                autoFocus
              />
            </div>
            <button className="btn btn-primary" onClick={handlePost} style={{ alignSelf: 'flex-end' }}>
              Publish Entry
            </button>
          </div>
        )}

        {view === 'read' && (
          <div className="entries-list">
            {sortedEntries.length === 0 ? (
              <div className="empty-state">No entries found. Start by writing one!</div>
            ) : (
              sortedEntries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <span className="entry-time">{formatDate(entry.timestamp)}</span>
                  <p className="entry-content">{entry.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'home' && entries.length > 0 && (
          <div className="empty-state">
            Welcome back! You have {entries.length} entries.
          </div>
        )}
      </main>
    </div>
  )
}

export default App
