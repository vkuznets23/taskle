import {
  ConfirmPasswordValidation,
  EmailValidation,
  PasswordValidation,
  RegistrationFormValidation,
  SignInFormValidation,
} from '../utils/Formvalidation'
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
        PasswordValidation(password, newError, false)
        expect(newError.passwordMessage).toBeUndefined()
      }
    )
  })

  describe('pasword confirmation tests', () => {
    const requiredMsg = 'Confirm password is required'
    const mismatchMsg = 'Passwords do not match'

    it('password confirmation test passes', () => {
      ConfirmPasswordValidation('password1234!', 'password1234!', newError)
      expect(newError.confirmPasswordMessage).toBeUndefined()
    })
    describe('fails when confirmation is missing', () => {
      test.each(['', '   '])('input "%s"', (input) => {
        ConfirmPasswordValidation(input, input, newError)
        expect(newError.confirmPasswordMessage).toBe(requiredMsg)
      })
    })
    it('passwords do not match', () => {
      ConfirmPasswordValidation('password1234!', 'password12345!', newError)
      expect(newError.confirmPasswordMessage).toBe(mismatchMsg)
    })
  })
})

describe('whole registration form validation', () => {
  beforeEach(() => {
    newError = {}
  })

  it('passing test', () => {
    const validEmail = 'test@test.com'
    const validPassword = 'asd!1234'
    RegistrationFormValidation(validEmail, validPassword, validPassword)
    expect(newError.emailMessage).toBeUndefined()
    expect(newError.passwordMessage).toBeUndefined()
    expect(newError.confirmPasswordMessage).toBeUndefined()
  })

  describe('non passing tests', () => {
    const validEmail = 'test@test.com'
    const validPassword = 'asd!1234'

    const requiredEmailMsg = 'Email is required'
    const requiredPasswordMsg = 'Password is required'
    const requiredConfirmPasswordMsg = 'Confirm password is required'

    const mismatchMsg = 'Passwords do not match'
    const invalidEmailMsg = 'Invalid email address'
    const invalidPasswordMsg =
      'Password must be 8-32 characters with at least one letter, one number, and one special character'

    it('not matching passwords', () => {
      const result = RegistrationFormValidation(
        validEmail,
        validPassword,
        'hello'
      )
      expect(result.emailMessage).toBeUndefined()
      expect(result.passwordMessage).toBeUndefined()
      expect(result.confirmPasswordMessage).toBe(mismatchMsg)
    })

    it('required passwords and email', () => {
      const result = RegistrationFormValidation('', '', '')
      expect(result.emailMessage).toBe(requiredEmailMsg)
      expect(result.passwordMessage).toBe(requiredPasswordMsg)
      expect(result.confirmPasswordMessage).toBe(requiredConfirmPasswordMsg)
    })

    it('invalid email', () => {
      const result = RegistrationFormValidation(
        'invalid email',
        validPassword,
        validPassword
      )
      expect(result.emailMessage).toBe(invalidEmailMsg)
      expect(result.passwordMessage).toBeUndefined()
      expect(result.confirmPasswordMessage).toBeUndefined()
    })

    it('invalid password', () => {
      const result = RegistrationFormValidation(
        validEmail,
        'invalid password',
        validPassword
      )
      expect(result.emailMessage).toBeUndefined()
      expect(result.passwordMessage).toBe(invalidPasswordMsg)
      expect(result.confirmPasswordMessage).toBe(mismatchMsg)
    })

    it('invalid password', () => {
      const result = RegistrationFormValidation(
        validEmail,
        'invalid password',
        'invalid password'
      )
      expect(result.emailMessage).toBeUndefined()
      expect(result.passwordMessage).toBe(invalidPasswordMsg)
      expect(result.confirmPasswordMessage).toBeUndefined()
    })
  })
})

describe('whole sign in form validation', () => {
  beforeEach(() => {
    newError = {}
  })

  it('passing test', () => {
    const validEmail = 'test@test.com'
    const validPassword = 'asd!1234'
    SignInFormValidation(validEmail, validPassword)
    expect(newError.emailMessage).toBeUndefined()
    expect(newError.passwordMessage).toBeUndefined()
  })

  describe('non passing tests', () => {
    const validEmail = 'test@test.com'
    const validPassword = 'asd!1234'

    const requiredEmailMsg = 'Email is required'
    const requiredPasswordMsg = 'Password is required'

    const invalidEmailMsg = 'Invalid email address'

    it('invalid email', () => {
      const result = SignInFormValidation('invalid email', validPassword)
      expect(result.emailMessage).toBe(invalidEmailMsg)
      expect(result.passwordMessage).toBeUndefined()
    })

    it('no email', () => {
      const result = SignInFormValidation('', validPassword)
      expect(result.emailMessage).toBe(requiredEmailMsg)
      expect(result.passwordMessage).toBeUndefined()
    })

    it('not password', () => {
      const result = SignInFormValidation(validEmail, '')
      expect(result.emailMessage).toBeUndefined()
      expect(result.passwordMessage).toBe(requiredPasswordMsg)
    })
  })
})
