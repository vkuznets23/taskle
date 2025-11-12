import type { Priority, Status, Tag, Task } from '../../types/taskTypes'
import EditableTask from './editableTask'
import EditableTagCell from './editableTagCell'
import EditableStatus from './editableStatus'
import generatePriorityIcon from '../../utils/generatePriorityIcon'

interface EditableTaskCardProps {
  id: number
  task: string
  priority: Priority
  status: Status
  tag: Tag
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

export default function EditableTaskCard({
  id,
  task,
  priority,
  tag,
  status,
  editing,
  setEditing,
  hoveredId,
  setHoveredId,
  handleFieldChange,
}: EditableTaskCardProps) {
  return (
    <div
      className="task-card"
      onMouseEnter={() => setHoveredId(id)} // should it be mouse enter??
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
      <div className="task-card-actions">
        <EditableStatus
          id={id}
          status={status}
          editing={editing}
          setEditing={setEditing}
          handleFieldChange={handleFieldChange}
        />
        <EditableTagCell
          as="div"
          id={id}
          tag={tag}
          editing={editing}
          setEditing={setEditing}
          handleFieldChange={handleFieldChange}
        />
        <div className="priority-selector" title="Click to change priority">
          {generatePriorityIcon(priority)}
        </div>
      </div>
    </div>
  )
}
