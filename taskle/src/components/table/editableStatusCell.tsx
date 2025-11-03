import { IoIosArrowDown } from 'react-icons/io'
import type { Status, Task } from '../../types/taskTypes'

const statusLabels: Record<Task['status'], string> = {
  TODO: 'To do',
  IN_PROGRESS: 'Active',
  DONE: 'Done',
}

interface EditableStatusCellProps {
  id: number
  status: Status
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
export default function EditableStatusCell({
  id,
  status,
  editing,
  setEditing,
  handleFieldChange,
}: EditableStatusCellProps) {
  return (
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
              handleFieldChange(id, 'status', e.target.value as Task['status'])
              setEditing(null)
            }}
          >
            {Object.entries(statusLabels).map(([value, label], index) => (
              <option key={index} value={value}>
                {label.toUpperCase()}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="select-icon" />
        </div>
      ) : (
        <div
          className="status-div"
          onMouseEnter={() => setEditing({ id, field: 'status' })}
          title="Click to edit status"
        >
          {statusLabels[status].toUpperCase()}
        </div>
      )}
    </td>
  )
}
