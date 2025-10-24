import { useEffect, useState } from 'react'
import Navbar from './navBar'
import TableView from './tableView'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import { priorityLabels, tagLabels } from '../constants'
import type { Priority, Tag, Task } from '../types/taskTypes'

interface Errors {
  tasksErrorMsg: string
  serverErrorMsg: string
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<Priority>('LOW')
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
          {priorityLabels.map((priority, index) => (
            <option key={index} value={priority.toUpperCase()}>
              {capitalizeFirstLetter(priority)}
            </option>
          ))}
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value as Tag)}>
          {tagLabels.map((tag, index) => (
            <option key={index} value={tag.toUpperCase()}>
              {capitalizeFirstLetter(tag)}
            </option>
          ))}
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
