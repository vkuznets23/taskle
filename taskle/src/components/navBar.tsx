import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Logo from './logoIcon'
import { MdWbSunny } from 'react-icons/md'
import { IoMoon, IoLogInOutline } from 'react-icons/io5'
import '../styles/navbar.css'

export default function Navbar() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="navbar">
      <Logo width={100} height={40} />
      <div className="buttons-container">
        <button
          onClick={toggleTheme}
          title="Set theme manually"
          className="theme-button"
        >
          {theme === 'light' ? <MdWbSunny /> : <IoMoon />}
        </button>
        <button onClick={logout} className="logout-button">
          logout <IoLogInOutline />
        </button>
      </div>
    </div>
  )
}
