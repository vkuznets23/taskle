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
