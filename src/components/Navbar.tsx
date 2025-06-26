import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { toggleTheme } from '../store/slice/themeSlice';
import { logout } from '../store/slice/authSlice';  // Import logout action
import type { RootState } from '../store';
import type { AppDispatch } from '../store'; // Import AppDispatch type

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch to type dispatch
  const navigate = useNavigate();
  const { isDark } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.auth);

  // Handle logout functionality
  const handleLogout = () => {
    dispatch(logout()) // Dispatch logout action
      .unwrap() // Unwrap the promise to handle result or error
      .then(() => {
        navigate('/login'); // Redirect to login page after successful logout
      })
      .catch((error) => {
        console.error('Logout failed: ', error);
      });
  };

  return (
    <nav className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            TaskMaster
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
