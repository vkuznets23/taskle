import { FaSortAmountDown } from 'react-icons/fa'
import { FaSortAmountUpAlt } from 'react-icons/fa'

interface FilterProps {
  sortOrder: 'asc' | 'desc'
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
}

export default function Filter({ sortOrder, setSortOrder }: FilterProps) {
  const getArrow = () => {
    return sortOrder === 'asc' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />
  }

  return (
    <div>
      <button
        title={
          sortOrder === 'asc'
            ? 'set priority from high to low'
            : 'set priority from low to high'
        }
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {getArrow()}
      </button>
    </div>
  )
}
