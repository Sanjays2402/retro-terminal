import { useEffect, useRef } from 'react'

export default function MatrixRain({ active, onComplete, themeColor }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const startTime = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'

    startTime.current = Date.now()

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = themeColor || '#00ff41'
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      const elapsed = Date.now() - startTime.current
      if (elapsed > 5000) {
        // Fade out
        const fadeProgress = Math.min((elapsed - 5000) / 1000, 1)
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress * 0.15})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (fadeProgress >= 1) {
          cancelAnimationFrame(animRef.current)
          onComplete?.()
          return
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [active, onComplete, themeColor])

  if (!active) return null

  return <canvas ref={canvasRef} className="matrix-canvas" />
}
