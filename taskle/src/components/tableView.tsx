import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import type { Task } from '../components/dashboard'
import '../styles/table.css'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { capitalizeFirstLetter } from '../utils/Capitalizer'

type EditableField = 'task' | 'priority' | 'tag' | 'status' | null

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

  const tableThs = ['task', 'priority', 'tag', 'status']
  const tagLabels = ['work', 'studying', 'personal', 'none']
  const priorityLabels = ['hight', 'medium', 'low', 'none']
  const statusLabels: Record<Task['status'], string> = {
    TODO: 'To do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  }

  return (
    <table>
      <thead>
        <tr>
          {tableThs.map((th, index) => (
            <th key={index}>{th.toUpperCase()}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {tasks.map(({ id, task, priority, tag, status }) => {
          return (
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
                      className={`select ${tag.toLowerCase()}`}
                      autoFocus
                      value={tag}
                      onMouseLeave={() => setEditing(null)}
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
                    onMouseEnter={() => setEditing({ id, field: 'tag' })}
                    title="Click to edit tag"
                  >
                    {generateTagIcon(tag)}
                  </div>
                )}
              </td>

              {/* STATUS */}
              <td>
                {editing?.id === id && editing?.field === 'status' ? (
                  <div className="select-wrapper status">
                    <select
                      className="select status"
                      autoFocus
                      value={status}
                      onMouseLeave={() => setEditing(null)}
                      onBlur={() => setEditing(null)}
                      onChange={(e) => {
                        handleUpdate(id, {
                          status: e.target.value as Task['status'],
                        })
                        setEditing(null)
                      }}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option value={value}>{label.toUpperCase()}</option>
                      ))}
                    </select>
                    <IoIosArrowDown className="select-icon" />
                  </div>
                ) : (
                  <div
                    onMouseEnter={() => setEditing({ id, field: 'status' })}
                    title="Click to edit status"
                  >
                    {statusLabels[status].toUpperCase()}
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
