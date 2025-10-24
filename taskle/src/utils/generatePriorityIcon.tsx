import { FaCircle } from 'react-icons/fa6'
import type { Priority } from '../components/dashboard'

export default function generatePriorityIcon(priority: Priority) {
  let count = 0
  switch (priority) {
    case 'LOW':
      count = 1
      break
    case 'MEDIUM':
      count = 2
      break
    case 'HIGH':
      count = 3
      break
    default:
      count = 0
  }

  return Array.from({ length: count }, (_, i) => <FaCircle key={i} />)
}
