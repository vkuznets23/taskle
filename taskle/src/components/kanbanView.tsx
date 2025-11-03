import type { Task } from '../types/taskTypes'
import '../styles/kanban.css'
import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'

export default function KanbanView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE']

  const counts = columns.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col).length
    return acc
  }, {} as Record<string, number>)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as Task['status']

    await handleUpdate(taskId, { status: newStatus })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kanban">
        {columns.map((col) => (
          <Column
            key={col}
            id={col}
            title={`${col.replace('_', ' ')} (${counts[col] || 0})`}
          >
            {tasks
              .filter((task) => task.status === col)
              .map((task) => (
                <Card key={task.id} id={task.id} tag={task.tag}>
                  <p className="kanban-task">{task.task}</p>
                  <div className="kanban-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {generatePriorityIcon(task.priority)}
                    </span>
                    {generateTagIcon(task.tag)}
                  </div>
                </Card>
              ))}
          </Column>
        ))}
      </div>
    </DndContext>
  )
}

interface ColumnProps {
  id: Task['status']
  title: string
  children: ReactNode
}
function Column({ id, title, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? 'over' : ''}`}>
      <h3>{title}</h3>
      <div className="kanban-tasks">{children}</div>
    </div>
  )
}

interface CardProps {
  id: number
  tag: Task['tag']
  children: ReactNode
}
function Card({ id, tag, children }: CardProps) {
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
