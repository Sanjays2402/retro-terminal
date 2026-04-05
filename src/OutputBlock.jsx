import { useTypingEffect } from './useTypingEffect'
import SkillBar from './SkillBar'
import { SKILLS_DATA } from './data'

export default function OutputBlock({ entry, themeColor, isLatest }) {
  const shouldType = isLatest && entry.type === 'output'
  const { displayedLines, isTyping } = useTypingEffect(
    entry.type === 'output' ? entry.lines : null,
    10,
    shouldType
  )

  if (entry.type === 'command') {
    return (
      <div className="terminal-text text-sm whitespace-pre">
        <span style={{ opacity: 0.7 }}>visitor@portfolio:~$ </span>
        {entry.text}
      </div>
    )
  }

  if (entry.type === 'skills') {
    return (
      <div>
        <div className="terminal-text text-sm whitespace-pre mb-1">
          {''}
        </div>
        <div className="terminal-text text-sm whitespace-pre mb-1">
          {'  ╔══════════════════════════════════════════╗'}
        </div>
        <div className="terminal-text text-sm whitespace-pre mb-1">
          {'  ║          TECHNICAL SKILLS                ║'}
        </div>
        <div className="terminal-text text-sm whitespace-pre mb-2">
          {'  ╚══════════════════════════════════════════╝'}
        </div>
        <div className="terminal-text text-sm whitespace-pre mb-2">{''}</div>
        {SKILLS_DATA.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            index={i}
            themeColor={themeColor}
          />
        ))}
        <div className="terminal-text text-sm whitespace-pre mt-2">{''}</div>
      </div>
    )
  }

  const linesToRender = shouldType ? displayedLines : (entry.lines || [])

  return (
    <div>
      {linesToRender.map((line, i) => (
        <div key={i} className="terminal-text text-sm whitespace-pre leading-relaxed">
          {line}
        </div>
      ))}
      {isTyping && <span className="cursor-block" />}
    </div>
  )
}
