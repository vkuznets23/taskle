import { useState } from 'react'
import FormTasks from './form'
import type { Task } from '../types/taskTypes'

interface NavPanelProps {
  tableView: boolean
  onChange: (tableView: boolean) => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function NavPanel({
  tableView,
  onChange,
  setTasks,
}: NavPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => setModalOpen(true)}>Add</button>
      {modalOpen && (
        <FormTasks setTasks={setTasks} setModalOpen={setModalOpen} />
      )}
      <div className="toggle-wrapper">
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
  )
}
