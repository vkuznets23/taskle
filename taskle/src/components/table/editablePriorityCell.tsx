import type { Priority, Task } from '../../types/taskTypes'
import EditablePriority from './editablePriority'

interface EditablePriorityCellProps {
  id: number
  priority: Priority
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
export default function EditablePriorityCell({
  id,
  priority,
  editing,
  setEditing,
  handleFieldChange,
}: EditablePriorityCellProps) {
  return (
    <td
      className="priority"
      onMouseEnter={() => setEditing({ id, field: 'priority' })}
      onMouseLeave={() => setEditing(null)}
    >
      <EditablePriority
        id={id}
        priority={priority}
        editing={editing}
        handleFieldChange={handleFieldChange}
      />
    </td>
  )
}
