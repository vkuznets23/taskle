import { PrismaClient } from '@prisma/client'
import express from 'express'
import { authenticateToken } from '../middlewares/auth.js'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { task, priority, tag, status } = req.body

    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Task is required and must be a non-empty string' })
    }

    if (task.length > 150) {
      return res
        .status(400)
        .json({ error: 'The task text must be under 150 characters.' })
    }

    // get userId from middleware
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' })
    }

    const validPriorities = ['HIGH', 'MEDIUM', 'LOW']
    const validTags = ['NONE', 'WORK', 'STUDYING', 'PERSONAL']
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE']

    const validatedPriority = validPriorities.includes(priority)
      ? priority
      : 'NONE'
    const validatedTag = validTags.includes(tag) ? tag : 'LOW'
    const validatedStatus = validStatuses.includes(status) ? status : 'TODO'

    const newTask = await prisma.task.create({
      data: {
        task: task.trim(),
        priority: validatedPriority,
        tag: validatedTag,
        status: validatedStatus,
        userId,
      },
    })

    return res.status(201).json(newTask)
  } catch (err) {
    console.error('Error creating task:', err)
    return res.status(500).json({ error: 'Unable to create task.' })
  }
})

router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const allTasks = await prisma.task.findMany({
      where: { userId: req.userId },
    })
    res.json(allTasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch tasks' })
  }
})

// update task
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { task, priority, tag, status } = req.body

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    })

    if (!existingTask || existingTask.userId !== req.userId)
      return res.status(400).json({ error: 'Task not found' })

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        task,
        priority,
        tag,
        status,
      },
    })

    console.log('updates', updatedTask)

    res.status(200).json(updatedTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to update task' })
  }
})

// count amount of tasks
router.get('/tasks/count', async (req, res) => {
  try {
    const counts = await prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { userId: req.userId },
    })
    res.json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get counts' })
  }
})

// delete task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const taskId = Number(id)

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    })
    if (!existingTask) {
      return res.status(400).json({ error: 'Task doesnt exist' })
    }

    await prisma.task.delete({
      where: { id: taskId },
    })

    return res.status(200).json({ message: 'Task deleted successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
