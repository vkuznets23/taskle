import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user'
import taskRoutes from './routes/taskRoutes'

const app = express()

// Behind proxies (Render, Vercel) we must trust the first hop so secure cookies work
app.set('trust proxy', 1)

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://taskly-eosin-ten.vercel.app'],
    credentials: true,
  })
)

// JSON middleware
app.use(express.json())
app.use(cookieParser())

// Simple check route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005')
})

export default app
