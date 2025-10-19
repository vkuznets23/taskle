export interface Error {
  emailMessage?: string
  passwordMessage?: string
  confirmPasswordMessage?: string
  others?: string
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Tag = 'WORK' | 'STUDYING' | 'PERSONAL'
export type Status = 'DONE' | 'IN_PROGRESS' | 'TODO'

export interface Task {
  id: number
  task: string
  priority: Priority
  tag: Tag
  status: Status
}

export interface User {
  id: number
  email: string
  createdAt: string
  tasks: Task[]
}
