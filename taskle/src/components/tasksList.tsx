import { useState } from 'react'
import type { Task } from '../types/taskTypes'
import TableView from './tableView'
import KanbanView from './kanvanView'
import '../styles/viewToggle.css'

export default function TasksList({
  tasks,
  setTasks,
}: {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const [tableView, setTableView] = useState(true)
  const handleUpdate = async (id: number, updates: Partial<Task>) => {
    try {
      const res = await fetch(`http://localhost:3005/api/tasks/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      const data = await res.json()
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        )
      } else {
        console.error(data.error)
        throw new Error(data.error || 'Failed to update task')
      }
    } catch (err) {
      console.error('Error updating task:', err)
      throw err // Re-throw the error so optimistic updates can revert
    }
  }

  const handelDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3005/api/tasks/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
        console.log('Task deleted successfully')
      } else {
        console.error(data.error)
        throw new Error(data.error || 'Failed to delete task')
      }
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  return (
    <>
      <div className="toggle-wrapper">
        <button
          className={`toggle-btn ${tableView ? 'active' : ''}`}
          onClick={() => setTableView(true)}
        >
          Table View
        </button>
        <button
          className={`toggle-btn ${!tableView ? 'active' : ''}`}
          onClick={() => setTableView(false)}
        >
          Kanban Board
        </button>
      </div>

      {tableView ? (
        <TableView
          tasks={tasks}
          handleUpdate={handleUpdate}
          handelDeleteTask={handelDeleteTask}
        />
      ) : (
        <KanbanView tasks={tasks} />
      )}
    </>
  )
}
