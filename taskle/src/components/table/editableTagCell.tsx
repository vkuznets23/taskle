import { IoIosArrowDown } from 'react-icons/io'
import { tagLabels } from '../../constants'
import type { Tag, Task } from '../../types/taskTypes'
import { capitalizeFirstLetter } from '../../utils/Capitalizer'
import generateTagIcon from '../../utils/generateTagIcon'

interface EditableTagCellProps {
  id: number
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
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
}
export default function EditableTagCell({
  id,
  tag,
  editing,
  setEditing,
  handleFieldChange,
}: EditableTagCellProps) {
  return (
    <td>
      {editing?.id === id && editing?.field === 'tag' ? (
        <div className="select-wrapper">
          <select
            className={`select ${tag.toLowerCase()}`}
            autoFocus
            value={tag}
            onBlur={() => setEditing(null)}
            onMouseLeave={() => setEditing(null)}
            onChange={(e) => {
              handleFieldChange(id, 'tag', e.target.value as Task['tag'])
              setEditing(null)
            }}
          >
            {tagLabels.map((label, index) => (
              <option key={index} value={label.toUpperCase()}>
                {capitalizeFirstLetter(label)}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="select-icon" />
        </div>
      ) : (
        <div
          className={`tag ${tag.toLowerCase()}`}
          onMouseEnter={() => setEditing({ id, field: 'tag' })}
          title="Click to edit tag"
        >
          {generateTagIcon(tag)}
        </div>
      )}
    </td>
  )
}
