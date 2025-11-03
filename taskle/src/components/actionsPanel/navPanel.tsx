import { useState } from 'react'
import type { Task } from '../../types/taskTypes'
import { SearchInput, Filter, FormTasks } from '../../components'
import { MultiFilter } from './multiFilter'
import '../../styles/panel.css'

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
}: NavPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        marginTop: '50px',
        marginBottom: '10px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add
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
            Table View
          </button>
          <button
            className={`toggle-btn ${!tableView ? 'active' : ''}`}
            onClick={() => onChange(false)}
          >
            Kanban Board
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SearchInput query={searchQuery} onChange={onSearchChange} />
        <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <MultiFilter
          title="Tags"
          options={['work', 'studying', 'personal']}
          selected={tagFilter}
          onChange={setTagFilter}
        />
        <MultiFilter
          title="Status"
          options={['active', 'done', 'todo']}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
      </div>
    </div>
  )
}
