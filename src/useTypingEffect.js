import { useState, useEffect, useRef } from 'react'

export function useTypingEffect(lines, speed = 12, enabled = true) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled || !lines || lines.length === 0) {
      setDisplayedLines(lines || [])
      setIsDone(true)
      return
    }

    setIsTyping(true)
    setIsDone(false)
    setDisplayedLines([])

    let lineIdx = 0
    let charIdx = 0
    const result = []

    intervalRef.current = setInterval(() => {
      if (lineIdx >= lines.length) {
        clearInterval(intervalRef.current)
        setIsTyping(false)
        setIsDone(true)
        return
      }

      const currentLine = lines[lineIdx]

      if (currentLine === '' || currentLine === undefined) {
        result.push('')
        lineIdx++
        charIdx = 0
        setDisplayedLines([...result])
        return
      }

      // Type multiple characters per tick for speed
      const charsPerTick = Math.max(1, Math.floor(speed / 4))
      const end = Math.min(charIdx + charsPerTick, currentLine.length)
      const partial = currentLine.substring(0, end)
      charIdx = end

      if (result.length <= lineIdx) {
        result.push(partial)
      } else {
        result[lineIdx] = partial
      }

      if (charIdx >= currentLine.length) {
        lineIdx++
        charIdx = 0
      }

      setDisplayedLines([...result])
    }, speed)

    return () => clearInterval(intervalRef.current)
  }, [lines, speed, enabled])

  const skipToEnd = () => {
    clearInterval(intervalRef.current)
    setDisplayedLines(lines || [])
    setIsTyping(false)
    setIsDone(true)
  }

  return { displayedLines, isTyping, isDone, skipToEnd }
}
