export default function InputError({
  errorMessage,
}: {
  errorMessage?: string
}) {
  if (!errorMessage) return null
  return (
    <p className="input-error" role="alert">
      {errorMessage}
    </p>
  )
}
