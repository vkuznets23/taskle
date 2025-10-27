import { useEffect, useState } from 'react'
import Navbar from './navBar'
import TableView from './tableView'
import type { Task } from '../types/taskTypes'
import FormTasks from './form'

export interface Errors {
  tasksErrorMsg: string
  serverErrorMsg: string
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await fetch('http://localhost:3005/api/tasks/tasks', {
        method: 'GET',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setLoading(false)
        setTasks(data)
      }
    }

    fetchData()
  }, [])

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

  return (
    <div>
      <Navbar />
      <FormTasks setTasks={setTasks} />
      {loading ? (
        <p>loading...</p>
      ) : (
        <TableView tasks={tasks} handleUpdate={handleUpdate} />
      )}
    </div>
  )
}
