import { useEffect, useState } from 'react'
import Navbar from './navBar'
import TableView from './tableView'
import type { Priority, Tag, Task } from '../types/taskTypes'
import FormTasks from './form'

export interface Errors {
  tasksErrorMsg: string
  serverErrorMsg: string
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<Priority>('LOW')
  const [tag, setTag] = useState<Tag>('NONE')
  const [errors, setErrors] = useState<Partial<Errors>>({})
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Partial<Errors> = {}

    if (!task || !task.trim()) {
      newErrors.tasksErrorMsg = 'Task is required'
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/tasks/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task, priority, tag }),
      })
      const data = await res.json()
      console.log(data)

      if (res.ok) {
        setTasks((prev) => [...prev, data])
        setPriority('LOW')
        setTag('NONE')
        setTask('')
        setErrors({})
      } else {
        setErrors({ serverErrorMsg: data.error || 'Something went wrong' })
      }
    } catch (err) {
      console.log(err)
      setErrors({ serverErrorMsg: 'Network error' })
    }
  }

  return (
    <div>
      <Navbar />
      <FormTasks
        task={task}
        setTask={setTask}
        tag={tag}
        setTag={setTag}
        priority={priority}
        setPriority={setPriority}
        errors={errors}
        handleSubmit={handleSubmit}
      />
      {errors?.serverErrorMsg && (
        <p style={{ color: 'red' }}>{errors.serverErrorMsg}</p>
      )}
      {loading ? (
        <p>loading...</p>
      ) : (
        <TableView tasks={tasks} handleUpdate={handleUpdate} />
      )}
    </div>
  )
}
