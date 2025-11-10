import { useEffect, useState } from 'react'
import type { Task } from '../../types/taskTypes'
import { SearchInput, Filter, FormTasks } from '../../components'
import { MultiFilter } from './multiFilter'
import { FaTasks, FaTag } from 'react-icons/fa'

import '../../styles/panel.css'

const NAV_PANEL_BREAKPOINTS = [1250, 900] as const

interface NavPanelProps {
  tableView: boolean
  onChange: (tableView: boolean) => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  searchQuery: string
  onSearchChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
  statusFilter: string[]
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>
  tagFilter: string[]
  setTagFilter: React.Dispatch<React.SetStateAction<string[]>>
  showStatusFilter: boolean
}

function useViewportFlags(breakpoints: readonly number[]) {
  const [flags, setFlags] = useState<boolean[]>(() =>
    breakpoints.map(
      (bp) => typeof window !== 'undefined' && window.innerWidth < bp
    )
  )

  useEffect(() => {
    const updateFlags = () => {
      if (typeof window === 'undefined') return
      setFlags(breakpoints.map((bp) => window.innerWidth < bp))
    }

    updateFlags()
    window.addEventListener('resize', updateFlags)
    return () => window.removeEventListener('resize', updateFlags)
  }, [breakpoints])

  return flags
}

export default function NavPanel({
  tableView,
  onChange,
  setTasks,
  searchQuery,
  onSearchChange,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  showStatusFilter,
}: NavPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [isSmallerThan1250, isTablet] = useViewportFlags(NAV_PANEL_BREAKPOINTS)

  return (
    <div className="nav-panel">
      <div className="nav-panel-left">
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          {isSmallerThan1250 ? '+' : '+ Add'}
        </button>
        {modalOpen && (
          <FormTasks setTasks={setTasks} setModalOpen={setModalOpen} />
        )}
        <div className="toggle-wrapper">
          <div
            className="toggle-bg"
            style={{
              transform: tableView ? 'translateX(0%)' : 'translateX(100%)',
            }}
          />
          <button
            className={`toggle-btn ${tableView ? 'active' : ''}`}
            onClick={() => onChange(true)}
          >
            {isSmallerThan1250 ? 'Table' : 'Table View'}
          </button>
          <button
            className={`toggle-btn ${!tableView ? 'active' : ''}`}
            onClick={() => onChange(false)}
          >
            {isSmallerThan1250 ? 'Kanban' : 'Kanban Board'}
          </button>
        </div>
      </div>
      <div className="nav-panel-right">
        <SearchInput
          alwaysOpen={isTablet}
          query={searchQuery}
          onChange={onSearchChange}
        />
        <div className="filters-container">
          <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <MultiFilter
            isMobile={isTablet}
            icon={<FaTag />}
            title="Tags"
            options={['work', 'studying', 'personal']}
            selected={tagFilter}
            onChange={setTagFilter}
          />
          {showStatusFilter && (
            <MultiFilter
              icon={<FaTasks />}
              isMobile={isTablet}
              title="Status"
              options={['active', 'done', 'todo']}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          )}
        </div>
      </div>
    </div>
  )
}
