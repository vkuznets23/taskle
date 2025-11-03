import { RiDeleteBin5Line } from 'react-icons/ri'

interface DeleteCellProps {
  id: number
  hoveredId: number | null
  handelDeleteTask: (id: number) => Promise<void>
}

export default function DeleteCell({
  id,
  hoveredId,
  handelDeleteTask,
}: DeleteCellProps) {
  return (
    <td className="delete-cell">
      {hoveredId === id && (
        <button className="delete-btn" onClick={() => handelDeleteTask(id)}>
          <RiDeleteBin5Line />
        </button>
      )}
    </td>
  )
}
