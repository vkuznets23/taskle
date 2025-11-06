import { useDraggable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Task } from '../../types/taskTypes'

interface CardProps {
  id: number
  tag: Task['tag']
  children: ReactNode
}
export default function Card({ id, tag, children }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id })
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.7 : 1,
  } as React.CSSProperties
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`kanban-card ${tag.toLowerCase()}`}
    >
      {children}
    </div>
  )
}
