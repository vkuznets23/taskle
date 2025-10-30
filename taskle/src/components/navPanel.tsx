interface NavPanelProps {
  tableView: boolean
  onChange: (tableView: boolean) => void
}

export default function NavPanel({ tableView, onChange }: NavPanelProps) {
  return (
    <div style={{ display: 'flex' }}>
      <button>Add</button>
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
