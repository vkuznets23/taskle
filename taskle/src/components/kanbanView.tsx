import type { Task } from '../types/taskTypes'
import '../styles/kanban.css'
import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'

export default function KanbanView({ tasks }: { tasks: Task[] }) {
  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE']

  const counts = columns.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="kanban">
      {columns.map((col) => (
        <div key={col} className="kanban-column">
          <h3>
            {col.replace('_', ' ')} ({counts[col] || 0})
          </h3>
          <div className="kanban-tasks">
            {tasks
              .filter((task) => task.status === col)
              .map((task) => (
                <div
                  key={task.id}
                  className={`kanban-card ${task.tag.toLowerCase()}`}
                >
                  <p className="kanban-task">{task.task}</p>
                  <div className="kanban-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {generatePriorityIcon(task.priority)}
                    </span>
                    {generateTagIcon(task.tag)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
