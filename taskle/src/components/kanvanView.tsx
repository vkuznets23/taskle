import type { Task } from '../types/taskTypes'
import '../styles/kanban.css'
import generatePriorityIcon from '../utils/generatePriorityIcon'
import generateTagIcon from '../utils/generateTagIcon'
// import { useEffect, useState } from 'react'

// type TaskCount = {
//   status: string
//   _count: { id: number }
// }

export default function KanbanView({ tasks }: { tasks: Task[] }) {
  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE']
  //   const [counts, setCounts] = useState<Record<string, number>>({})

  //   useEffect(() => {
  //     const handleCount = async () => {
  //       try {
  //         const res = await fetch('http://localhost:3005/api/tasks/tasks/count', {
  //           credentials: 'include',
  //         })
  //         const data: TaskCount[] = await res.json()
  //         const formatted: Record<string, number> = {}
  //         data.forEach((item) => {
  //           formatted[item.status.toUpperCase()] = item._count.id
  //         })
  //         console.log(formatted)
  //         setCounts(formatted)
  //       } catch (err) {
  //         console.error('Failed to fetch counts', err)
  //       }
  //     }

  //     handleCount()
  //   }, [])
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
