import type { Task } from '../../types/taskTypes'
import '../../styles/kanban.css'
import generatePriorityIcon from '../../utils/generatePriorityIcon'
import generateTagIcon from '../../utils/generateTagIcon'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from '@dnd-kit/core'
import { useRef, useMemo, useState } from 'react'
import { Card, Column } from '../.'

export default function KanbanView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE']
  const kanbanRef = useRef<HTMLDivElement>(null)

  const restrictToKanbanContainer: Modifier = useMemo(() => {
    return ({ transform, draggingNodeRect }) => {
      if (!draggingNodeRect || !kanbanRef.current) {
        return transform
      }

      const kanbanContainer = kanbanRef.current.getBoundingClientRect()
      const viewport = {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      }

      const containerLeft = Math.max(kanbanContainer.left, viewport.left)
      const containerRight = Math.min(kanbanContainer.right, viewport.right)
      const containerTop = Math.max(kanbanContainer.top, viewport.top)
      const containerBottom = Math.min(kanbanContainer.bottom, viewport.bottom)

      const minX = containerLeft - draggingNodeRect.left
      const maxX =
        containerRight - (draggingNodeRect.left + draggingNodeRect.width)
      const minY = containerTop - draggingNodeRect.top
      const maxY =
        containerBottom - (draggingNodeRect.top + draggingNodeRect.height)

      return {
        ...transform,
        x: Math.max(minX, Math.min(maxX, transform.x)),
        y: Math.max(minY, Math.min(maxY, transform.y)),
      }
    }
  }, [])

  const [draggingTaskStatus, setDraggingTaskStatus] = useState<
    Task['status'] | null
  >(null)

  const counts = columns.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col).length
    return acc
  }, {} as Record<string, number>)

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = Number(event.active.id)
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setDraggingTaskStatus(task.status)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setDraggingTaskStatus(null)

    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as Task['status']

    await handleUpdate(taskId, { status: newStatus })
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToKanbanContainer]}
    >
      <div ref={kanbanRef} className="kanban">
        {columns.map((col) => (
          <Column
            key={col}
            id={col}
            title={`${col
              .replace('IN_PROGRESS', 'ACTIVE')
              .replace('TODO', 'TO DO')} (${counts[col] || 0})`}
            draggingFromStatus={draggingTaskStatus}
          >
            {tasks
              .filter((task) => task.status === col)
              .map((task) => (
                <Card key={task.id} id={task.id} tag={task.tag}>
                  <p className="kanban-task">{task.task}</p>
                  <div className="kanban-meta">
                    <span
                      className={`priority-kanban ${task.priority.toLowerCase()}`}
                    >
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
