import { useEffect, useState } from 'react'
import { IoMdEyeOff } from 'react-icons/io'
import { IoEye } from 'react-icons/io5'
import '../styles/inputField.css'

interface InputProps {
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  errorMessage?: string
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}: InputProps) {
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
          />
          <label htmlFor={placeholder}>{placeholder}</label>

          <button
            type="button"
            className="eye-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEyeOff /> : <IoEye />}
          </button>
        </div>
        {errorMessage && (
          <p className="input-error" role="alert">
            {errorMessage}
          </p>
        )}
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
      />
      <label htmlFor={placeholder}>{placeholder}</label>
      {errorMessage && (
        <p className="input-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
