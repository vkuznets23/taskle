export const emptyInputValidation = (
  email: string,
  password: string,
): boolean => {
  if (!email || email.trim() === '') {
    return false
  }

  if (!password || password.trim() === '') {
    return false
  }

  return true
}

export const inputValidation = (
  email: string,
  password: string,
): string | null => {
  if (!emptyInputValidation(email, password)) {
    return 'Email and password are required.'
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return 'Invalid email address.'
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/
  if (!passwordRegex.test(password)) {
    return 'Password must be 8-32 chars, include letter, number and special char.'
  }

  return null
}
