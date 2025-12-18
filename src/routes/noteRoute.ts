import express from 'express';
import { 
    createNote, 
    getNotes, 
    updateNote, 
    deleteNote,
    getNoteById
} from '../controllers/noteController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.get('/:id', auth, getNoteById);

export default router;