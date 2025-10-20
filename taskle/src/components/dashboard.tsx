import { useEffect, useState } from 'react'
import Navbar from './navBar'
import TableView from './tableView'

export type Priority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
export type Tag = 'NONE' | 'WORK' | 'PERSONAL' | 'STUDYING'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  task: string
  priority: Priority
  tag: Tag
  status: Status
}

interface Errors {
  tasksErrorMsg: string
  serverErrorMsg: string
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<Priority>('NONE')
  const [tag, setTag] = useState<Tag>('NONE')
  const [errors, setErrors] = useState<Partial<Errors>>({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3005/api/tasks/tasks', {
        method: 'GET',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
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
      }
    } catch (err) {
      console.error('Error updating task:', err)
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
        setPriority('NONE')
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        {errors?.tasksErrorMsg && (
          <p style={{ color: 'red' }}>{errors.tasksErrorMsg}</p>
        )}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="NONE">None</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value as Tag)}>
          <option value="NONE">None</option>
          <option value="WORK">Work</option>
          <option value="PERSONAL">Personal</option>
          <option value="STUDYING">Studying</option>
        </select>
        <button type="submit">submit</button>
      </form>
      {errors?.serverErrorMsg && (
        <p style={{ color: 'red' }}>{errors.serverErrorMsg}</p>
      )}
      <TableView tasks={tasks} handleUpdate={handleUpdate} />
    </div>
  )
}
