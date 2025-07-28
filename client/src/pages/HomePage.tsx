import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import NoteItem from '../components/NoteItem';
import CreateNote from '../components/CreateNote';
import ConfirmationModal from '../components/ConfirmationModal';
import EditNoteModal from '../components/EditNoteModal';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for modals
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes.', { id: 'fetch-error' });
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

  const handleNoteUpdated = async (updatedNote: Note) => {
    try {
      const response = await api.put(`/notes/${updatedNote._id}`, {
        title: updatedNote.title,
        content: updatedNote.content,
      });
      setNotes(notes.map((note) => (note._id === updatedNote._id ? response.data : note)));
      toast.success('Note updated successfully!', { id: 'update-success' });
      setNoteToEdit(null);
    } catch (error) {
      toast.error('Failed to update note.', { id: 'update-error' });
    }
  };

  const handleDeleteRequest = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await api.delete(`/notes/${noteToDelete}`);
      setNotes(notes.filter((note) => note._id !== noteToDelete));
      toast.success('Note deleted successfully!', { id: 'delete-success' });
    } catch (error) {
      toast.error('Failed to delete note.', { id: 'delete-error' });
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <CreateNote onNoteCreated={handleNoteCreated} />

        <div className="mt-8 mx-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Notes</h2>
          {isLoading ? (
            <p>Loading notes...</p>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  onDelete={handleDeleteRequest}
                  onEdit={() => setNoteToEdit(note)}
                />
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

      {/* Modals */}
      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
      <EditNoteModal
        isOpen={!!noteToEdit}
        onClose={() => setNoteToEdit(null)}
        onSave={handleNoteUpdated}
        noteToEdit={noteToEdit}
      />
    </>
  );
};

export default HomePage;
