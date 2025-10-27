import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
import '../styles/table.css'
import { useOptimistic, useState, useTransition } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import { priorityLabels, tagLabels } from '../constants'
import type { Task } from '../types/taskTypes'

export default function TableView({
  tasks,
  handleUpdate,
}: {
  tasks: Task[]
  handleUpdate: (id: number, updates: Partial<Task>) => Promise<void>
}) {
  const [editing, setEditing] = useState<{
    id: number
    field: keyof Task | null
  } | null>(null)

  const [isPending, startTransition] = useTransition()

  const tableThs = ['task', 'priority', 'tag', 'status']
  const statusLabels: Record<Task['status'], string> = {
    TODO: 'To do',
    IN_PROGRESS: 'Active',
    DONE: 'Done',
  }

  // Optimistic state for immediate UI updates
  const [optimisticTasks, applyOptimisticUpdate] = useOptimistic(
    tasks,
    (state, action: { id: number; updates: Partial<Task> }) =>
      state.map((task) =>
        task.id === action.id ? { ...task, ...action.updates } : task
      )
  )

  // Handle field changes with optimistic updates
  const handleFieldChange = (id: number, field: keyof Task, value: string) => {
    startTransition(async () => {
      // Apply optimistic update immediately
      applyOptimisticUpdate({ id, updates: { [field]: value } })

      try {
        // Make the actual API call
        await handleUpdate(id, { [field]: value })
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    })
  }

  return (
    <table className={isPending ? 'updating' : ''}>
      <thead>
        <tr>
          {tableThs.map((th, index) => (
            <th key={index}>{th.toUpperCase()}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {optimisticTasks.map(({ id, task, priority, tag, status }) => {
          return (
            <tr key={id}>
              <td>
                <p>{task}</p>
              </td>

              {/* PRIORITY */}
              <td className="priority">
                {editing?.id === id && editing?.field === 'priority' ? (
                  <select
                    autoFocus
                    value={priority}
                    onBlur={() => setEditing(null)}
                    onChange={(e) => {
                      setEditing(null)
                      handleFieldChange(
                        id,
                        'priority',
                        e.target.value as Task['priority']
                      )
                    }}
                  >
                    {priorityLabels.map((label, index) => (
                      <option key={index} value={label.toUpperCase()}>
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
