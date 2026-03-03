import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegistrationToggle from './components/registrationToggle'
import { useAuth } from './hooks/useAuth'
import { Dashboard } from './components/dashboard'

function Home() {
  const { user, loading } = useAuth()

  if (user) return <Dashboard />
  if (loading) return <RegistrationToggle />
  return <RegistrationToggle />
}

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
