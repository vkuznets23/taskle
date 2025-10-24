export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type Tag = 'NONE' | 'WORK' | 'PERSONAL' | 'STUDYING'
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  task: string
  priority: Priority
  tag: Tag
  status: Status
}
