import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

function PersonalData() {
  return <h1>PersonalDatae</h1>
}

function Home() {
  return <h1>Home Page</h1>
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
