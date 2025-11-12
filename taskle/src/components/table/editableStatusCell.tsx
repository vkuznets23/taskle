import type { Status, Task } from '../../types/taskTypes'
import EditableStatus from './editableStatus'

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
      <EditableStatus
        id={id}
        status={status}
        editing={editing}
        setEditing={setEditing}
        handleFieldChange={handleFieldChange}
      />
    </td>
  )
}
