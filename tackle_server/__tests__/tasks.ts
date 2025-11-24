import request from 'supertest'
import express from 'express'
const prismaMock = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
}

jest.mock('../generated/prisma/index.js', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}))

jest.mock('../middlewares/auth.js', () => ({
  authenticateToken: (req: { userId: number }, res: any, next: () => void) => {
    req.userId = 1
    next()
  },
}))

let app = express()

beforeAll(async () => {
  const routerModule = await import('../routes/taskRoutes')
  app = express()
  app.use(express.json())
  app.use('/', routerModule.default)
})

describe('Tasks API', () => {
  // =====================
  // POST /tasks
  // =====================
  test('should create a task successfully', async () => {
    const mockTask = {
      id: 1,
      task: 'New Task',
      priority: 'MEDIUM',
      tag: 'WORK',
      status: 'TODO',
      userId: 1,
    }

    prismaMock.task.create.mockResolvedValue(mockTask)

    const res = await request(app).post('/tasks').send({
      task: 'New Task',
      priority: 'MEDIUM',
      tag: 'WORK',
      status: 'TODO',
    })

    expect(res.status).toBe(201)
    expect(res.body.task).toBe('New Task')
    expect(prismaMock.task.create).toHaveBeenCalled()
  })

  test('should reject task with empty string', async () => {
    const res = await request(app).post('/tasks').send({ task: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/Task is required/)
  })

  test('should reject too long task', async () => {
    const longText = 'a'.repeat(151)
    const res = await request(app).post('/tasks').send({ task: longText })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/under 150 characters/)
  })

  // =====================
  // GET /tasks
  // =====================
  test('should return all user tasks', async () => {
    const mockTasks = [
      { id: 1, task: 'A', userId: 1 },
      { id: 2, task: 'B', userId: 1 },
    ]

    prismaMock.task.findMany.mockResolvedValue(mockTasks)

    const res = await request(app).get('/tasks')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    expect(prismaMock.task.findMany).toHaveBeenCalled()
  })

  // =====================
  // PUT /tasks/:id
  // =====================
  test('should update a task', async () => {
    const existingTask = { id: 1, userId: 1 }
    const updatedTask = { id: 1, task: 'Updated', userId: 1 }

    prismaMock.task.findUnique.mockResolvedValue(existingTask)
    prismaMock.task.update.mockResolvedValue(updatedTask)

    const res = await request(app).put('/tasks/1').send({ task: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.task).toBe('Updated')
  })

  test('should return error if task not found for update', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null)

    const res = await request(app).put('/tasks/123').send({ task: 'Update' })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/Task not found/)
  })

  // =====================
  // GET /tasks/count
  // =====================
  test('should return grouped task counts', async () => {
    const mockCounts = [
      { status: 'TODO', _count: { id: 5 } },
      { status: 'DONE', _count: { id: 3 } },
    ]

    prismaMock.task.groupBy.mockResolvedValue(mockCounts)

    const res = await request(app).get('/tasks/count')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
  })

  // =====================
  // DELETE /tasks/:id
  // =====================
  test('should delete a task successfully', async () => {
    prismaMock.task.findUnique.mockResolvedValue({ id: 1 })
    prismaMock.task.delete.mockResolvedValue({})

    const res = await request(app).delete('/tasks/1')

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/successfully/)
  })

  test('should return error if task does not exist', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null)

    const res = await request(app).delete('/tasks/55')

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/doesnt exist/)
  })

  test('should reject invalid task ID', async () => {
    const res = await request(app).delete('/tasks/abc')

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/Invalid task ID/)
  })
})
