import express from 'express';
import { 
    createNote, 
    getNotes, 
    updateNote, 
    deleteNote 
} from '../controllers/noteController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);

export default router;