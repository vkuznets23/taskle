import { useState, useRef, useEffect } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import type { Priority, Status, Tag, Task } from '../../types/taskTypes'
import EditableTask from './editableTask'
import EditableTagCell from './editableTagCell'
import EditableStatus from './editableStatus'
import generatePriorityIcon from '../../utils/generatePriorityIcon'

interface EditableTaskCardProps {
  id: number
  task: string
  priority: Priority
  status: Status
  tag: Tag
  editing: {
    id: number
    field: keyof Task | null
  } | null
  setEditing: (
    value: React.SetStateAction<{
      id: number
      field: keyof Task | null
    } | null>
  ) => void
  hoveredId: number | null
  setHoveredId: (value: React.SetStateAction<number | null>) => void
  handleFieldChange: (id: number, field: keyof Task, value: string) => void
  onDelete: (id: number) => void
}

export default function EditableTaskCard({
  id,
  task,
  priority,
  tag,
  status,
  editing,
  setEditing,
  hoveredId,
  setHoveredId,
  handleFieldChange,
  onDelete,
}: EditableTaskCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const SWIPE_THRESHOLD = 80
  const DELETE_BUTTON_WIDTH = 80

  // Add touch handlers directly to DOM element with passive: false
  useEffect(() => {
    const cardElement = cardRef.current
    if (!cardElement) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
      setIsSwiping(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = Math.abs(touch.clientY - touchStartY.current)

      // Only allow horizontal swipe (prevent vertical scrolling interference)
      if (deltaY > 15 && Math.abs(deltaX) < 15) {
        return
      }

      // Prevent default scrolling when swiping horizontally
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault()
      }

      // Only allow swiping left (negative deltaX)
      if (deltaX < 0) {
        const newOffset = Math.max(-DELETE_BUTTON_WIDTH, deltaX)
        setSwipeOffset(newOffset)
      } else if (deltaX > 0) {
        setSwipeOffset((prevOffset) => {
          if (prevOffset < 0) {
            // Allow swiping back to close
            return Math.min(0, prevOffset + deltaX)
          }
          return prevOffset
        })
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) {
        setIsSwiping(false)
        return
      }

      const touch = e.changedTouches[0]
      const finalDeltaX = touch.clientX - touchStartX.current

      setIsSwiping(false)

      // If swiped more than threshold, keep it open, otherwise snap back
      if (finalDeltaX < -SWIPE_THRESHOLD) {
        setSwipeOffset(-DELETE_BUTTON_WIDTH)
      } else {
        setSwipeOffset(0)
      }

      touchStartX.current = null
      touchStartY.current = null
    }

    cardElement.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    })
    cardElement.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    })
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      cardElement.removeEventListener('touchstart', handleTouchStart)
      cardElement.removeEventListener('touchmove', handleTouchMove)
      cardElement.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const handleDelete = () => {
    onDelete(id)
    setSwipeOffset(0)
  }

  // Close swipe when clicking outside or on another card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (cardRef.current && !cardRef.current.contains(target)) {
        // Check if click is not on delete button
        const deleteBtn = (event.target as HTMLElement)?.closest(
          '.swipeable-delete-btn'
        )
        if (!deleteBtn) {
          setSwipeOffset(0)
        }
      }
    }

    if (swipeOffset < 0) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
      }
    }
  }, [swipeOffset])

  return (
    <div className="task-card-wrapper">
      <div
        ref={cardRef}
        className="task-card swipeable-card"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onMouseEnter={() => setHoveredId(id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <EditableTask
          id={id}
          task={task}
          editing={editing}
          setEditing={setEditing}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          handleFieldChange={handleFieldChange}
        />
        <div className="task-card-actions">
          <EditableStatus
            id={id}
            status={status}
            editing={editing}
            setEditing={setEditing}
            handleFieldChange={handleFieldChange}
          />
          <EditableTagCell
            as="div"
            id={id}
            tag={tag}
            editing={editing}
            setEditing={setEditing}
            handleFieldChange={handleFieldChange}
          />
          <div className="priority-selector" title="Click to change priority">
            {generatePriorityIcon(priority)}
          </div>
        </div>
      </div>
      <button
        className="swipeable-delete-btn"
        onClick={handleDelete}
        style={{
          opacity:
            swipeOffset < 0
              ? Math.min(1, Math.abs(swipeOffset) / SWIPE_THRESHOLD)
              : 0,
          transform: `translateX(${DELETE_BUTTON_WIDTH + swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'all 0.3s ease-out',
        }}
      >
        <div className="swipeable-delete-btn-content">
          <RiDeleteBin5Line /> <span>Delete</span>
        </div>
      </button>
    </div>
  )
}
