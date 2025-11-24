import express from 'express'
import bcrypt from 'bcrypt'
import { prismaMock } from '../__mocks__/prisma'
import request from 'supertest'
import router from '../routes/user'

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_pass')),
  compare: jest.fn(),
}))

jest.mock('../generated/prisma/index.js', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}))

const app = express()
app.use(express.json())
app.use('/', router)

describe('POST /register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  test('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/register').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email and password are required.')
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  test('should return 400 if user already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 } as any)
    const res = await request(app)
      .post('/register')
      .send({ email: 'a@a.com', password: 'Aa123456!' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('User already exists.')
  })

  test('should return 400 if email is incorrect', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'not-an-email', password: 'Aa123456!' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid email address.')
  })

  test('should return 400 if password is incorrect', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'unique1@test.com', password: 'short' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid password.')
  })

  test('valid registration', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null) // mock that user is unique
    // create mock user
    prismaMock.user.create.mockResolvedValueOnce({
      id: 1,
      email: 'unique2@test.com',
      password: 'hashed_pass',
    })
    const res = await request(app)
      .post('/register')
      .send({ email: 'unique2@test.com', password: 'Aa123456!' })
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('unique2@test.com')
    expect(prismaMock.user.create).toHaveBeenCalled()
  })
})

describe('POST /login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  test('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/login').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email and password are required.')
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  test('should return 401 if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const res = await request(app)
      .post('/login')
      .send({ email: 'nonexistent@test.com', password: 'Aa123456!' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid email or password.')
  })

  test('should return 401 if password does not match', async () => {
    // mock existing user
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: 'unique1@test.com',
      password: 'hashed_pass',
    })

    // mock bcrypt.compare returning false
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

    const res = await request(app)
      .post('/login')
      .send({ email: 'unique1@test.com', password: 'wrongPass123' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid email or password.')
  })

  test('should call bcrypt.compare with correct arguments', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: 'user@test.com',
      password: 'hashed_pass',
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

    await request(app)
      .post('/login')
      .send({ email: 'user@test.com', password: 'Aa123456!' })

    expect(bcrypt.compare).toHaveBeenCalledWith('Aa123456!', 'hashed_pass')
  })

  test('should login successfully and set cookies', async () => {
    // mock existing user
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: 'user@test.com',
      password: 'hashed_pass',
    })

    // mock correct password
    ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

    const res = await request(app)
      .post('/login')
      .send({ email: 'user@test.com', password: 'Aa123456!' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Login successful')

    // cookies should be set
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toContain('accessToken=')
    expect(res.headers['set-cookie'][1]).toContain('refreshToken=')
  })
})
