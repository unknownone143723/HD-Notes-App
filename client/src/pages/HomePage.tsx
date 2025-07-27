import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import NoteItem from '../components/NoteItem';
import CreateNote from '../components/CreateNote';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteCreated = (newNote: Note) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteDeleted = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
      toast.success('Note deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete note.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <CreateNote onNoteCreated={handleNoteCreated} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Notes</h2>
        {isLoading ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} onDelete={handleNoteDeleted} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">You haven't created any notes yet.</p>
            <p className="text-gray-400 text-sm">Use the form above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
