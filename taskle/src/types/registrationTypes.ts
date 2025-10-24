import type { Task } from './taskTypes'

export interface Error {
  emailMessage?: string
  passwordMessage?: string
  confirmPasswordMessage?: string
  others?: string
}

export interface User {
  id: number
  email: string
  createdAt: string
  tasks: Task[]
}
