import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import type { Task } from '../components/dashboard'
import '../styles/table.css'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { capitalizeFirstLetter } from '../utils/Capitalizer'

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

  const tagLabels = ['work', 'studying', 'personal', 'none']
  const priorityLabels = ['hight', 'medium', 'low', 'none']
  const statusLabels = ['to do', 'in progress', 'done']

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
                  {priorityLabels.map((label) => (
                    <option value={label.toUpperCase()}>
                      {capitalizeFirstLetter(label)}
                    </option>
                  ))}
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
                <div className="select-wrapper">
                  <select
                    className="select"
                    autoFocus
                    value={tag}
                    onBlur={() => setEditing(null)}
                    onChange={(e) => {
                      handleUpdate(id, { tag: e.target.value as Task['tag'] })
                      setEditing(null)
                    }}
                  >
                    {tagLabels.map((label) => (
                      <option value={label.toUpperCase()}>
                        {capitalizeFirstLetter(label)}
                      </option>
                    ))}
                  </select>
                  <IoIosArrowDown className="select-icon" />
                </div>
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
                  {statusLabels.map((label) => (
                    <option value={label.toUpperCase()}>
                      {capitalizeFirstLetter(label)}
                    </option>
                  ))}
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
