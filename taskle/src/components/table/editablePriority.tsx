import type { Priority, Task } from '../../types/taskTypes'
import generatePriorityIcon from '../../utils/generatePriorityIcon'
import PrioritySelector from './prioritySelector'

interface EditablePriorityProps {
  id: number
  priority: Priority
  editing: {
    id: number
    field: keyof Task | null
  } | null
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
}
export default function EditablePriority({
  id,
  priority,
  editing,
  handleFieldChange,
}: EditablePriorityProps) {
  return (
    <>
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
    </>
  )
}
