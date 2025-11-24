import React, { useState, useRef, useEffect } from 'react'
import '../../styles/multiFilter.css'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

interface MultiFilterDropdownProps {
  isMobile: boolean
  icon: React.ReactNode
  title: string
  options: string[]
  selected: string[]
  onChange: (newValues: string[]) => void
}

export const MultiFilter: React.FC<MultiFilterDropdownProps> = ({
  isMobile,
  icon,
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
        {isMobile ? icon : <span>{title}</span>}
        <span
          className={`arrow ${open ? 'open' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
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
