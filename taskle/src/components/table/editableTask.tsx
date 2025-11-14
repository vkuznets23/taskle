import { MdEdit } from 'react-icons/md'
import type { Task } from '../../types/taskTypes'

interface EditableTaskProps {
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
  alwaysShowEdit?: boolean
}
export default function EditableTask({
  id,
  task,
  editing,
  setEditing,
  hoveredId,
  handleFieldChange,
  alwaysShowEdit = false,
}: EditableTaskProps) {
  return (
    <>
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
          {(alwaysShowEdit || hoveredId === id) && (
            <button
              className="edit-btn"
              onClick={() => setEditing({ id, field: 'task' })}
            >
              <MdEdit />
            </button>
          )}
        </div>
      )}
    </>
  )
}
