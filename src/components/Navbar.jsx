import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // All navigation clicks will now go to the root path '/'
  const handleNavClick = () => {
    navigate('/'); // Navigate to the root path
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  // Function to handle login navigation (remains separate as it goes to '/login')
  const handleLoginClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    // Navbar: Sticky, solid black background, teal bottom border, enhanced shadow
    <nav className="sticky top-0 z-50 font-sans shadow-xl bg-gray-900">
      {/* Container with teal bottom border and rounded bottom corners */}
      <div className="container mx-auto px-4 border-b-2 border-teal-500 rounded-b-lg">
        <div className="flex justify-between items-center h-16">

          {/* Left Side: Logo and System Name - NOW LINKS TO HOME */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleNavClick}>
            <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
              HW
            </div>
            <span className="text-xl font-semibold text-white tracking-tight hidden sm:inline">
              Hidet Workflow
            </span>
          </div>

          {/* Center/Right Navigation Links - ALL NOW LINK TO HOME */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={handleNavClick} // Links to home
              className="relative text-gray-300 hover:text-white font-medium transition duration-200 group pb-1"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </button>
            <button
              onClick={handleNavClick} // Links to home
              className="relative text-gray-300 hover:text-white font-medium transition duration-200 group pb-1"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </button>
            <button
              onClick={handleNavClick} // Links to home
              className="relative text-gray-300 hover:text-white font-medium transition duration-200 group pb-1"
            >
              Services
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </button>
          </div>

          {/* Right Side: Login Button (remains as is) */}
          <div className="hidden md:block">
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 ease-in-out shadow-md text-sm transform hover:scale-105"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - ALL NOW LINK TO HOME */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black bg-opacity-95 backdrop-blur-sm shadow-lg border-b-2 border-teal-500 rounded-b-lg pb-4 pt-2">
          <div className="container mx-auto px-4">
            <button onClick={handleNavClick} className="block w-full text-left py-2 px-2 text-gray-300 hover:bg-gray-800 rounded transition duration-200 font-medium">Home</button>
            <button onClick={handleNavClick} className="block w-full text-left py-2 px-2 text-gray-300 hover:bg-gray-800 rounded transition duration-200 font-medium">About Us</button>
            <button onClick={handleNavClick} className="block w-full text-left py-2 px-2 text-gray-300 hover:bg-gray-800 rounded transition duration-200 font-medium">Services</button>
            <button
              onClick={handleLoginClick}
              className="mt-3 block w-full text-center py-2 px-4 text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-md font-semibold transition duration-200 ease-in-out shadow-md text-sm"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;