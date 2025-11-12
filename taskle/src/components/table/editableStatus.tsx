import { IoIosArrowDown } from 'react-icons/io'
import type { Status, Task } from '../../types/taskTypes'
import useBreakpoint from '../../hooks/useWidth'

const statusLabels: Record<Task['status'], string> = {
  TODO: 'To do',
  IN_PROGRESS: 'Active',
  DONE: 'Done',
}

interface EditableStatusProps {
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
export default function EditableStaus({
  id,
  status,
  editing,
  setEditing,
  handleFieldChange,
}: EditableStatusProps) {
  const is850 = useBreakpoint('(max-width: 850px)')

  return (
    <>
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
          className={is850 ? 'status-div-850' : 'status-div'}
          onMouseEnter={() => setEditing({ id, field: 'status' })}
          title="Click to edit status"
        >
          {statusLabels[status].toUpperCase()}
        </div>
      )}
    </>
  )
}
