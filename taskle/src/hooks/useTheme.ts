import { useContext } from 'react'
import ThemeContext from '../context/themeContext'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')

  const { theme, setTheme } = context
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  return { theme, toggleTheme }
}
