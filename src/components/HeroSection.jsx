import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Import icons for the info cards - Using LuTrendingUp as workaround for LuBarChart3
import { LuCalendarClock, LuTrendingUp, LuMessagesSquare } from 'react-icons/lu'; // Changed LuBarChart3 to LuTrendingUp

// Texts for the carousel
const rotatingTexts = [
  "Manage Schedules Seamlessly.",
  "Track Production Progress.",
  "Enhance Team Collaboration.",
  "Gain Real-time Insights."
];

// Data for the small info cards - Updated icon reference
const infoCards = [
    { icon: LuCalendarClock, text: "Real-time Scheduling" },
    { icon: LuTrendingUp, text: "Progress Reporting" }, // Using LuTrendingUp
    { icon: LuMessagesSquare, text: "Team Communication" }
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTextAnimatingOut, setIsTextAnimatingOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTextAnimatingOut(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
        setIsTextAnimatingOut(false);
      }, 500);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  // Use navigate for the login button
  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    // Added relative positioning for the absolute positioned cards container if needed, increased bottom padding
    <section id="home" className="relative font-sans container mx-auto px-6 pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden"> {/* Increased pb */}
      {/* Main Hero Content */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-12 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

        {/* Left Side: Text Carousel and Buttons */}
        <div className="md:w-1/2 text-center md:text-left z-10"> {/* Ensure text is above cards if overlapping */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Streamline Your Garment Production
          </h1>

          {/* Rotating Text Carousel */}
          <div className="relative h-14 mb-6 overflow-hidden">
            <p
              key={currentIndex}
              className={`absolute w-full text-2xl lg:text-3xl font-medium text-teal-400 transition-all duration-500 ease-in-out ${
                isTextAnimatingOut
                  ? 'opacity-0 -translate-y-4'
                  : 'opacity-100 translate-y-0'
              }`}
              style={{ transform: isTextAnimatingOut ? 'translateY(-1rem)' : 'translateY(0rem)', opacity: isTextAnimatingOut ? 0 : 1 }}
            >
              {rotatingTexts[currentIndex]}
            </p>
          </div>

          <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Hidet Workflow provides a centralized platform to manage tasks, monitor progress, and improve communication across your production teams.
          </p>

          {/* Updated button to use navigate */}
          <button
            onClick={handleLoginClick}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg transition duration-200 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
          >
            Access Your Dashboard
          </button>
        </div>

        {/* Right Side: Image */}
        <div className={`md:w-1/2 mt-10 md:mt-0 transition-all duration-1000 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'} z-10`}>
          {/* Added shadow, transition, and hover effect to the image */}
          <img
            src="/home.svg"
            alt="Garment Production Workflow Illustration"
            className="rounded-lg w-full h-auto object-contain max-h-[400px] md:max-h-[450px]
                       shadow-2xl shadow-teal-500/20  /* Added shadow with teal tint */
                       transition-all duration-300 ease-in-out
                       hover:scale-105 hover:shadow-blue-500/30 /* Scale up and change shadow on hover */
                       cursor-pointer /* Optional: Add cursor pointer on hover */
                       "
          />
        </div>
      </div>

      {/* Bottom Info Cards Section */}
      {/* Added relative positioning and adjusted margins */}
      <div className={`relative mt-16 md:mt-24 transition-all duration-1000 ease-out delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             {infoCards.map((card, index) => (
                 <div
                    key={index}
                    // Card styling
                    className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-md p-4 flex items-center space-x-3 min-w-[200px] transform hover:scale-105 transition-transform duration-200"
                 >
                    {/* Icon styling */}
                    <card.icon className="w-5 h-5 text-teal-400 flex-shrink-0" /> {/* Adjusted icon size */}
                    {/* Text styling */}
                    <span className="text-sm text-gray-200 font-medium">{card.text}</span>
                 </div>
             ))}
         </div>
      </div>

    </section>
  );
}

export default HeroSection;
