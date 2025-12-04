import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote
} from '../controllers/noteController.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
