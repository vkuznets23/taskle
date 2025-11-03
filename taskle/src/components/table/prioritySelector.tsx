import { useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/Capitalizer'
import type { Priority } from '../../types/taskTypes'

const levels: Priority[] = ['LOW', 'MEDIUM', 'HIGH']

export default function PrioritySelector({
  id,
  currentPriority,
  onChange,
}: {
  id: number
  currentPriority: Priority
  onChange: (priority: Priority) => void
}) {
  const [hovered, setHovered] = useState<Priority | null>(null)

  const getLevelIndex = (level: Priority) => levels.indexOf(level)

  return (
    <div className="priority-selector">
      {levels.map((level) => {
        const activeIndex = getLevelIndex(currentPriority)
        const hoverIndex = hovered ? getLevelIndex(hovered) : -1
        const displayIndex = hoverIndex >= 0 ? hoverIndex : activeIndex
        const shouldHighlight = getLevelIndex(level) <= displayIndex

        return (
          <div
            key={`${id}-${level}`}
            className={`priority-dot ${level.toLowerCase()} ${
              shouldHighlight ? 'highlight' : ''
            }`}
            onMouseEnter={() => setHovered(level)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              setHovered(null)
              onChange(level)
            }}
            title={capitalizeFirstLetter(level.toLowerCase())}
          />
        )
      })}
    </div>
  )
}
