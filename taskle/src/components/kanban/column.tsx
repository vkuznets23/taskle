import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { Task } from '../../types/taskTypes'

interface ColumnProps {
  id: Task['status']
  title: string
  children: ReactNode
}
export default function Column({ id, title, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? 'over' : ''}`}>
      <h3>{title}</h3>
      <div className="kanban-tasks">
        {children}
        {isOver && <div className="kanban-drop-placeholder" />}
      </div>
    </div>
  )
}
