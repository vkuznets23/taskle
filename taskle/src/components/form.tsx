import { useState } from 'react'
import { priorityLabels, tagLabels } from '../constants'
import type { Priority, Tag, Task } from '../types/taskTypes'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import type { Errors } from './dashboard'
import InputError from './inputError'
import '../styles/formModal.css'

export default function FormTasks({
  setTasks,
  setModalOpen,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
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

    if (task.length > 150) {
      newErrors.tasksErrorMsg = 'Task must be under 150 characters'
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
        setTasks((prev) => [data, ...prev]) // to show new tasks first
        setPriority('LOW')
        setTag('NONE')
        setTask('')
        setErrors({})
        setModalOpen(false)
      } else {
        setErrors({ serverErrorMsg: data.error || 'Something went wrong' })
      }
    } catch (err) {
      console.log(err)
      setErrors({ serverErrorMsg: 'Network error' })
    }
  }

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="form">
        <button onClick={() => setModalOpen(false)}>х</button>
        <div className="form-textarea">
          <textarea
            id="textarea"
            placeholder=" "
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <label htmlFor="textarea">new task</label>
          <InputError errorMessage={errors?.tasksErrorMsg} />
        </div>

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
      <InputError errorMessage={errors?.serverErrorMsg} />
    </div>
  )
}
