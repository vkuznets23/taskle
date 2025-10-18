import type { User } from '../context/authContext'
import { useAuth } from '../hooks/useAuth'

interface DashboardProps {
  user: User
}
export function Dashboard({ user }: DashboardProps) {
  const { logout } = useAuth()

  return (
    <div>
      <p>{user.id}</p>
      <p>{user.email}</p>
      <button onClick={logout}>logout</button>
    </div>
  )
}
