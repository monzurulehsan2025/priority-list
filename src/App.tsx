import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, List, History, PlusCircle, Trash2 } from 'lucide-react'
import './App.css'

interface Entry {
  id: string;
  lines: string[];
  timestamp: Date;
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [view, setView] = useState<'post' | 'get'>('post')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!line1.trim() && !line2.trim()) return

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      lines: [line1, line2].filter(line => line.trim() !== ''),
      timestamp: new Date()
    }

    setEntries(prev => [newEntry, ...prev])
    setLine1('')
    setLine2('')
    
    // Optional: show some feedback or switch view
    // For now, just clear the form
  }

  const clearEntries = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setEntries([])
    }
  }

  return (
    <div className="container">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Priority List</h1>
        <p className="subtitle">Secure in-memory micro-logs with timestamping</p>
      </motion.header>

      <div className="nav-container glass-card">
        <button 
          className={view === 'post' ? 'primary' : 'secondary'}
          onClick={() => setView('post')}
        >
          <PlusCircle size={20} />
          Post Entry
        </button>
        <button 
          className={view === 'get' ? 'primary' : 'secondary'}
          onClick={() => setView('get')}
        >
          <History size={20} />
          Get Logs
        </button>
      </div>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {view === 'post' ? (
            <motion.div
              key="post-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card content-card"
            >
              <form onSubmit={handlePost}>
                <div className="form-header">
                  <Send className="header-icon" />
                  <h2>Create New Post</h2>
                </div>
                <div className="input-group">
                  <label htmlFor="line1">Primary Thought</label>
                  <input
                    id="line1"
                    type="text"
                    placeholder="What's on your mind? (Line 1)"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="line2">Additional Detail (Optional)</label>
                  <input
                    id="line2"
                    type="text"
                    placeholder="Any extra context? (Line 2)"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={!line1.trim() && !line2.trim()} className="primary submit-btn">
                  Push to Memory
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="get-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card content-card"
            >
              <div className="list-header">
                <div className="header-title">
                  <List className="header-icon" />
                  <h2>Stored Memories</h2>
                </div>
                {entries.length > 0 && (
                  <button onClick={clearEntries} className="danger-text-btn">
                    <Trash2 size={16} /> Clear All
                  </button>
                )}
              </div>

              {entries.length === 0 ? (
                <div className="empty-state">
                  <p>No logs found. Start by posting something!</p>
                </div>
              ) : (
                <div className="logs-list">
                  {entries.map((entry, index) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="log-item"
                    >
                      <div className="log-timestamp">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <span className="date-sep">•</span>
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                      <div className="log-content">
                        {entry.lines.map((line, lIdx) => (
                          <div key={lIdx} className="log-line">
                            {line}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Priority List. All data stored locally in session memory.</p>
      </footer>
    </div>
  )
}

export default App
