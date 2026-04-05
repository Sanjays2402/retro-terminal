import { motion } from 'framer-motion'

export default function SkillBar({ name, level, index, themeColor }) {
  const barWidth = 30
  const filled = Math.round((level / 100) * barWidth)
  const empty = barWidth - filled

  return (
    <motion.div
      className="terminal-text text-sm whitespace-pre"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      {'  '}{name.padEnd(28)} [
      <span style={{ color: themeColor }}>{'█'.repeat(filled)}</span>
      <span style={{ opacity: 0.3 }}>{'░'.repeat(empty)}</span>
      ] {level}%
    </motion.div>
  )
}
