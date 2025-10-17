import express from 'express'
import cors from 'cors'
// Routes imports
import userRoutes from './routes/user'

const app = express()

// Middleware
app.use(cors())

// JSON middleware
app.use(express.json())

// Simple check route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Routes
app.use('/api/users', userRoutes)

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005')
})

export default app
