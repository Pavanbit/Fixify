import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, Briefcase, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, userType, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8" />
              <span className="text-xl font-bold">Fixify</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={userType === 'user' ? '/user-dashboard' : '/worker-dashboard'} 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
                
                {userType === 'user' && (
                  <Link 
                    to="/post-job" 
                    className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Post a Job
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 pb-4 px-4">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              onClick={closeMenu}
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={userType === 'user' ? '/user-dashboard' : '/worker-dashboard'} 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  onClick={closeMenu}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                
                {userType === 'user' && (
                  <Link 
                    to="/post-job" 
                    className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={closeMenu}
                  >
                    Post a Job
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center text-left w-full"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;