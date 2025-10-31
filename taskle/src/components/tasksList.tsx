/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import type { Task } from '../types/taskTypes'
import { TableView, KanbanView, NoTasks, NavPanel } from '../components'
export type SortKey = 'priority' | 'tag' | 'status' | 'task'
export default function TasksList({
  tasks,
  setTasks,
}: {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const [tableView, setTableView] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handelDeleteTask = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you wanna delete task?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`http://localhost:3005/api/tasks/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
        console.log('Task deleted successfully')
      } else {
        console.error(data.error)
        throw new Error(data.error || 'Failed to delete task')
      }
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const filteredTasks = tasks
    .filter((task) =>
      task.task.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (task) =>
        statusFilter.length === 0 ||
        statusFilter.includes(task.status.toLowerCase())
    )
    .filter(
      (task) =>
        tagFilter.length === 0 || tagFilter.includes(task.tag.toLowerCase())
    )

  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const priorityOrder: Record<string, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  }

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any = a[sortKey]
    let bValue: any = b[sortKey]

    if (sortKey === 'priority') {
      aValue = priorityOrder[aValue] || 0
      bValue = priorityOrder[bValue] || 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    return 0
  })

  if (tasks.length === 0) {
    return (
      <>
        <NavPanel
          tableView={tableView}
          onChange={setTableView}
          setTasks={setTasks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
        />
        <NoTasks />
      </>
    )
  }

  return (
    <>
      <NavPanel
        tableView={tableView}
        onChange={setTableView}
        setTasks={setTasks}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
      />

      {tableView ? (
        <TableView
          tasks={sortedTasks}
          handleUpdate={handleUpdate}
          handelDeleteTask={handelDeleteTask}
        />
      ) : (
        <KanbanView tasks={filteredTasks} />
      )}
    </>
  )
}
