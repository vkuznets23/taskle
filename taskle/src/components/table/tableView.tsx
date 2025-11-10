import '../../styles/table.css'
import { useEffect, useState } from 'react'
import type { Task } from '../../types/taskTypes'
import {
  EditableTaskCell,
  EditablePriorityCell,
  EditableTagCell,
  EditableStatusCell,
  DeleteCell,
  NoTasks,
} from '..'

const tableThs = ['task', 'priority', 'tag', 'status']

export default function TableView({
  tasks,
  handleUpdate,
  handelDeleteTask,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
  handelDeleteTask: (id: number) => Promise<void>
}) {
  const [editing, setEditing] = useState<{
    id: number
    field: keyof Task | null
  } | null>(null)

  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setIsNarrow(window.innerWidth <= 1020)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleFieldChange = (id: number, field: keyof Task, value: string) => {
    handleUpdate(id, { [field]: value }).catch((error) => {
      console.error(`Failed to update ${field} for task ${id}:`, error)
    })
  }

  if (tasks.length === 0) return <NoTasks />

  return (
    <table>
      <thead>
        <tr>
          {tableThs.map((th, index) => (
            <th key={index}>{th.toUpperCase()}</th>
          ))}
          <th></th>
        </tr>
      </thead>

      <tbody>
        {tasks.map(({ id, task, priority, tag, status }) => {
          return (
            <tr
              key={id}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <EditableTaskCell
                id={id}
                task={task}
                editing={editing}
                setEditing={setEditing}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                handleFieldChange={handleFieldChange}
              />

              <EditablePriorityCell
                id={id}
                priority={priority}
                editing={editing}
                setEditing={setEditing}
                handleFieldChange={handleFieldChange}
              />

              <EditableTagCell
                id={id}
                tag={tag}
                editing={editing}
                setEditing={setEditing}
                handleFieldChange={handleFieldChange}
              />

              <EditableStatusCell
                id={id}
                status={status}
                editing={editing}
                setEditing={setEditing}
                handleFieldChange={handleFieldChange}
              />

              <DeleteCell
                id={id}
                hoveredId={hoveredId}
                handelDeleteTask={handelDeleteTask}
                alwaysVisible={isNarrow}
              />
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
