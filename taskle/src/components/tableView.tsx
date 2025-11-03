import '../styles/table.css'
import { useState } from 'react'
import type { Task } from '../types/taskTypes'
import {
  EditableTaskCell,
  EditablePriorityCell,
  EditableTagCell,
  NoTasks,
} from '../components'
import EditableStatusCell from './editableStatusCell'
import DeleteCell from './deleteCell'

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
              />
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
