import { useState, FormEvent } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Note } from '../pages/HomePage';

interface CreateNoteProps {
  onNoteCreated: (newNote: Note) => void;
}

const CreateNote = ({ onNoteCreated }: CreateNoteProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return toast.error('Title is required.', { id: 'title-required' });
    }
    if (!content.trim()) {
      return toast.error('Content cannot be empty.', { id: 'content-required' });
    }

    setIsLoading(true);
    try {
      const response = await api.post('/notes', { title, content });
      toast.success('Note created successfully!', { id: 'note-success' });
      onNoteCreated(response.data);
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to create the note. Please try again.', { id: 'note-failure' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Note</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="note-title" className="sr-only">Note Title</label>
          <input
            id="note-title"
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            required
          />
        </div>
        <div>
          <label htmlFor="note-content" className="sr-only">Note Content</label>
          <textarea
            id="note-content"
            placeholder="Take a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
