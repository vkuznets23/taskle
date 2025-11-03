import React, { useState, useRef, useEffect } from 'react'
import '../../styles/MultiFilter.css'

interface MultiFilterDropdownProps {
  title: string
  options: string[]
  selected: string[]
  onChange: (newValues: string[]) => void
}

export const MultiFilter: React.FC<MultiFilterDropdownProps> = ({
  title,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div ref={ref} className="multi-filter">
      <button
        className="multi-filter__button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className={`arrow ${open ? 'open' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="multi-filter__menu">
          {options.map((option) => (
            <label key={option} className="multi-filter__option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
