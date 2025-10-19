import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Logo from './logoIcon'
import { MdWbSunny } from 'react-icons/md'
import { IoMoon } from 'react-icons/io5'

export default function Navbar() {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const style = {
    display: 'flex',
    justifyContent: 'space-between',
  }

  return (
    <div style={style}>
      <Logo width={90} height={30} />
      <div>
        <button onClick={toggleTheme}>
          {theme === 'light' ? <MdWbSunny /> : <IoMoon />}
        </button>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  )
}
