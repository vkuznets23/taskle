import { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import '../../styles/searchBar.css'

export default function SearchInput({
  alwaysOpen,
  query,
  onChange,
  placeholder = 'Search tasks...',
}: {
  alwaysOpen: boolean
  query: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [showFull, setShowFull] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (alwaysOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowFull(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [alwaysOpen])

  if (alwaysOpen) {
    return (
      <div className="seacrh-container open">
        <button
          className="search-btn"
          onClick={() => setShowFull((v) => !v)}
          aria-label="Toggle search"
        >
          <IoSearch />
        </button>
        <input
          className="search-input"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className={`seacrh-container ${showFull ? 'open' : ''}`}
    >
      <button
        className="search-btn"
        onClick={() => setShowFull((v) => !v)}
        aria-label="Toggle search"
      >
        <IoSearch />
      </button>
      <input
        className="search-input"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
