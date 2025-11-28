import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(1 * 60)
  const [modalOpen, setModalOpen] = useState(false)

  const endRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return

    if (!endRef.current) {
      endRef.current = Date.now() + time * 1000
    }

    let animationId: number

    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((endRef.current! - Date.now()) / 1000)
      )

      setTime(diff)

      if (diff === 0) {
        endRef.current = null
        setIsRunning(false)
        return
      }

      animationId = requestAnimationFrame(tick)
    }

    tick()

    return () => cancelAnimationFrame(animationId)
  }, [isRunning, time])

  return (
    <>
      <button onClick={() => setModalOpen(true)}>timer</button>
      {modalOpen && (
        <div className="modal">
          <button
            className="close-btn"
            onClick={() => {
              setModalOpen(false)
              // need to reset timer
              setIsRunning(false)
            }}
          >
            <IoCloseSharp />
          </button>
          <div
            style={{
              backgroundColor: 'white',
              width: '150px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>{formatTime(time)}</p>
            {!isRunning ? (
              <button onClick={() => setIsRunning(!isRunning)}>start</button>
            ) : (
              <button
                onClick={() => {
                  setIsRunning(!isRunning)
                  endRef.current = null
                }}
              >
                pause
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
