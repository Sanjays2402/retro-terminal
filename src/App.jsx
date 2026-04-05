import { useState, useCallback } from 'react'
import BootSequence from './BootSequence'
import Terminal from './Terminal'

export default function App() {
  const [booted, setBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <div className="crt-screen">
      <div className="crt-container">
        <div className="scanline-bar" />
        {!booted ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <Terminal />
        )}
      </div>
    </div>
  )
}
