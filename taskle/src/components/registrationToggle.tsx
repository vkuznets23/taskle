import { useState } from 'react'
import RegistrationForm from './registrationForm'
import SignInform from './signInForm'

export default function RegistrationToggle() {
  const [isSignUp, setIsSignUp] = useState(true)
  return (
    <div>
      <button onClick={() => setIsSignUp(true)}>Sign Up</button>
      <button onClick={() => setIsSignUp(false)}>Sign In</button>
      {isSignUp && <RegistrationForm />}
      {!isSignUp && <SignInform />}
    </div>
  )
}
