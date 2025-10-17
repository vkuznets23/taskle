import { useState } from 'react'

interface Error {
  emailMessage?: string
  passwordMessage?: string
  confirmPasswordMessage?: string
}

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<Error>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newError: Error = {}

    // Validate email
    if (!email || email.trim() === '') {
      newError.emailMessage = 'Email is required'
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email)) {
        newError.emailMessage = 'Invalid email address'
      }
    }

    // Validate password
    if (!password || password.trim() === '') {
      newError.passwordMessage = 'Password is required'
    } else {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/
      if (!passwordRegex.test(password)) {
        newError.passwordMessage =
          'Password must be 8-32 characters with at least one letter, one number, and one special character'
      }
    }

    // Validate confirm password
    if (!confirmPassword || confirmPassword.trim() === '') {
      newError.confirmPasswordMessage = 'Confirm password is required'
    } else if (password !== confirmPassword) {
      newError.confirmPasswordMessage = 'Passwords do not match'
    }

    // If there are any errors, show them all and return
    if (Object.keys(newError).length > 0) {
      setError(newError)
      return
    }

    // Clear errors if validation passes
    setError({})

    try {
      const res = await fetch('http://localhost:3005/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        // Success
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setError({})
      } else {
        // Server error
        if (data.error && data.error.includes('already exists')) {
          setError({ emailMessage: 'User with this email already exists' })
        } else {
          setError({ emailMessage: data.error || 'Registration failed' })
        }
      }
    } catch (err) {
      console.error(err)
      setError({ emailMessage: 'Network error. Please try again.' })
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error.emailMessage && <p>{error.emailMessage}</p>}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error.passwordMessage && <p>{error.passwordMessage}</p>}
      <input
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error.confirmPasswordMessage && <p>{error.confirmPasswordMessage}</p>}
      <button type="submit">Register</button>
    </form>
  )
}
