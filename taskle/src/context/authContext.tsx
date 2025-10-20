import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../types/registrationTypes'

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3005/api/users/me', {
        method: 'GET',
        credentials: 'include', // important to send cookies
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else setUser(null)
    } catch (err) {
      console.log(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        console.error('Logout failed:', await res.text())
        return
      }
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
