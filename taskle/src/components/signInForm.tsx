import { useState } from 'react'
import InputField from './inputField'
import { SignInFormValidation } from '../utils/Formvalidation'
import { type Error } from '../components/registrationForm'
import { useAuth } from '../hooks/useAuth'

export default function SignInform() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<Error>({})
  const { refreshUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newError = SignInFormValidation(email, password)

    if (Object.keys(newError).length > 0) {
      setError(newError)
      return
    }

    try {
      const res = await fetch('http://localhost:3005/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        setEmail('')
        setPassword('')
        setError({})
        await refreshUser()
      } else {
        // server errors
        if (data.error && data.error.includes('Invalid email or password'))
          setError({ others: 'Invalid email or password.' })
        else setError({ others: data.error || 'Unable to login user.' })
      }
    } catch (err) {
      console.error(err)
      setError({ others: 'Network error. Please try again.' })
    }
  }

  const { emailMessage, passwordMessage } = error

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="email"
        placeholder="email"
        value={email}
        onChange={setEmail}
        errorMessage={emailMessage}
      />
      <InputField
        type="password"
        placeholder="password"
        value={password}
        onChange={setPassword}
        errorMessage={passwordMessage}
      />
      {error.others && <p>{error.others}</p>}

      <button className="form-submit-btn" type="submit">
        Log in
      </button>
    </form>
  )
}
