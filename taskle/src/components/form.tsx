import { priorityLabels, tagLabels } from '../constants'
import type { Priority, Tag } from '../types/taskTypes'
import { capitalizeFirstLetter } from '../utils/Capitalizer'
import type { Errors } from './dashboard'

interface FormTasksProps {
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>
  task: string
  setTask: (task: string) => void
  priority: Priority
  setPriority: (priority: Priority) => void
  tag: Tag
  setTag: (tag: Tag) => void
  errors: Partial<Errors>
}

export default function FormTasks({
  handleSubmit,
  task,
  setTask,
  priority,
  setPriority,
  tag,
  setTag,
  errors,
}: FormTasksProps) {
  return (
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
  )
}
