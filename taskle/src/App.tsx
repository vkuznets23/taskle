import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegistrationToggle from './components/registrationToggle'

function PersonalData() {
  return <h1>PersonalData</h1>
}

function Home() {
  return <RegistrationToggle />
}

function App() {
  return (
    <main>
      <BrowserRouter>
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
