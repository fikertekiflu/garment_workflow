import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Using react-icons as in your example, added FaUsers for role selection
import { FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
// Using lottie-react as discussed previously
import Lottie from 'lottie-react';
// Ensure this path is correct for your project structure
import loginAnimationData from '../assets/login.json'; // Assuming login.json is in src/assets

// Define the available roles for the dropdown
const userRoles = [
  "Admin", // General Manager
  "Production Manager",
  "Warehouse",
  "Merchandiser",
  "Cutting Manager",
  "Packaging",
  "Quality Manager"
];

const Login = () => {
  // State to hold the selected role
  const [selectedRole, setSelectedRole] = useState(userRoles[0]); // Default to Admin
  // Removed email, password, error, loading states as they are not needed for demo

  const navigate = useNavigate();
  const animationContainerRef = useRef(null); // Keep ref if needed for Lottie interaction later

  // Handle the simulated login (role selection)
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission if it's inside a form

    if (!selectedRole) {
      alert("Please select a role."); // Basic validation
      return;
    }

    // Simulate storing the role (optional for prototype, but good practice)
    // localStorage.setItem('userRole', selectedRole);

    // Navigate to the dashboard based on the selected role
    // Creating a simplified route path from the role name
    const rolePath = selectedRole.toLowerCase().replace(/\s+/g, ''); // e.g., "productionmanager"
    navigate(`/dashboard/${rolePath}`);
  };

  // Lottie options (using lottie-react API)
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: loginAnimation,
//     rendererSettings: {
//       preserveAspectRatio: 'xMidYMid slice' // Common setting
//     }
//   };
  // Note: With lottie-react, options are passed as props directly

  // Animation Variants (from your example)
  const formVariants = {
    hidden: { opacity: 0, x: -50 }, // Increased distance
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };
  const lottieVariants = {
    hidden: { opacity: 0, x: 50 }, // Increased distance
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 } },
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger animation of children
      },
    },
  };

  return (
    // Using the dark theme established earlier
    <div className="min-h-screen  flex items-center justify-center p-4 overflow-hidden font-sans bg-gradient-to-br from-gray-800 to-black">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl mx-auto  rounded-2xl overflow-hidden lg:grid lg:grid-cols-2 shadow-2xl border border-gray-700/50"
        // Removed inline style, using Tailwind shadow
      >
        {/* Login Form Section (Left Side) */}
        <motion.div
          variants={formVariants}
          className="px-8 py-12 sm:px-12 lg:px-16 lg:py-20 flex flex-col justify-center"
        >
          {/* Header */}
          <div className="mb-10 text-center">
             {/* System Logo Placeholder */}
             <div className="inline-block mb-6 p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-lg">
                <FaUsers className="w-8 h-8 text-white" />
             </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Select Your Role
            </h2>
            <p className="text-gray-400 text-base">
              Access the Hidet Workflow dashboard.
            </p>
          </div>

          {/* Role Selection Form */}
          {/* Using handleLogin directly on button click for simplicity */}
          <div className="space-y-6">
            <div>
              <label htmlFor="role-select" className="block text-gray-300 text-sm font-medium mb-2">
                Department / Role
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-base rounded-md py-3 px-4 transition-colors duration-300
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 border-transparent
                           bg-gray-700 text-white appearance-none" // Added appearance-none
                required
              >
                {userRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button" // Changed from submit as we handle click directly
                onClick={handleLogin}
                className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
                // Removed loading state/spinner for demo
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lottie Animation Section (Right Side) */}
        <motion.div
          variants={lottieVariants}
          className="relative hidden lg:flex items-center justify-center " // Added subtle gradient bg
          ref={animationContainerRef}
        >
          {/* Using lottie-react component */}
          <Lottie
             animationData={loginAnimationData}
             loop={true}
             autoplay={true}
             style={{ maxWidth: '400px', maxHeight: '400px' }} // Control size via style prop
          />
          {/* Optional overlay text */}
          <div className="absolute bottom-10 left-10 text-left">
            <h3 className="text-2xl font-semibold text-white">Hidet Workflow</h3>
            <p className="text-gray-400 text-base mt-1">Streamlining Garment Production.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
