import React from 'react';
// 1. Import desired icons from react-icons
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa'; // Example social icons
import { FaMapMarkerAlt } from 'react-icons/fa'; // Example address icon

function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  // Placeholder links - Replace with your actual URLs
  const socialLinks = {
    linkedin: '#',
    twitter: '#',
    facebook: '#',
    instagram: '#',
  };
  const companyAddress = "123 Production Way, Addis Ababa, Ethiopia"; // Placeholder Address

  return (
    // Footer container with dark background
    <footer className="relative font-sans bg-black py-10 px-4 mt-20"> {/* Increased padding and top margin */}
      {/* Gradient Top Border Effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

      <div className="container mx-auto text-center">
        {/* Logo/Brand Name */}
        <div className="flex items-center justify-center space-x-2 mb-6 opacity-90">
           <div className="h-7 w-7 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm text-[10px]">
             HW
           </div>
           <span className="text-lg font-medium text-gray-300"> {/* Slightly larger */}
             Hidet Workflow
           </span>
        </div>

        {/* Address (Optional) */}
        <div className="flex items-center justify-center text-sm text-gray-400 mb-6 space-x-2">
           <FaMapMarkerAlt className="w-4 h-4 text-teal-400 flex-shrink-0" />
           <span>{companyAddress}</span>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-teal-300 transition-colors duration-300 transform hover:scale-110">
               <FaLinkedinIn className="w-5 h-5" />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-teal-300 transition-colors duration-300 transform hover:scale-110">
               <FaTwitter className="w-5 h-5" />
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-teal-300 transition-colors duration-300 transform hover:scale-110">
               <FaFacebookF className="w-5 h-5" />
            </a>
          )}
           {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-teal-300 transition-colors duration-300 transform hover:scale-110">
               <FaInstagram className="w-5 h-5" />
            </a>
          )}
          {/* Add more social links as needed */}
        </div>

        {/* Copyright Notice */}
        <p className="text-xs text-gray-600"> {/* Smaller copyright */}
          &copy; {currentYear} [Your Company Name]. All Rights Reserved. | Hidet Workflow Internal System
        </p>

      </div>
    </footer>
  );
}

export default Footer;
