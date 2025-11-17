import type { Task } from '../../types/taskTypes'
import EditableTask from './editableTask'

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
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
}

export default function EditableTaskCell({
  id,
  task,
  editing,
  setEditing,
  handleFieldChange,
}: EditableTaskCellProps) {
  return (
    <td className="task-cell">
      <EditableTask
        id={id}
        task={task}
        editing={editing}
        setEditing={setEditing}
        handleFieldChange={handleFieldChange}
      />
    </td>
  )
}
