import { Response } from 'express';
import Note from '../models/note';
import { AuthRequest } from '../middleware/auth';
import { noteSchema } from '../utils/validation';

// Create Note
export const createNote = async (req: AuthRequest, res: Response) => {
  const { error } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const note = new Note({
    userId: req.user._id, 
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ message: 'Error saving note' });
  }
};


export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { title, date } = req.query;
    let query: any = { userId: req.user._id };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (date) {
        const queryDate = new Date(date as string);
        query.createdAt = { $gte: queryDate };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

// Update Note
export const updateNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, // Ensure user owns note
            { $set: req.body },
            { new: true }
        );
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: 'Error updating note' });
    }
};

// Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note' });
    }
};