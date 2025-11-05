import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

const router = Router();

router.get('/', taskController.listTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/stats/summary', taskController.getStats);

export default router;
