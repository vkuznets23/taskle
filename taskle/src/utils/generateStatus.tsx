import type { Status } from '../types/registrationTypes'

const statusLabels: Record<Status, string> = {
  TODO: 'TO DO',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE',
}

export default function generateStatus(status: Status) {
  return <p>{statusLabels[status]}</p>
}
