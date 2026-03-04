import { prisma } from '../config'
import express from 'express'
import { authenticateToken } from '../middlewares/auth.js'
import {
  inputValidation,
  taskValidation,
  validateAll,
} from '../utils/validation'

const router = express.Router()

router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { task, priority, tag, status } = req.body

    const error = taskValidation(task)
    if (error) {
      return res.status(400).json({ error })
    }

    // get userId from middleware
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' })
    }

    const {
      priority: validatedPriority,
      tag: validatedTag,
      status: validatedStatus,
    } = validateAll(priority, tag, status)

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
    return res.status(200).json(allTasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch tasks' })
  }
})

// update task
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { task, priority, tag, status } = req.body

  // check that id is num
  const taskId = Number(id)
  if (Number.isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  // validate input
  const taskErr = taskValidation(task)
  if (taskErr) {
    return res.status(400).json({ taskErr })
  }

  const {
    priority: validatedPriority,
    tag: validatedTag,
    status: validatedStatus,
  } = validateAll(priority, tag, status)

  try {
    // does task exist?
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    })

    if (!existingTask || existingTask.userId !== req.userId)
      return res.status(404).json({ error: 'Task not found' })

    // update task
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        task,
        priority: validatedPriority,
        tag: validatedTag,
        status: validatedStatus,
      },
    })

    return res.status(200).json(updatedTask)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unable to update task' })
  }
})

// count amount of tasks
router.get('/tasks/count', authenticateToken, async (req, res) => {
  try {
    const counts = await prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { userId: req.userId },
    })
    return res.status(200).json(counts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get counts' })
  }
})

// delete task
router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const taskId = Number(id)
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    })
    if (!existingTask || existingTask.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
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
