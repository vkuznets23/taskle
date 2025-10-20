import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegistrationToggle from './components/registrationToggle'
import { useAuth } from './hooks/useAuth'
import { Dashboard } from './components/dashboard'
import Loader from './components/loader'

function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  return user ? <Dashboard /> : <RegistrationToggle />
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
