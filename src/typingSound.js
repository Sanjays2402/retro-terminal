// Typing sound effects using Web Audio API
let audioCtx = null
let soundEnabled = false

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function isSoundEnabled() {
  return soundEnabled
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled
  if (enabled) {
    // Initialize audio context on user gesture
    getAudioContext()
  }
}

export function playTypeClick() {
  if (!soundEnabled) return
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Short, subtle click — vary slightly for realism
    const baseFreq = 800 + Math.random() * 400
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02)
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.03)
  } catch {
    // Silently ignore audio errors
  }
}
