import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const WelcomePage = () => {
  const { userEmail } = useAuth();

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-lg p-10 text-center bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Your account for <span className="font-semibold text-indigo-600">{userEmail}</span> has been created.
        </p>
        <p className="mt-4 text-gray-500">
          You can now start creating and managing your notes.
        </p>
        <Link to="/">
          <button className="mt-8 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go to My Notes
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
