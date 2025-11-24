import { useRef, useState } from 'react'
import { tagLabels } from '../../constants'
import type { Priority, Tag, Task } from '../../types/taskTypes'
import { capitalizeFirstLetter } from '../../utils/Capitalizer'
import type { Errors } from '../dashboard'
import InputError from '../inputError'
import '../../styles/formModal.css'
import '../../styles/table.css'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'
import PrioritySelector from '../table/prioritySelector'
import { API_URL } from '../../types/api_url'

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
      const res = await fetch(`${API_URL}/api/tasks/tasks`, {
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

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const resizeTextarea = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask(e.target.value)
    resizeTextarea()
  }

  return (
    <div className="modal" onClick={() => setModalOpen(false)}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="form"
      >
        <button className="close-btn" onClick={() => setModalOpen(false)}>
          <IoCloseSharp />
        </button>
        <div className="form-textarea">
          <label htmlFor="textarea" className="sr-only">
            new task
          </label>
          <textarea
            id="textarea"
            placeholder="What's your task?"
            value={task}
            ref={textareaRef}
            onChange={handleChangeTextarea}
            className={errors?.tasksErrorMsg ? 'textarea-error' : ''}
            style={{ overflow: 'hidden', resize: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ minWidth: '120px' }}>
              <InputError errorMessage={errors?.tasksErrorMsg} />
            </div>
            <p
              style={{
                margin: '0px',
                fontSize: '12px',
              }}
            >
              {task.length}/150
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="priority-selector-wrapper">
            <label className="priority-label">priority</label>
            <PrioritySelector
              currentPriority={priority}
              onChange={setPriority}
            />
          </div>

          <div className="select-wrapper">
            <select
              className={`select ${tag.toLowerCase()}`}
              autoFocus
              value={tag}
              onChange={(e) => setTag(e.target.value as Tag)}
            >
              {tagLabels.map((label, index) => (
                <option key={index} value={label.toUpperCase()}>
                  {capitalizeFirstLetter(label)}
                </option>
              ))}
            </select>
            <IoIosArrowDown className="select-icon" />
          </div>
        </div>
        <InputError errorMessage={errors?.serverErrorMsg} />
        <button className="form-submit-btn" type="submit">
          submit
        </button>
      </form>
    </div>
  )
}
