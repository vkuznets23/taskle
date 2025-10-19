import { createContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')

    if (storedTheme) {
      setTheme(storedTheme as Theme)
    } else if (darkThemeMq.matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
