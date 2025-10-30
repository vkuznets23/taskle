import { useState } from 'react'
import FormTasks from './form'
import type { Task } from '../types/taskTypes'
import '../styles/panel.css'

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
    <div
      style={{
        display: 'flex',
        marginTop: '50px',
        marginBottom: '10px',
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
  )
}
