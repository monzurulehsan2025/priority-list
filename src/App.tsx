import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, List, History, PlusCircle, Trash2 } from 'lucide-react'
import { db } from './firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDocs,
  writeBatch
} from 'firebase/firestore'
import './App.css'

interface Entry {
  id: string;
  lines: string[];
  timestamp: Date;
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [view, setView] = useState<'post' | 'get'>('post')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  // Sync with Firestore
  useEffect(() => {
    const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          lines: data.lines,
          timestamp: data.timestamp?.toDate() || new Date()
        } as Entry
      })
      setEntries(newEntries)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const lines = [text.trim()]

    try {
      await addDoc(collection(db, 'entries'), {
        lines,
        timestamp: new Date()
      })

      setText('')
      // Switch to view posts after posting
      setView('get')
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("Failed to save to Firebase. Please check your configuration.")
    }
  }

  const clearEntries = async () => {
    if (confirm('Are you sure you want to clear all data from Firebase?')) {
      try {
        const querySnapshot = await getDocs(collection(db, 'entries'))
        const batch = writeBatch(db)
        querySnapshot.forEach((document) => {
          batch.delete(doc(db, 'entries', document.id))
        })
        await batch.commit()
      } catch (error) {
        console.error("Error clearing entries: ", error)
      }
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
        <p className="subtitle">Secure Cloud Logs with Firebase Firestore</p>
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
                  <h2>Cloud Sync Post</h2>
                </div>
                <div className="input-group">
                  <label htmlFor="text">Entry Thought</label>
                  <input
                    id="text"
                    type="text"
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" disabled={!text.trim()} className="primary submit-btn">
                  Push to Firebase
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
                  <h2>Cloud Memories</h2>
                </div>
                {entries.length > 0 && (
                  <button onClick={clearEntries} className="danger-text-btn">
                    <Trash2 size={16} /> Clear Cloud
                  </button>
                )}
              </div>

              {loading ? (
                <div className="empty-state">
                  <p>Syncing with Firebase...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="empty-state">
                  <p>No cloud logs found. Start by posting something!</p>
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
        <p>&copy; {new Date().getFullYear()} Priority List. All data synced with Firebase Firestore.</p>
      </footer>
    </div>
  )
}

export default App
