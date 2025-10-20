import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import type { Task } from '../components/dashboard'
import '../styles/table.css'
import { useState } from 'react'

export default function TableView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Priority</th>
          <th>Tag</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {tasks.map(({ id, task, priority, tag, status }) => (
          <tr key={id}>
            <td>{task}</td>

            <td className="priority">
              {editingId === id ? (
                <select
                  value={priority}
                  onChange={(e) =>
                    handleUpdate(id, {
                      priority: e.target.value as Task['priority'],
                    })
                  }
                >
                  <option value="NONE">None</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              ) : (
                generatePriorityIcon(priority)
              )}
            </td>

            <td>
              {editingId === id ? (
                <select
                  value={tag}
                  onChange={(e) =>
                    handleUpdate(id, { tag: e.target.value as Task['tag'] })
                  }
                >
                  <option value="NONE">None</option>
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="STUDYING">Studying</option>
                </select>
              ) : (
                <div className={`tag ${tag.toLowerCase()}`}>
                  {generateTagIcon(tag)}
                </div>
              )}
            </td>

            <td>
              {editingId === id ? (
                <select
                  value={status}
                  onChange={(e) =>
                    handleUpdate(id, {
                      status: e.target.value as Task['status'],
                    })
                  }
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              ) : (
                status
              )}
            </td>

            <td>
              {editingId === id ? (
                <button onClick={() => setEditingId(null)}>Done</button>
              ) : (
                <button onClick={() => setEditingId(id)}>Update</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
