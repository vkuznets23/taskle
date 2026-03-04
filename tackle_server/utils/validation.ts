export const emptyInputValidation = (
  email: string,
  password: string,
): boolean => {
  if (!email || email.trim() === '') {
    return false
  }

  if (!password || password.trim() === '') {
    return false
  }

  return true
}

export const inputValidation = (
  email: string,
  password: string,
): string | null => {
  if (!emptyInputValidation(email, password)) {
    return 'Email and password are required.'
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return 'Invalid email address.'
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/
  if (!passwordRegex.test(password)) {
    return 'Password must be 8-32 chars, include letter, number and special char.'
  }

  return null
}

export const taskValidation = (task: any): string | null => {
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return 'Task is required and must be a non-empty string'
  }

  if (task.length > 150) {
    return 'The task text must be under 150 characters.'
  }

  return null
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum Tag {
  NONE = 'NONE',
  WORK = 'WORK',
  STUDYING = 'STUDYING',
  PERSONAL = 'PERSONAL',
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

const validPriorities = Object.values(Priority)
const validTags = Object.values(Tag)
const validStatuses = Object.values(Status)

export const validateAll = (priority: any, tag: any, status: any) => {
  const validatedPriority: Priority = validPriorities.includes(priority)
    ? priority
    : Priority.LOW

  const validatedTag: Tag = validTags.includes(tag) ? tag : Tag.NONE

  const validatedStatus: Status = validStatuses.includes(status)
    ? status
    : Status.TODO
  return {
    priority: validatedPriority,
    tag: validatedTag,
    status: validatedStatus,
  }
}
