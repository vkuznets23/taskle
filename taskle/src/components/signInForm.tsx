import { useCallback, useEffect, useRef, useState } from 'react'
import InputField from './inputField'
import { type Error } from '../components/registrationForm'
import { useAuth } from '../hooks/useAuth'
import { SignInFormValidation } from '../utils/Formvalidation'
import InputError from './inputError'
import SubmitButton from './submitButton'

export default function SignInform() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<Error>({})
  const [submit, setSubmitting] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const { refreshUser } = useAuth()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const focusFirstError = useCallback(() => {
    if (error.emailMessage && emailRef.current) {
      emailRef.current.focus()
    } else if (error.passwordMessage && passwordRef.current) {
      passwordRef.current.focus()
    } else if (error.others && emailRef.current) {
      emailRef.current.focus()
    }
  }, [error, emailRef, passwordRef])

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

    const newError = SignInFormValidation(email, password)

    if (Object.keys(newError).length > 0) {
      setError(newError)
      setSubmitting(false)
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
    } finally {
      setSubmitting(false)
    }
  }

  const { emailMessage, passwordMessage, others } = error
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
      <InputError errorMessage={others} />
      <SubmitButton submit={submit} text1="Logging in..." text2="Log in" />
    </form>
  )
}
