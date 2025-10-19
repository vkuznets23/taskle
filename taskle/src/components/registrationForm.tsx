import { useState } from 'react'
import { RegistrationFormValidation } from '../utils/Formvalidation'
import InputField from './inputField'
import InputError from './inputError'

export interface Error {
  emailMessage?: string
  passwordMessage?: string
  confirmPasswordMessage?: string
  others?: string
}

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [submit, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)

    const newError = RegistrationFormValidation(
      email,
      password,
      confirmPassword
    )

    // If there are any errors, show them all and return
    if (Object.keys(newError).length > 0) {
      setError(newError)
      setSubmitting(false)
      return
    }

    // Clear errors if validation passes
    setError({})

    try {
      const res = await fetch('http://localhost:3005/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        console.log(data)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setError({})
        setSubmitting(false)
      } else {
        if (data.error && data.error.includes('already exists'))
          setError({ others: 'User with this email already exists' })
        else setError({ others: data.error || 'Registration failed' })
      }
    } catch (err) {
      console.error(err)
      setError({ others: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const { emailMessage, passwordMessage, confirmPasswordMessage, others } =
    error

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
      <InputField
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        errorMessage={confirmPasswordMessage}
      />
      <InputError errorMessage={others} />

      <button className="form-submit-btn" type="submit">
        {submit ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}
