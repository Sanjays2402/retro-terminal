import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OutputBlock from './OutputBlock'
import MatrixRain from './MatrixRain'
import {
  THEMES, COMMANDS, HELP_TEXT, ABOUT_TEXT, PROJECTS_TEXT,
  CONTACT_TEXT, EDUCATION_TEXT, EXPERIENCE_TEXT, NEOFETCH_TEXT,
  SUDO_TEXT, WEATHER_DATA, ASCII_ART_COLLECTION, FORTUNE_QUOTES,
} from './data'
import { isSoundEnabled, setSoundEnabled } from './typingSound'

// Minimal 5x5 block font for `banner` command
const BANNER_FONT = {
  A: ['█████','█   █','█████','█   █','█   █'],
  B: ['████ ','█   █','████ ','█   █','████ '],
  C: [' ████','█    ','█    ','█    ',' ████'],
  D: ['████ ','█   █','█   █','█   █','████ '],
  E: ['█████','█    ','████ ','█    ','█████'],
  F: ['█████','█    ','████ ','█    ','█    '],
  G: [' ████','█    ','█ ███','█   █',' ████'],
  H: ['█   █','█   █','█████','█   █','█   █'],
  I: ['█████','  █  ','  █  ','  █  ','█████'],
  J: ['█████','   █ ','   █ ','█  █ ',' ██  '],
  K: ['█   █','█  █ ','███  ','█  █ ','█   █'],
  L: ['█    ','█    ','█    ','█    ','█████'],
  M: ['█   █','██ ██','█ █ █','█   █','█   █'],
  N: ['█   █','██  █','█ █ █','█  ██','█   █'],
  O: [' ███ ','█   █','█   █','█   █',' ███ '],
  P: ['████ ','█   █','████ ','█    ','█    '],
  Q: [' ███ ','█   █','█ █ █','█  ██',' ██ █'],
  R: ['████ ','█   █','████ ','█  █ ','█   █'],
  S: [' ████','█    ',' ███ ','    █','████ '],
  T: ['█████','  █  ','  █  ','  █  ','  █  '],
  U: ['█   █','█   █','█   █','█   █',' ███ '],
  V: ['█   █','█   █','█   █',' █ █ ','  █  '],
  W: ['█   █','█   █','█ █ █','██ ██','█   █'],
  X: ['█   █',' █ █ ','  █  ',' █ █ ','█   █'],
  Y: ['█   █',' █ █ ','  █  ','  █  ','  █  '],
  Z: ['█████','   █ ','  █  ',' █   ','█████'],
  ' ': ['     ','     ','     ','     ','     '],
  '!': ['  █  ','  █  ','  █  ','     ','  █  '],
  '?': ['████ ','    █','  ██ ','     ','  █  '],
}
function bannerText(text) {
  const lines = ['', '', '', '', '']
  for (const ch of text) {
    const glyph = BANNER_FONT[ch] || BANNER_FONT[' ']
    for (let i = 0; i < 5; i++) lines[i] += glyph[i] + ' '
  }
  return lines
}

