import { useState, useEffect, FormEvent } from 'react';
import { Note } from '../pages/HomePage';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  noteToEdit: Note | null;
}

const EditNoteModal = ({ isOpen, onClose, onSave, noteToEdit }: EditNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  }, [noteToEdit]);

  if (!isOpen || !noteToEdit) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...noteToEdit, title, content });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-white/30">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border-2 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Note</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-note-title" className="sr-only">Note Title</label>
            <input
              id="edit-note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-note-content" className="sr-only">Note Content</label>
            <textarea
              id="edit-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
