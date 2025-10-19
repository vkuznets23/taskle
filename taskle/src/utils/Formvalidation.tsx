import { type Error } from '../components/registrationForm'

export function EmailValidation(email: string, errors: Error) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
  if (!email || !email.trim()) errors.emailMessage = 'Email is required'
  else if (!email.match(emailRegex))
    errors.emailMessage = 'Invalid email address'
}

export function PasswordValidation(
  password: string,
  errors: Error,
  login: boolean
) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/
  if (!password || !password.trim())
    errors.passwordMessage = 'Password is required'
  else if (!login && !password.match(passwordRegex))
    errors.passwordMessage =
      'Password must be 8-32 characters with at least one letter, one number, and one special character'
}

export function ConfirmPasswordValidation(
  password: string,
  confirmPassword: string,
  errors: Error
) {
  if (!confirmPassword || !confirmPassword.trim())
    errors.confirmPasswordMessage = 'Confirm password is required'
  else if (password !== confirmPassword)
    errors.confirmPasswordMessage = 'Passwords do not match'
}

export function RegistrationFormValidation(
  email: string,
  password: string,
  confirmPassword: string
) {
  const newError: Error = {}

  EmailValidation(email, newError)
  PasswordValidation(password, newError, false)
  ConfirmPasswordValidation(password, confirmPassword, newError)

  return newError
}

export function SignInFormValidation(email: string, password: string) {
  const newError: Error = {}

  EmailValidation(email, newError)
  PasswordValidation(password, newError, true)

  return newError
}
