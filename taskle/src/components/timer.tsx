import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { formatTime } from '../utils/formatTime'

const TOTAL_TIME = 60

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [modalOpen, setModalOpen] = useState(false)

  const endRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return

    if (!endRef.current) {
      endRef.current = Date.now() + timeLeft * 1000
    }

    let animationId: number

    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((endRef.current! - Date.now()) / 1000)
      )

      setTimeLeft(diff)

      if (diff === 0) {
        endRef.current = null
        setIsRunning(false)
        return
      }

      animationId = requestAnimationFrame(tick)
    }

    tick()

    return () => cancelAnimationFrame(animationId)
  }, [isRunning, timeLeft])

  const reset = () => {
    setTimeLeft(TOTAL_TIME)
    setIsRunning(false)
    endRef.current = null
  }

  const radius = 80
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius // длинна окружности
  const progress = 1 - timeLeft / TOTAL_TIME // процент который прошел от времени

  // since its not a circle but half circle
  const arcLength = circumference * 0.8
  const gapLength = circumference - arcLength

  const baseOffset = gapLength / 2 // move start
  const bgDasharray = `${arcLength} ${gapLength}`
  const progressDasharray = `${circumference}` // весь круг
  const progressDashoffset = baseOffset + arcLength * (1 - progress)

  return (
    <>
      <button onClick={() => setModalOpen(true)}>timer</button>
      {modalOpen && (
        <div className="modal">
          <button
            className="close-btn"
            onClick={() => {
              setModalOpen(false)
              reset()
            }}
          >
            <IoCloseSharp />
          </button>
          <div
            style={{
              backgroundColor: 'white',
              width: '320px',
              height: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              borderRadius: '24px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              padding: '20px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 2 * (radius + strokeWidth),
                height: 2 * (radius + strokeWidth),
              }}
            >
              <svg
                width={2 * (radius + strokeWidth)}
                height={2 * (radius + strokeWidth)}
              >
                {/* background arc */}
                <circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  fill="none"
                  stroke="#f1f1f1"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={bgDasharray}
                  strokeDashoffset={baseOffset}
                  transform={`rotate(160 ${radius + strokeWidth} ${
                    radius + strokeWidth
                  })`}
                />
                {/* progress arc */}
                <circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={progressDasharray}
                  strokeDashoffset={progressDashoffset}
                  transform={`rotate(110 ${radius + strokeWidth} ${
                    radius + strokeWidth
                  })`}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '6px',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  Focus session
                </span>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: '24px',
                    fontWeight: 600,
                  }}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (isRunning) {
                  setIsRunning(false)
                  endRef.current = null
                } else {
                  setIsRunning(true)
                }
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: '999px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(79,70,229,0.45)',
              }}
            >
              {isRunning ? (
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 18,
                      borderRadius: 3,
                      backgroundColor: 'white',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      width: 6,
                      height: 18,
                      borderRadius: 3,
                      backgroundColor: 'white',
                      display: 'block',
                    }}
                  />
                </div>
              ) : (
                <span
                  style={{
                    marginLeft: 3,
                    width: 0,
                    height: 0,
                    borderTop: '9px solid transparent',
                    borderBottom: '9px solid transparent',
                    borderLeft: '14px solid white',
                    display: 'block',
                  }}
                />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
