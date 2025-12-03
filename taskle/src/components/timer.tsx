import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { GrPowerReset } from 'react-icons/gr'
import { formatTime } from '../utils/formatTime'
import { IoMusicalNotesSharp } from 'react-icons/io5'
import { LuTimer } from 'react-icons/lu'
import { LuTimerOff } from 'react-icons/lu'

const TOTAL_TIME = 45 * 60

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [modalOpen, setModalOpen] = useState(false)
  const [zenMode, setZenMode] = useState(false)

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
  const circumference = 2 * Math.PI * radius
  const rawProgress = 1 - timeLeft / TOTAL_TIME
  const progress = Math.max(0, Math.min(1, rawProgress))

  const bgDasharray = `${circumference}`

  const progressLength = circumference * progress
  const progressDasharray = `${progressLength} ${circumference}`
  const progressDashoffset = 0

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
              width: '260px',
              height: '300px',
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
            {!zenMode ? (
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
                  {/* background circle */}
                  <circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    fill="none"
                    stroke="#f1f1f1"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={bgDasharray}
                    transform={`rotate(-90 ${radius + strokeWidth} ${
                      radius + strokeWidth
                    })`}
                  />
                  {/* progress circle */}
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
                    transform={`rotate(-90 ${radius + strokeWidth} ${
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
            ) : (
              <video
                src="/lofi.mov"
                autoPlay
                loop
                muted
                style={{
                  width: '200px',
                  height: '200px',
                }}
              />
            )}
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#EF89E7',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <IoMusicalNotesSharp style={{ fontSize: '18px' }} />
              </button>
              <button
                onClick={() => {
                  if (isRunning) {
                    setIsRunning(false)
                    endRef.current = null
                  } else if (timeLeft === 0) {
                    setIsRunning(false)
                    endRef.current = null
                    setTimeLeft(TOTAL_TIME)
                    setIsRunning(true)
                  } else {
                    setIsRunning(true)
                  }
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isRunning && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        display: 'block',
                      }}
                    />
                    <span
                      style={{
                        width: 4,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        display: 'block',
                      }}
                    />
                  </div>
                )}
                {timeLeft === 0 && (
                  <GrPowerReset style={{ fontSize: '18px' }} />
                )}
                {!isRunning && timeLeft !== 0 && (
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
              <button
                onClick={() => setZenMode(!zenMode)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#66DC7E',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {!zenMode ? (
                  <LuTimerOff style={{ fontSize: '18px' }} />
                ) : (
                  <LuTimer style={{ fontSize: '18px' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
