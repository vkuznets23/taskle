import { MdEdit } from 'react-icons/md'
import type { Task } from '../types/taskTypes'

interface EditableTaskCellProps {
  id: number
  task: string
  editing: {
    id: number
    field: keyof Task | null
  } | null
  setEditing: (
    value: React.SetStateAction<{
      id: number
      field: keyof Task | null
    } | null>
  ) => void
  hoveredId: number | null
  setHoveredId: (value: React.SetStateAction<number | null>) => void
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
}

export default function EditableTaskCell({
  id,
  task,
  editing,
  setEditing,
  hoveredId,
  setHoveredId,
  handleFieldChange,
}: EditableTaskCellProps) {
  return (
    <td
      className="task-cell"
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {editing?.id === id && editing?.field === 'task' ? (
        <textarea
          className="task-textarea"
          autoFocus
          rows={3}
          defaultValue={task}
          onBlur={(e) => {
            const newValue = e.target.value.trim()
            if (newValue && newValue !== task) {
              handleFieldChange(id, 'task', newValue)
            }
            setEditing(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              const newValue = (e.target as HTMLTextAreaElement).value.trim()
              if (newValue && newValue !== task) {
                handleFieldChange(id, 'task', newValue)
              }
              setEditing(null)
            }
          }}
        />
      ) : (
        <div className="task-cell-content">
          <p>{task}</p>
          {hoveredId === id && (
            <button
              className="edit-btn"
              onClick={() => setEditing({ id, field: 'task' })}
            >
              <MdEdit />
            </button>
          )}
        </div>
      )}
    </td>
  )
}
