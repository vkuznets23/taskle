import generateTagIcon from '../utils/generateTagIcon'
import '../styles/table.css'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import { tagLabels } from '../constants'
import type { Task } from '../types/taskTypes'
import { RiDeleteBin5Line } from 'react-icons/ri'
import NoTasks from './noTasks'
import EditableTaskCell from './editableTaskCell'
import EditablePriorityCell from './editablePriorityCell'

const tableThs = ['task', 'priority', 'tag', 'status']
const statusLabels: Record<Task['status'], string> = {
  TODO: 'To do',
  IN_PROGRESS: 'Active',
  DONE: 'Done',
}

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

              {/* TAG */}
              <td>
                {editing?.id === id && editing?.field === 'tag' ? (
                  <div className="select-wrapper">
                    <select
                      className={`select ${tag.toLowerCase()}`}
                      autoFocus
                      value={tag}
                      onBlur={() => setEditing(null)}
                      onMouseLeave={() => setEditing(null)}
                      onChange={(e) => {
                        handleFieldChange(
                          id,
                          'tag',
                          e.target.value as Task['tag']
                        )
                        setEditing(null)
                      }}
                    >
                      {tagLabels.map((label, index) => (
                        <option key={index} value={label.toUpperCase()}>
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
                      onBlur={() => setEditing(null)}
                      onMouseLeave={() => setEditing(null)}
                      onChange={(e) => {
                        handleFieldChange(
                          id,
                          'status',
                          e.target.value as Task['status']
                        )
                        setEditing(null)
                      }}
                    >
                      {Object.entries(statusLabels).map(
                        ([value, label], index) => (
                          <option key={index} value={value}>
                            {label.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                    <IoIosArrowDown className="select-icon" />
                  </div>
                ) : (
                  <div
                    className="status-div"
                    onMouseEnter={() => setEditing({ id, field: 'status' })}
                    title="Click to edit status"
                  >
                    {statusLabels[status].toUpperCase()}
                  </div>
                )}
              </td>
              <td className="delete-cell">
                {hoveredId === id && (
                  <button
                    className="delete-btn"
                    onClick={() => handelDeleteTask(id)}
                  >
                    <RiDeleteBin5Line />
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
