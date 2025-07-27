import { Note } from '../pages/HomePage';

interface NoteItemProps {
  note: Note;
  onDelete: (noteId: string) => void;
}

const NoteItem = ({ note, onDelete }: NoteItemProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 break-words">{note.title}</h3>
        <p className="text-gray-700 whitespace-pre-wrap break-words">{note.content}</p>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <button
          onClick={() => onDelete(note._id)}
          className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
