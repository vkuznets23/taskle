// import React from 'react'

// interface MultiFilterProps {
//   title: string
//   options: string[]
//   selected: string[]
//   onChange: (newValues: string[]) => void
// }

// export const MultiFilter: React.FC<MultiFilterProps> = ({
//   title,
//   options,
//   selected,
//   onChange,
// }) => {
//   const toggleOption = (option: string) => {
//     if (selected.includes(option)) {
//       onChange(selected.filter((o) => o !== option))
//     } else {
//       onChange([...selected, option])
//     }
//   }

//   return (
//     <div>
//       <strong>{title}:</strong>
//       <div>
//         {options.map((option) => (
//           <label key={option}>
//             <input
//               type="checkbox"
//               checked={selected.includes(option)}
//               onChange={() => toggleOption(option)}
//             />
//             {option}
//           </label>
//         ))}
//       </div>
//     </div>
//   )
// }

import React, { useState, useRef, useEffect } from 'react'

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

  // Закрытие по клику вне dropdown
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
    <div ref={ref} className="relative inline-block text-left">
      {/* Кнопка открытия */}
      <button onClick={() => setOpen((prev) => !prev)}>
        <span>{title}</span>
        <span>▼</span>
      </button>

      {/* Выпадающее меню */}
      {open && (
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
      )}
    </div>
  )
}
