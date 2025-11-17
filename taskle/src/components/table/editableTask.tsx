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
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
}
export default function EditableTask({
  id,
  task,
  editing,
  setEditing,
  handleFieldChange,
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
        <div
          className="task-cell-content"
          title="Edit the task"
          onClick={() => setEditing({ id, field: 'task' })}
        >
          <p>{task}</p>
        </div>
      )}
    </>
  )
}
