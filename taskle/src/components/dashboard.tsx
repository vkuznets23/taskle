import type { User } from '../types/registrationTypes'
import Navbar from './navBar'

interface DashboardProps {
  user: User
}
export function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <Navbar />
      <p>{user.id}</p>
      <p>{user.email}</p>
    </div>
  )
}
