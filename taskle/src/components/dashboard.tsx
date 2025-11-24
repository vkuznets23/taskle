import { useEffect, useState } from 'react'
import { Navbar, TasksList, Loader } from '../components'
import type { Task } from '../types/taskTypes'
import { API_URL } from '../types/api_url'

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
      const res = await fetch(`${API_URL}/api/tasks/tasks`, {
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

  if (loading)
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    )

  return (
    <div>
      <Navbar />
      <TasksList tasks={tasks} setTasks={setTasks} />
    </div>
  )
}
