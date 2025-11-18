import express from 'express'
import { prismaMock } from '../__mocks__/prisma'
import request from 'supertest'
import router from '../routes/user'

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed_pass'),
}))

const app = express()
app.use(express.json())
app.use('/', router)

describe('POST /register', () => {
  beforeEach(() => jest.clearAllMocks())

  test('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/register').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email and password are required.')
  })

  test('should return 400 if user already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1 } as any)
    const res = await request(app)
      .post('/register')
      .send({ email: 'a@a.com', password: 'Aa123456!' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('User already exists.')
  })
})
