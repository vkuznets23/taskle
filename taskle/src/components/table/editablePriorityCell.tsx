import type { Priority, Task } from '../../types/taskTypes'
import generatePriorityIcon from '../../utils/generatePriorityIcon'
import PrioritySelector from './prioritySelector'

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
      {editing?.id === id && editing?.field === 'priority' ? (
        <PrioritySelector
          id={id}
          currentPriority={priority}
          onChange={(newPriority) =>
            handleFieldChange(id, 'priority', newPriority)
          }
        />
      ) : (
        <div className="priority-selector" title="Click to change priority">
          {generatePriorityIcon(priority)}
        </div>
      )}
    </td>
  )
}
