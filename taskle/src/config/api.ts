const isProd = import.meta.env.MODE === 'production'

export const API_URL = isProd
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:3005'
