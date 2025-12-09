import { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { GrPowerReset } from 'react-icons/gr'
import { formatTime } from '../utils/formatTime'
import { IoMusicalNotesSharp } from 'react-icons/io5'
import { LuTimer } from 'react-icons/lu'
import { LuTimerOff } from 'react-icons/lu'
import { MdTimer } from 'react-icons/md'
import '../styles/timer.css'

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

  const closePopup = () => {
    if (confirm('Are you sure you want to close?')) {
      setModalOpen(false)
      setZenMode(false)
      reset()
    }
  }

  const clickTimer = () => {
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
      <button className="timer-open" onClick={() => setModalOpen(true)}>
        <MdTimer className="timer-open__icon" />
      </button>
      {modalOpen && (
        <div className="modal">
          <button className="close-btn" onClick={closePopup}>
            <IoCloseSharp />
          </button>
          <div className="timer-card">
            {!zenMode ? (
              <div className="timer-ring">
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
                <div className="timer-center">
                  <span className="timer-label">Focus session</span>
                  <span className="timer-time">{formatTime(timeLeft)}</span>
                </div>
              </div>
            ) : (
              <video
                src="/lofi.mov"
                autoPlay
                loop
                muted
                className="timer-video"
              />
            )}
            <div className="timer-controls">
              <button className="timer-btn timer-btn--music" type="button">
                <IoMusicalNotesSharp className="timer-btn__icon" />
              </button>
              <button
                type="button"
                onClick={clickTimer}
                className="timer-btn timer-btn--primary"
              >
                {isRunning && (
                  <div className="timer-pause">
                    <span className="timer-pause__bar" />
                    <span className="timer-pause__bar" />
                  </div>
                )}
                {timeLeft === 0 && <GrPowerReset className="timer-btn__icon" />}
                {!isRunning && timeLeft !== 0 && (
                  <span className="timer-play" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setZenMode(!zenMode)}
                className="timer-btn timer-btn--zen"
              >
                {!zenMode ? (
                  <LuTimerOff className="timer-btn__icon" />
                ) : (
                  <LuTimer className="timer-btn__icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
