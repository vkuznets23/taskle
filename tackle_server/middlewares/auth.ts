import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    req.userId = Number(decoded.userId)
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
