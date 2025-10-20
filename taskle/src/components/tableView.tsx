import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import type { Task } from '../components/dashboard'
import '../styles/table.css'
import { useState } from 'react'

type Mode = 'normal' | 'edit'

export default function TableView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const [mode, setMode] = useState<Mode>('normal')
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
      {mode === 'normal' && (
        <tbody>
          {tasks.map(({ id, task, priority, tag, status }) => (
            <tr key={id}>
              <td>{task}</td>
              <td className="priority">{generatePriorityIcon(priority)}</td>
              <td>
                <div className={`tag ${tag.toLowerCase()}`}>
                  {generateTagIcon(tag)}
                </div>
              </td>
              <td className="status">{status}</td>
              <td>
                <button
                  onClick={() => setMode(mode === 'normal' ? 'edit' : 'normal')}
                >
                  update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      )}
      {mode === 'edit' && (
        <tbody>
          {tasks.map(({ id, task, priority, tag, status }) => (
            <tr key={id}>
              <td>{task}</td>
              <td className="priority">
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
              </td>
              <td>
                <div className={`tag ${tag.toLowerCase()}`}>
                  {generateTagIcon(tag)}
                </div>
              </td>
              <td className="status">{status}</td>
              <td>
                <button
                  onClick={() => setMode(mode === 'edit' ? 'normal' : 'edit')}
                >
                  update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  )
}
