import { useState } from 'react'

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

  if (type === 'password')
    return (
      <div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button onClick={() => setShowPassword(!showPassword)}>
          show password
        </button>
      </div>
    )
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}
