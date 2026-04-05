import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OutputBlock from './OutputBlock'
import MatrixRain from './MatrixRain'
import {
  THEMES, COMMANDS, HELP_TEXT, ABOUT_TEXT, PROJECTS_TEXT,
  CONTACT_TEXT, EDUCATION_TEXT, EXPERIENCE_TEXT, NEOFETCH_TEXT,
  SUDO_TEXT,
} from './data'

export default function Terminal() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [theme, setTheme] = useState('green')
  const [matrixActive, setMatrixActive] = useState(false)
  const [suggestion, setSuggestion] = useState('')

  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const idCounter = useRef(0)

  const themeColor = THEMES[theme].color

  // Apply theme to CSS variables
  useEffect(() => {
    const t = THEMES[theme]
    document.documentElement.style.setProperty('--terminal-color', t.color)
    document.documentElement.style.setProperty('--terminal-glow', t.glow)
    document.documentElement.style.setProperty('--terminal-dim', t.dim)
  }, [theme])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      })
    }
  }, [history])

  // Focus input on click
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    focusInput()
    window.addEventListener('click', focusInput)
    return () => window.removeEventListener('click', focusInput)
  }, [focusInput])

  const addEntry = (type, data) => {
    const id = idCounter.current++
    setHistory(prev => [...prev, { id, type, ...data }])
  }

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(' ')
    const base = parts[0]

    // Add command to display
    addEntry('command', { text: cmd.trim() })

    // Add to command history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd.trim()])
    }
    setHistoryIndex(-1)

    switch (base) {
      case 'help':
        addEntry('output', { lines: HELP_TEXT })
        break

      case 'about':
        addEntry('output', { lines: ABOUT_TEXT })
        break

      case 'skills':
        addEntry('skills', {})
        break

      case 'projects':
        addEntry('output', { lines: PROJECTS_TEXT })
        break

      case 'contact':
        addEntry('output', { lines: CONTACT_TEXT })
        break

      case 'education':
        addEntry('output', { lines: EDUCATION_TEXT })
        break

      case 'experience':
        addEntry('output', { lines: EXPERIENCE_TEXT })
        break

      case 'neofetch':
        addEntry('output', { lines: NEOFETCH_TEXT })
        break

      case 'clear':
        setHistory([])
        return

      case 'theme': {
        const newTheme = parts[1]
        if (newTheme && THEMES[newTheme]) {
          setTheme(newTheme)
          addEntry('output', { lines: ['', `  Theme changed to ${THEMES[newTheme].name} ✓`, ''] })
        } else {
          const available = Object.keys(THEMES).join(', ')
          addEntry('output', {
            lines: [
              '',
              '  Usage: theme <color>',
              `  Available: ${available}`,
              '',
            ],
          })
        }
        break
      }

      case 'matrix':
        addEntry('output', { lines: ['', '  Entering the Matrix...', '  (Press any key to exit)', ''] })
        setTimeout(() => setMatrixActive(true), 500)
        break

      case 'sudo':
        if (trimmed.includes('rm -rf')) {
          addEntry('output', { lines: SUDO_TEXT })
        } else {
          addEntry('output', { lines: ['', `  Command not found: ${cmd.trim()}`, '  Type "help" for available commands.', ''] })
        }
        break

      default:
        if (trimmed === '') break
        addEntry('output', {
          lines: ['', `  Command not found: ${cmd.trim()}`, '  Type "help" for available commands.', ''],
        })
    }
  }

  // Tab completion
  const handleTab = (e) => {
    e.preventDefault()
    const partial = input.toLowerCase()
    if (!partial) return

    const matches = COMMANDS.filter(c => c.startsWith(partial))
    if (matches.length === 1) {
      setInput(matches[0] === 'theme' ? 'theme ' : matches[0])
      setSuggestion('')
    } else if (matches.length > 1) {
      // Show options
      addEntry('command', { text: input })
      addEntry('output', { lines: ['', '  ' + matches.join('  '), ''] })
    }
  }

  // Input change with autocomplete hint
  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    setHistoryIndex(-1)

    if (val) {
      const match = COMMANDS.find(c => c.startsWith(val.toLowerCase()) && c !== val.toLowerCase())
      setSuggestion(match ? match.slice(val.length) : '')
    } else {
      setSuggestion('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleTab(e)
      return
    }

    if (e.key === 'Enter') {
      processCommand(input)
      setInput('')
      setSuggestion('')
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
      setSuggestion('')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      if (historyIndex >= commandHistory.length - 1) {
        setHistoryIndex(-1)
        setInput('')
        setSuggestion('')
      } else {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
        setSuggestion('')
      }
      return
    }

    // Any key exits matrix
    if (matrixActive) {
      setMatrixActive(false)
    }
  }

  return (
    <>
      <MatrixRain
        active={matrixActive}
        onComplete={() => setMatrixActive(false)}
        themeColor={themeColor}
      />

      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-auto p-4 sm:p-6"
        onClick={focusInput}
      >
        <div className="max-w-4xl mx-auto pb-4">
          <AnimatePresence mode="sync">
            {history.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <OutputBlock
                  entry={entry}
                  themeColor={themeColor}
                  isLatest={i === history.length - 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input line */}
          <div className="terminal-text text-sm flex items-center whitespace-pre mt-1">
            <span style={{ opacity: 0.7 }}>visitor@portfolio:~$ </span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none caret-transparent w-full"
                style={{
                  color: themeColor,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
              {/* Visual cursor overlay */}
              <div
                className="absolute top-0 left-0 pointer-events-none flex items-center text-sm"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                }}
              >
                <span style={{ visibility: 'hidden' }}>{input}</span>
                <span style={{ color: themeColor, opacity: 0.35 }}>{suggestion}</span>
                <span className="cursor-block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
