import { useState } from 'react'
import RegistrationForm from './registrationForm'
import SignInform from './signInForm'
import '../styles/registrationForm.css'

export default function RegistrationToggle() {
  const [isSignUp, setIsSignUp] = useState(true)
  return (
    <div className="registration-toggle-container">
      <div className="registration-toggle">
        <div className="buttons-toggle">
          <div
            className="toggle-bg"
            style={{
              transform: isSignUp ? 'translateX(0%)' : 'translateX(100%)',
            }}
          />
          <button
            className={isSignUp ? 'active' : ''}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={!isSignUp ? 'active' : ''}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
        </div>
        {isSignUp && <RegistrationForm />}
        {!isSignUp && <SignInform />}
      </div>
    </div>
  )
}
