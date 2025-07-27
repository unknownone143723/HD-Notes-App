import { Response } from 'express';
import Note from '../models/Note';
import { IRequest } from '../middleware/authMiddleware'; 

export const getNotes = async (req: IRequest, res: Response) => {
    try {
        const notes = await Note.find({ userId: req.user?._id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createNote = async (req: IRequest, res: Response) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please add a title and content' });
    }

    try {
        const note = new Note({
            userId: req.user?._id,
            title,
            content,
        });

        const createdNote = await note.save();
        res.status(201).json(createdNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteNote = async (req: IRequest, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Note.deleteOne({ _id: req.params.id });

        res.json({ message: 'Note removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
