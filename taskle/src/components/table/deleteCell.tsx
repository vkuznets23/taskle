import { RiDeleteBin5Line } from 'react-icons/ri'

interface DeleteCellProps {
  id: number
  hoveredId: number | null
  handelDeleteTask: (id: number) => Promise<void>
  alwaysVisible?: boolean
}

export default function DeleteCell({
  id,
  hoveredId,
  handelDeleteTask,
  alwaysVisible = false,
}: DeleteCellProps) {
  const showDelete = alwaysVisible || hoveredId === id

  return (
    <td className="delete-cell">
      {showDelete && (
        <button className="delete-btn" onClick={() => handelDeleteTask(id)}>
          <RiDeleteBin5Line />
        </button>
      )}
    </td>
  )
}
