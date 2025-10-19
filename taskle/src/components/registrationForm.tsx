import { useCallback, useEffect, useRef, useState } from 'react'
import { RegistrationFormValidation } from '../utils/Formvalidation'
import { type Error } from '../types/registrationTypes'
import InputField from './inputField'
import InputError from './inputError'
import SubmitButton from './submitButton'

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [submit, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>({})
  const [isShaking, setIsShaking] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const focusFirstError = useCallback(() => {
    if (error.emailMessage && emailRef.current) {
      emailRef.current.focus()
    } else if (error.passwordMessage && passwordRef.current) {
      passwordRef.current.focus()
    } else if (error.others && emailRef.current) {
      emailRef.current.focus()
    } else if (error.confirmPasswordMessage && confirmPasswordRef.current) {
      confirmPasswordRef.current.focus()
    }
  }, [error, emailRef, passwordRef, confirmPasswordRef])

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)

      setTimeout(() => focusFirstError(), 100)
    }
  }, [error, focusFirstError])

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
  const containerClass = `${others ? 'has-error' : ''} ${
    isShaking ? 'form-shake' : ''
  }`

  return (
    <form onSubmit={handleSubmit} className={containerClass}>
      <InputField
        ref={emailRef}
        type="email"
        placeholder="email"
        value={email}
        onChange={setEmail}
        errorMessage={emailMessage}
      />
      <InputField
        ref={passwordRef}
        type="password"
        placeholder="password"
        value={password}
        onChange={setPassword}
        errorMessage={passwordMessage}
      />
      <InputField
        ref={confirmPasswordRef}
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        errorMessage={confirmPasswordMessage}
      />
      <InputError errorMessage={others} />
      <SubmitButton submit={submit} text1="Registering..." text2="Register" />
    </form>
  )
}
