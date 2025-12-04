import express from 'express';
import geminiService from '../services/geminiService.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * POST /api/gemini/analyze-task
 * Analyse une tâche et suggère une priorisation
 */
router.post('/analyze-task', async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const analysis = await geminiService.analyzeTaskPriority(taskData);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing task:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/enrich-description
 * Génère une description enrichie pour une tâche
 */
router.post('/enrich-description', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const description = await geminiService.enrichTaskDescription(title);
    res.json({ description });
  } catch (error) {
    console.error('Error enriching description:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/suggest-tasks/:taskId
 * Suggère des tâches connexes
 */
router.post('/suggest-tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const suggestions = await geminiService.suggestRelatedTasks(task);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error suggesting tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/analyze-project/:projectId
 * Analyse un projet complet
 */
router.post('/analyze-project/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await Task.find({ projectId: req.params.projectId });
    const analysis = await geminiService.analyzeProject(project, tasks);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/summarize-note
 * Résume une note
 */
router.post('/summarize-note', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const summary = await geminiService.summarizeNote(content);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing note:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/extract-tags
 * Extrait des tags d'un texte
 */
router.post('/extract-tags', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const tags = await geminiService.extractTags(text);
    res.json({ tags });
  } catch (error) {
    console.error('Error extracting tags:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/gemini/chat
 * Endpoint générique pour discuter avec Gemini
 */
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await geminiService.generateContent(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
