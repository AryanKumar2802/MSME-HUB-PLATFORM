import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            MSME Hub
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                
                {user.role === 'business' && (
                  <>
                    <Link to="/business-profile" className="hover:text-blue-200">
                      Business
                    </Link>
                    <Link to="/book-records" className="hover:text-blue-200">
                      Records
                    </Link>
                  </>
                )}
                
                <Link to="/gst-guides" className="hover:text-blue-200">
                  GST Guides
                </Link>
                
                <Link to="/mentors" className="hover:text-blue-200">
                  Mentors
                </Link>
                
                <Link to="/lawyers" className="hover:text-blue-200">
                  Lawyers
                </Link>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <FaUser className="text-xl" />
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 hover:text-blue-200"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;