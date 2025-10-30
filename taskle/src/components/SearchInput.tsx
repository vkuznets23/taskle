export default function SearchInput({
  query,
  onChange,
  placeholder = 'Search tasks...',
}: {
  query: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}
