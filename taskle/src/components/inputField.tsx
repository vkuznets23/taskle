import { forwardRef, useEffect, useState } from 'react'
import { IoMdEyeOff } from 'react-icons/io'
import { IoEye } from 'react-icons/io5'
import '../styles/inputField.css'
import InputError from './inputError'

interface InputProps {
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  errorMessage?: string
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, value, onChange, errorMessage }: InputProps, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
      if (errorMessage) {
        setShake(true)
        const timeout = setTimeout(() => setShake(false), 300)
        return () => clearTimeout(timeout)
      }
    }, [errorMessage])

    const containerClass = `${
      type === 'password' ? 'password-container' : 'input-container'
    } ${errorMessage ? 'has-error' : ''} ${shake ? 'shake' : ''}`

    if (type === 'password')
      return (
        <>
          <div className={containerClass}>
            <input
              id={placeholder}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="current-password"
              ref={ref}
            />
            <label htmlFor={placeholder}>{placeholder}</label>

            <button
              aria-label="Show password"
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoMdEyeOff /> : <IoEye />}
            </button>
          </div>
          <InputError errorMessage={errorMessage} />
        </>
      )

    return (
      <div className={containerClass}>
        <input
          id={placeholder}
          type={type}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="username"
          ref={ref}
        />
        <label htmlFor={placeholder}>{placeholder}</label>
        <InputError errorMessage={errorMessage} />
      </div>
    )
  }
)

export default InputField
