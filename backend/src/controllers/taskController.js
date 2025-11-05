import Task from '../models/Task.js';
import { prioritizeTask } from '../services/prioritizer.js';
import { buildStats } from '../utils/stats.js';

export const listTasks = async (_req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.title || typeof payload.title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const classification = await prioritizeTask(payload);
    const task = await Task.create({
      ...payload,
      ...classification,
      completedAt: payload.completed ? new Date() : undefined
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    if (payload.title !== undefined && !payload.title) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const shouldReclassify =
      ['title', 'description', 'dueDate', 'estimatedMinutes', 'tags'].some(
        (field) => payload[field] !== undefined
      );

    let classification = {};
    if (shouldReclassify) {
      classification = await prioritizeTask({ ...existing.toObject(), ...payload });
    }

    if (payload.completed === true && !existing.completedAt) {
      payload.completedAt = new Date();
    } else if (payload.completed === false) {
      payload.completedAt = null;
    }

    existing.set({ ...payload, ...classification });
    const updated = await existing.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getStats = async (_req, res, next) => {
  try {
    const tasks = await Task.find();
    const stats = buildStats(tasks);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
