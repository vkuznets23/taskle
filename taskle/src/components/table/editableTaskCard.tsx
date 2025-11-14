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
  const mouseStartX = useRef<number | null>(null)
  const mouseStartY = useRef<number | null>(null)
  const isMouseDown = useRef(false)
  const hasMouseMoved = useRef(false)
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

    // Mouse handlers for desktop drag
    const handleMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return

      // Don't start drag if clicking on interactive elements
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('input') ||
        target.closest('.edit-btn')
      ) {
        return
      }

      mouseStartX.current = e.clientX
      mouseStartY.current = e.clientY
      isMouseDown.current = true
      hasMouseMoved.current = false
      e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current || mouseStartX.current === null) return

      const deltaX = e.clientX - mouseStartX.current
      const deltaY = Math.abs(e.clientY - (mouseStartY.current || 0))

      // Only start dragging if mouse moved more than threshold
      if (!hasMouseMoved.current) {
        if (Math.abs(deltaX) < 5 && deltaY < 5) {
          return // Too small movement, don't start dragging
        }
        hasMouseMoved.current = true
        setIsSwiping(true)
      }

      // Only allow horizontal drag (prevent vertical scrolling interference)
      if (deltaY > 10 && Math.abs(deltaX) < 10) {
        return
      }

      // Only allow dragging left (negative deltaX)
      if (deltaX < 0) {
        const newOffset = Math.max(-DELETE_BUTTON_WIDTH, deltaX)
        setSwipeOffset(newOffset)
      } else if (deltaX > 0) {
        setSwipeOffset((prevOffset) => {
          if (prevOffset < 0) {
            // Allow dragging back to close
            return Math.min(0, prevOffset + deltaX)
          }
          return prevOffset
        })
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isMouseDown.current || mouseStartX.current === null) {
        setIsSwiping(false)
        return
      }

      const finalDeltaX = e.clientX - mouseStartX.current
      const wasDragging = hasMouseMoved.current

      isMouseDown.current = false
      hasMouseMoved.current = false

      // Only process drag if mouse actually moved
      if (wasDragging) {
        // If dragged more than threshold, keep it open, otherwise snap back
        if (finalDeltaX < -SWIPE_THRESHOLD) {
          setSwipeOffset(-DELETE_BUTTON_WIDTH)
        } else {
          setSwipeOffset(0)
        }
        setIsSwiping(false)
      } else {
        // Just a click, not a drag
        setIsSwiping(false)
      }

      mouseStartX.current = null
      mouseStartY.current = null
    }

    const handleMouseLeave = () => {
      if (isMouseDown.current) {
        // If mouse leaves while dragging, snap back
        isMouseDown.current = false
        setIsSwiping(false)
        setSwipeOffset(0)
        mouseStartX.current = null
        mouseStartY.current = null
      }
    }

    cardElement.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    })
    cardElement.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    })
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: true })

    cardElement.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    cardElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cardElement.removeEventListener('touchstart', handleTouchStart)
      cardElement.removeEventListener('touchmove', handleTouchMove)
      cardElement.removeEventListener('touchend', handleTouchEnd)
      cardElement.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      cardElement.removeEventListener('mouseleave', handleMouseLeave)
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
          alwaysShowEdit={true}
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
