import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
