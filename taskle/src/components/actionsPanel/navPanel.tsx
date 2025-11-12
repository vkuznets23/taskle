import { useState } from 'react'
import type { Task } from '../../types/taskTypes'
import { SearchInput, Filter, FormTasks } from '../../components'
import { MultiFilter } from './multiFilter'
import { FaTasks, FaTag } from 'react-icons/fa'
import '../../styles/panel.css'
import ChangeNameBtn from './changeNameBtn'
import useBreakpoint from '../../hooks/useWidth'

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

  const is1250 = useBreakpoint('(max-width: 1250px)')
  const is900 = useBreakpoint('(max-width: 900px)')

  return (
    <div className="nav-panel">
      <div className="nav-panel-left">
        <ChangeNameBtn
          className="add-btn"
          onClick={() => setModalOpen(true)}
          text1="+"
          text2="+ Add"
          bp={is1250}
        />
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
            {is1250 ? 'Table' : 'Table View'}
          </button>
          <button
            className={`toggle-btn ${!tableView ? 'active' : ''}`}
            onClick={() => onChange(false)}
          >
            {is1250 ? 'Kanban' : 'Kanban Board'}
          </button>
        </div>
      </div>
      <div className="nav-panel-right">
        <SearchInput
          alwaysOpen={is900}
          query={searchQuery}
          onChange={onSearchChange}
        />
        <div className="filters-container">
          <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <MultiFilter
            isMobile={is900}
            icon={<FaTag />}
            title="Tags"
            options={['work', 'studying', 'personal']}
            selected={tagFilter}
            onChange={setTagFilter}
          />
          {showStatusFilter && (
            <MultiFilter
              icon={<FaTasks />}
              isMobile={is900}
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
