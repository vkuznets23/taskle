import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const jwtSecret = process.env.JWT_SECRET as string
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as string
const isProd = process.env.NODE_ENV === 'production'
const sameSiteSetting: 'lax' | 'strict' | 'none' = isProd ? 'none' : 'lax'
const baseCookieOptions = {
  httpOnly: true,
  sameSite: sameSiteSetting,
  secure: isProd,
} as const

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' })
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' })
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Invalid password.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })
    res.json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Unable to register user.' })
  }
})

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }
    // find a user in prisma by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }
    // if user is found, compare the password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // generate a short lived token
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    })

    // generate a long lived token
    const refreshToken = jwt.sign({ userId: user.id }, jwtRefreshSecret, {
      expiresIn: '7d',
    })

    // save to cookie
    res.cookie('accessToken', token, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    })

    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unable to login user.' })
  }
})

// refrech a token
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken)
    return res.status(401).json({ error: 'Missing refresh token' })

  try {
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret)
    const newAccessToken = jwt.sign(
      { userId: (decoded as JwtPayload).userId },
      jwtSecret,
      { expiresIn: '1h' }
    )

    res.cookie('accessToken', newAccessToken, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 1000,
    })

    return res.json({ message: 'Token refreshed' })
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Invalid token' })
  }
})

// Check if user is authenticated
router.get('/me', async (req, res) => {
  const token = req.cookies.accessToken
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true },
    })
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    return res.json({ user })
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Invalid token' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', baseCookieOptions)
  res.clearCookie('refreshToken', baseCookieOptions)
  res.json({ message: 'Logged out successfully' })
})

export default router
