import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import type { Task } from '../components/dashboard'
import '../styles/table.css'
import { useState } from 'react'

type EditableField = 'priority' | 'tag' | 'status' | null

export default function TableView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const [editing, setEditing] = useState<{
    id: number
    field: EditableField
  } | null>(null)

  return (
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Priority</th>
          <th>Tag</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map(({ id, task, priority, tag, status }) => (
          <tr key={id}>
            <td>{task}</td>

            {/* PRIORITY */}
            <td className="priority">
              {editing?.id === id && editing?.field === 'priority' ? (
                <select
                  autoFocus
                  value={priority}
                  onBlur={() => setEditing(null)}
                  onChange={(e) => {
                    handleUpdate(id, {
                      priority: e.target.value as Task['priority'],
                    })
                    setEditing(null)
                  }}
                >
                  <option value="NONE">None</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              ) : (
                <div
                  onClick={() => setEditing({ id, field: 'priority' })}
                  title="Click to edit priority"
                >
                  {generatePriorityIcon(priority)}
                </div>
              )}
            </td>

            {/* TAG */}
            <td>
              {editing?.id === id && editing?.field === 'tag' ? (
                <select
                  autoFocus
                  value={tag}
                  onBlur={() => setEditing(null)}
                  onChange={(e) => {
                    handleUpdate(id, { tag: e.target.value as Task['tag'] })
                    setEditing(null)
                  }}
                >
                  <option value="NONE">None</option>
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="STUDYING">Studying</option>
                </select>
              ) : (
                <div
                  className={`tag ${tag.toLowerCase()}`}
                  onClick={() => setEditing({ id, field: 'tag' })}
                  title="Click to edit tag"
                >
                  {generateTagIcon(tag)}
                </div>
              )}
            </td>

            {/* STATUS */}
            <td>
              {editing?.id === id && editing?.field === 'status' ? (
                <select
                  autoFocus
                  value={status}
                  onBlur={() => setEditing(null)}
                  onChange={(e) => {
                    handleUpdate(id, {
                      status: e.target.value as Task['status'],
                    })
                    setEditing(null)
                  }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              ) : (
                <div
                  onClick={() => setEditing({ id, field: 'status' })}
                  title="Click to edit status"
                >
                  {status}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
