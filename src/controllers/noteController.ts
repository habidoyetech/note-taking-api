import { Response } from "express";
import Note from "../models/note";
import { AuthRequest } from "../middleware/auth";
import { noteSchema } from "../utils/validation";
import mongoose from "mongoose";

// Create Note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message.replace(/[\\"]/g, ""),
      });
    }

    const note = new Note({
      userId: req.user._id,
      title: req.body.title,
      content: req.body.content,
    });

    const savedNote = await note.save();
    res.status(201).json({
      status: "success",
      message: "Note created successfully",
      data: savedNote,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while saving the note.",
    });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { title, date } = req.query;
    let query: any = { userId: req.user._id };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (date) {
      const searchDate = new Date(date as string);
      if (!isNaN(searchDate.getTime())) {
        query.createdAt = { $gte: searchDate };
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({
      status: "success",
      results: notes.length,
      data: notes,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve notes.",
    });
  }
};

// Update Note
export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Note ID format" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        status: "fail",
        message: "Note not found or you do not have permission to edit it.",
      });
    }

    res.json({
      status: "success",
      message: "Note updated successfully",
      data: note,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: "Error updating the note.",
    });
  }
};

// Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Note ID format' });
    }

    const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!note) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note not found or already deleted.'
      });
    }

    res.json({
      status: 'success',
      message: 'Note deleted successfully'
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting the note.'
    });
  }
};
