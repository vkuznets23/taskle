import type { SortKey } from './tasksList'

interface FilterProps {
  sortKey: SortKey
  setSortKey: React.Dispatch<React.SetStateAction<SortKey>>
  sortOrder: 'asc' | 'desc'
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
}

export default function Filter({
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
}: FilterProps) {
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const getArrow = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortOrder === 'asc' ? '⬆️' : '⬇️'
  }

  const getName = (key: SortKey) => {
    if (sortKey !== key) return ''
    return sortOrder === 'asc' ? 'A-Z' : 'Z-A'
  }

  return (
    <div>
      <button onClick={() => handleSort('priority')}>
        Priority {getArrow('priority')}
      </button>

      <button onClick={() => handleSort('task')}>{getName('task')}</button>
    </div>
  )
}
