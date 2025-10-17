import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import RegistrationForm from './components/registrationForm'

function PersonalData() {
  return <h1>PersonalData</h1>
}

function Home() {
  return <RegistrationForm />
}

function App() {
  return (
    <main>
      <BrowserRouter>
        {/* Links */}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/account">Account</Link>
        </nav>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<PersonalData />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
