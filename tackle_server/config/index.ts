import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()

const _jwtSecret = process.env.JWT_SECRET
const _jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

if (!_jwtSecret || !_jwtRefreshSecret) {
  throw new Error('JWT secrets are not configured')
}

export const jwtSecret = _jwtSecret
export const jwtRefreshSecret = _jwtRefreshSecret