export default function Terminal() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [theme, setTheme] = useState(() => localStorage.getItem('rt-theme') || 'green')
  const [matrixActive, setMatrixActive] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [gameActive, setGameActive] = useState(false)
  const [gameTarget, setGameTarget] = useState(null)
  const [gameAttempts, setGameAttempts] = useState(0)

  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const idCounter = useRef(0)
  const sessionBootTime = useRef(Date.now())

  const themeColor = THEMES[theme].color

  // Apply theme to CSS variables
  useEffect(() => {
    const t = THEMES[theme]
    document.documentElement.style.setProperty('--terminal-color', t.color)
    document.documentElement.style.setProperty('--terminal-glow', t.glow)
    document.documentElement.style.setProperty('--terminal-dim', t.dim)
    localStorage.setItem('rt-theme', theme)
  }, [theme])

  // Ctrl+L to clear
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        setHistory([])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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

  const processGameInput = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    addEntry('command', { text: cmd.trim() })

    if (trimmed === 'quit' || trimmed === 'exit') {
      setGameActive(false)
      setGameTarget(null)
      setGameAttempts(0)
      addEntry('output', { lines: ['', '  Game exited. Back to terminal.', ''] })
      return
    }

    const guess = parseInt(trimmed, 10)
    if (isNaN(guess)) {
      addEntry('output', { lines: ['', '  Enter a number between 1-100, or "quit" to exit.', ''] })
      return
    }

    const attempts = gameAttempts + 1
    setGameAttempts(attempts)

    if (guess === gameTarget) {
      setGameActive(false)
      setGameTarget(null)
      setGameAttempts(0)
      addEntry('output', {
        lines: [
          '',
          `  🎉 Correct! The number was ${gameTarget}.`,
          `  You got it in ${attempts} attempt${attempts === 1 ? '' : 's'}!`,
          '',
          attempts <= 3 ? '  Rating: 🌟🌟🌟 — Incredible!' :
          attempts <= 5 ? '  Rating: 🌟🌟 — Nice work!' :
          attempts <= 7 ? '  Rating: 🌟 — Not bad!' :
                          '  Rating: 💪 — You got there!',
          '',
        ],
      })
    } else if (guess < gameTarget) {
      addEntry('output', { lines: ['', `  📈 Too low! Try higher. (Attempt ${attempts})`, ''] })
    } else {
      addEntry('output', { lines: ['', `  📉 Too high! Try lower. (Attempt ${attempts})`, ''] })
    }
  }

  const processCommand = (cmd) => {
    // If game is active, route to game handler
    if (gameActive) {
      processGameInput(cmd)
      return
    }

    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
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

      case 'weather': {
        const city = parts[1]
        if (city && WEATHER_DATA[city]) {
          const w = WEATHER_DATA[city]
          addEntry('output', {
            lines: [
              '',
              '  ╔══════════════════════════════════════════╗',
              `  ║  WEATHER — ${w.city.padEnd(30)}║`,
              '  ╚══════════════════════════════════════════╝',
              '',
              ...w.art.map(l => '    ' + l),
              '',
              `    Condition : ${w.condition}`,
              `    Temp      : ${w.temp}`,
              `    Wind      : ${w.wind}`,
              `    Humidity  : ${w.humidity}`,
              '',
            ],
          })
        } else {
          const cities = Object.keys(WEATHER_DATA).join(', ')
          addEntry('output', {
            lines: [
              '',
              '  Usage: weather <city>',
              `  Available: ${cities}`,
              '',
            ],
          })
        }
        break
      }

      case 'games': {
        const target = Math.floor(Math.random() * 100) + 1
        setGameActive(true)
        setGameTarget(target)
        setGameAttempts(0)
        addEntry('output', {
          lines: [
            '',
            '  ╔══════════════════════════════════════════╗',
            '  ║        NUMBER GUESSING GAME              ║',
            '  ╚══════════════════════════════════════════╝',
            '',
            '  I\'m thinking of a number between 1 and 100.',
            '  Type your guess and press Enter.',
            '  Type "quit" to exit the game.',
            '',
            '  Good luck! 🎲',
            '',
          ],
        })
        break
      }

      case 'ascii-art': {
        const idx = Math.floor(Math.random() * ASCII_ART_COLLECTION.length)
        const chosen = ASCII_ART_COLLECTION[idx]
        addEntry('output', {
          lines: [
            '',
            `  ── ${chosen.name} ──`,
            '',
            ...chosen.art.map(l => '    ' + l),
          ],
        })
        break
      }

      case 'fortune': {
        const quote = FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)]
        addEntry('output', {
          lines: [
            '',
            '  ╔══════════════════════════════════════════╗',
            '  ║          🌟 FORTUNE 🌟                   ║',
            '  ╚══════════════════════════════════════════╝',
            '',
            ...quote.match(/.{1,44}/g).map(l => `  ${l}`),
            '',
          ],
        })
        break
      }

      case 'history': {
        const recent = commandHistory.slice(-20)
        if (recent.length === 0) {
          addEntry('output', { lines: ['', '  No command history yet.', ''] })
        } else {
          const lines = [
            '',
            '  ╔══════════════════════════════════════════╗',
            '  ║          COMMAND HISTORY                 ║',
            '  ╚══════════════════════════════════════════╝',
            '',
            ...recent.map((c, i) => `  ${String(i + 1).padStart(4)}  ${c}`),
            '',
          ]
          addEntry('output', { lines })
        }
        break
      }

      case 'sound': {
        const mode = parts[1]
        if (mode === 'on') {
          setSoundEnabled(true)
          addEntry('output', { lines: ['', '  🔊 Typing sounds enabled.', ''] })
        } else if (mode === 'off') {
          setSoundEnabled(false)
          addEntry('output', { lines: ['', '  🔇 Typing sounds disabled.', ''] })
        } else {
          const current = isSoundEnabled() ? 'on' : 'off'
          addEntry('output', {
            lines: [
              '',
              `  Sound is currently: ${current}`,
              '  Usage: sound on | sound off',
              '',
            ],
          })
        }
        break
      }

      case 'date': {
        const d = new Date()
        addEntry('output', { lines: ['', `  ${d.toDateString()}`, ''] })
        break
      }
      case 'time': {
        const d = new Date()
        addEntry('output', { lines: ['', `  ${d.toLocaleTimeString()}`, ''] })
        break
      }
      case 'echo': {
        const rest = cmd.trim().slice(4).trim()
        addEntry('output', { lines: ['', `  ${rest || ''}`, ''] })
        break
      }
      case 'whoami':
        addEntry('output', { lines: ['', '  sanjay@portfolio-terminal', ''] })
        break
      case 'uname':
        addEntry('output', { lines: ['', '  PortfolioOS 2.0 x86_64 (Neural Processing Unit)', ''] })
        break
      case 'uptime': {
        const bootT = sessionBootTime.current || Date.now()
        const s = Math.floor((Date.now() - bootT) / 1000)
        const mm = Math.floor(s / 60), ss = s % 60
        addEntry('output', { lines: ['', `  up ${mm}m ${ss}s  — ${commandHistory.length} commands issued`, ''] })
        break
      }
      case 'coffee':
        addEntry('output', { lines: [
          '',
          '         (  )   (   )  )',
          '          ) (   )  (  (',
          '          ( )  (    ) )',
          '          _____________',
          '         <_____________> ___',
          '         |             |/ _ \\',
          '         |               | | |',
          '         |               |_| |',
          '      ___|             |\\___/',
          '     /    \\___________/    \\',
          '     \\_____________________/',
          '',
          '  ☕ Coffee served. Have a productive session.',
          '',
        ] })
        break
      case 'cowsay': {
        const say = cmd.trim().slice(6).trim() || 'Moo!'
        const bar = '─'.repeat(say.length + 2)
        addEntry('output', { lines: [
          '',
          `   ┌${bar}┐`,
          `   │ ${say} │`,
          `   └${bar}┘`,
          '          \\   ^__^',
          '           \\  (oo)\\_______',
          '              (__)\\       )\\/\\',
          '                  ||----w |',
          '                  ||     ||',
          '',
        ] })
        break
      }
      case 'stats': {
        const uniqueCmds = new Set(commandHistory.map(c => c.split(' ')[0])).size
        addEntry('output', { lines: [
          '',
          '  ╔═════════════════════════════════════════╗',
          '  ║         SESSION STATS                    ║',
          '  ╚═════════════════════════════════════════╝',
          '',
          `    Commands issued : ${commandHistory.length}`,
          `    Unique commands : ${uniqueCmds}`,
          `    Current theme   : ${THEMES[theme].name}`,
          `    History entries : ${history.length}`,
          '',
        ] })
        break
      }
      case 'banner': {
        const word = (cmd.trim().slice(6).trim() || 'HELLO').toUpperCase().slice(0, 10)
        addEntry('output', { lines: ['', ...bannerText(word).map(l => '  ' + l), ''] })
        break
      }
      case 'cal': {
        const d = new Date()
        const m = d.getMonth(), y = d.getFullYear()
        const first = new Date(y, m, 1).getDay()
        const days = new Date(y, m + 1, 0).getDate()
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
        const lines = ['', `     ${monthNames[m]} ${y}`, '  Su Mo Tu We Th Fr Sa']
        let row = '   '.repeat(first)
        for (let i = 1; i <= days; i++) {
          const cell = (i === d.getDate() ? `[${String(i).padStart(2)}]` : ` ${String(i).padStart(2)} `)
          row += cell.slice(-3)
          if ((first + i) % 7 === 0) { lines.push('  ' + row); row = '' }
        }
        if (row.trim()) lines.push('  ' + row)
        lines.push('')
        addEntry('output', { lines })
        break
      }
      case 'rickroll':
        addEntry('output', { lines: ['', '  🎵 Never gonna give you up...', '  Opening YouTube (j/k, just a message)', '  🎵 Never gonna let you down...', ''] })
        break
      case 'share': {
        const url = window.location.origin + window.location.pathname
        try {
          navigator.clipboard.writeText(url)
          addEntry('output', { lines: ['', `  🔗 URL copied to clipboard:`, `    ${url}`, ''] })
        } catch {
          addEntry('output', { lines: ['', `  🔗 Share URL:`, `    ${url}`, ''] })
        }
        break
      }

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
      const cmd = matches[0]
      setInput(
        cmd === 'theme' || cmd === 'weather' || cmd === 'sound'
          ? cmd + ' '
          : cmd
      )
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

  const promptPrefix = gameActive ? 'guess> ' : 'visitor@portfolio:~$ '

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
            <span style={{ opacity: 0.7 }}>{promptPrefix}</span>
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
