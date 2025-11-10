import { useDraggable } from '@dnd-kit/core'
import type { Task } from '../types/taskTypes'

export default function SwipeItem({
  task,
  onDelete,
}: {
  task: Task
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transform ? 'none' : 'transform 0.3s ease',
  }

  const threshold = 100
  if (transform?.x && transform?.x > threshold) {
    onDelete()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="swipe-item"
    >
      {task.task}
    </div>
  )
}
