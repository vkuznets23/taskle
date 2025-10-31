import { BiSortUp } from 'react-icons/bi'
import { BiSortDown } from 'react-icons/bi'

import '../styles/sortingBtns.css'

interface FilterProps {
  sortOrder: 'asc' | 'desc'
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
}

export default function Filter({ sortOrder, setSortOrder }: FilterProps) {
  const getArrow = () => {
    return sortOrder === 'asc' ? <BiSortUp /> : <BiSortDown />
  }

  return (
    <div>
      <button
        title={
          sortOrder === 'asc'
            ? 'set priority from high to low'
            : 'set priority from low to high'
        }
        className="priority-sort-btn"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {getArrow()}
      </button>
    </div>
  )
}
