import { EmailValidation, PasswordValidation } from '../utils/Formvalidation'
import { type Error } from '../components/registrationForm'

let newError: Error

describe('EmailValidation', () => {
  beforeEach(() => {
    newError = {}
  })

  describe('should return an error if empty email', () => {
    it('email is empty', () => {
      const email = ''
      EmailValidation(email, newError)
      expect(newError.emailMessage).toBe('Email is required')
    })

    it('email is spaces', () => {
      const email = '   '
      EmailValidation(email, newError)
      expect(newError.emailMessage).toBe('Email is required')
    })
  })

  describe('should return an error if email is not a valid email', () => {
    const notValidEmails = [
      'test.com',
      'test@com',
      'test!@com',
      'user@exam!ple.com',
      'user @exam!ple.com',
      'user@e',
      'user@e.34',
    ]

    test.each(notValidEmails)('validates %s', (email) => {
      EmailValidation(email, newError)
      expect(newError.emailMessage).toBe('Invalid email address')
    })
  })
  describe('shouldnt return any error for valid email', () => {
    const validEmails = [
      'test@test.com',
      'test23@test.com',
      'john.doe@example.com',
      'john+test@example.com',
      'user@mail.example.com',
      'a@b.co',
      'user.name+tag+sorting@example.com',
      'user@2344.com',
    ]

    test.each(validEmails)('validates %s', (email) => {
      EmailValidation(email, newError)
      expect(newError.emailMessage).toBeUndefined()
    })
  })
})

describe('PasswordValidation', () => {
  beforeEach(() => {
    newError = {}
  })

  describe('should return an error if password email', () => {
    it('password is empty', () => {
      const password = ''
      PasswordValidation(password, newError, true)
      expect(newError.passwordMessage).toBe('Password is required')
    })

    it('password is spaces', () => {
      const password = '   '
      PasswordValidation(password, newError, true)
      expect(newError.passwordMessage).toBe('Password is required')
    })

    it('password is empty', () => {
      const password = ''
      PasswordValidation(password, newError, false)
      expect(newError.passwordMessage).toBe('Password is required')
    })

    it('password is spaces', () => {
      const password = '   '
      PasswordValidation(password, newError, false)
      expect(newError.passwordMessage).toBe('Password is required')
    })
  })

  test('login skips regex check', () => {
    const newError: Error = {}
    PasswordValidation('invalid!', newError, true)
    expect(newError.passwordMessage).toBeUndefined()
  })

  describe('should return an error — password is not valid', () => {
    const notValidPasswords = [
      'abcdefg!@#', // no numbers
      'Password!',
      '23##$12345', // no letters
      '12345678!',
      'abcd1234', // no symbols
      'Password1',
      'abcd12!', // 7 chars
      'A1!' + 'a'.repeat(30), // 33 chars
      ' A1!bcdef  ', // 8 chars but spaces
    ]

    const errorMsg =
      'Password must be 8-32 characters with at least one letter, one number, and one special character'

    test.each(notValidPasswords)('validates %s', (email) => {
      PasswordValidation(email, newError, false)
      expect(newError.passwordMessage).toBe(errorMsg)
    })
  })

  describe('shouldте return an error — password is valid', () => {
    const validPasswords = [
      'asd!1234',
      'Abcd1234!',
      'Passw0rd@2025',
      'Qwerty1!',
      'Complex#123',
      '1!' + 'a'.repeat(30),
    ]

    test.each(validPasswords)(
      'does not return error for valid password %s',
      (password) => {
        const newError: Error = {}
        PasswordValidation(password, newError, false)
        expect(newError.passwordMessage).toBeUndefined()
      }
    )
  })
})
