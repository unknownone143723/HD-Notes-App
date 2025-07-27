import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hideButtons = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Always visible */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/icon.png" alt="HD Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-gray-800">HD</span>
          </Link>

          {/* Hamburger Toggle - hidden on /login and /signup */}
          {!hideButtons && (
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}

          {/* Desktop Menu - hidden on /login and /signup */}
          {!hideButtons && (
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu - hidden on /login and /signup */}
        {!hideButtons && isOpen && (
          <div className="lg:hidden flex flex-col space-y-3 pb-4">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
