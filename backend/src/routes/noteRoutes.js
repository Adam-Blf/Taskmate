import express from 'express';
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  resolveLinks
} from '../controllers/noteController.js';

const router = express.Router();

router.post('/', createNote);
router.get('/', getNotes);
// Specific route for link resolution must be before :id to avoid conflict if logic was different,
// though 'resolve-links' is not a valid mongo ID usually, it's safer.
router.post('/resolve-links', resolveLinks);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
