import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BOOT_SEQUENCE } from './data'

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    let timeout
    let current = 0
    let totalDelay = 0

    const showNext = () => {
      if (current >= BOOT_SEQUENCE.length) {
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 400)
        }, 300)
        return
      }

      const item = BOOT_SEQUENCE[current]
      totalDelay = item.delay

      timeout = setTimeout(() => {
        setLines(prev => [...prev, item.text])
        current++
        showNext()
      }, totalDelay)
    }

    // Small initial delay for effect
    timeout = setTimeout(showNext, 500)

    return () => clearTimeout(timeout)
  }, [onComplete])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full p-6 overflow-y-auto"
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {lines.map((line, i) => (
        <div key={i} className="boot-line terminal-text text-sm leading-relaxed whitespace-pre">
          {line}
        </div>
      ))}
      {!done && (
        <span className="cursor-block" />
      )}
    </motion.div>
  )
}
