import type { Response } from 'express'

const isProd = process.env.NODE_ENV === 'production'
const sameSiteSetting: 'lax' | 'strict' | 'none' = isProd ? 'none' : 'lax'
const baseCookieOptions = {
  httpOnly: true, // prevent XSS attacks
  sameSite: sameSiteSetting, // prevent CSRF attacks
  secure: isProd, // only send cookie over HTTPS in production
} as const

const MAX_AGE_1H = 60 * 60 * 1000
const MAX_AGE_7D = 7 * 24 * 60 * 60 * 1000

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', baseCookieOptions)
  res.clearCookie('refreshToken', baseCookieOptions)
}

export const setAuthCookies = (
  res: Response,
  token: string,
  refreshToken?: string,
) => {
  res.cookie('accessToken', token, {
    ...baseCookieOptions,
    maxAge: MAX_AGE_1H,
  })
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: MAX_AGE_7D,
  })
}
