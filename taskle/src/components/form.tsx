import { useState } from 'react'
import { priorityLabels, tagLabels } from '../constants'
import type { Priority, Tag, Task } from '../types/taskTypes'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import type { Errors } from './dashboard'

export default function FormTasks({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<Priority>('LOW')
  const [tag, setTag] = useState<Tag>('NONE')
  const [errors, setErrors] = useState<Partial<Errors>>({})

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
    <>
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
    </>
  )
}
