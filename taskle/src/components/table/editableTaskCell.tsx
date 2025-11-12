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
      <EditableTask
        id={id}
        task={task}
        editing={editing}
        setEditing={setEditing}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        handleFieldChange={handleFieldChange}
      />
    </td>
  )
}
