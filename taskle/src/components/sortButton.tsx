import React from 'react'

interface MultiFilterProps {
  title: string
  options: string[]
  selected: string[]
  onChange: (newValues: string[]) => void
}

export const MultiFilter: React.FC<MultiFilterProps> = ({
  title,
  options,
  selected,
  onChange,
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div>
      <strong>{title}:</strong>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}
