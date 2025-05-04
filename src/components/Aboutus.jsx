import React from 'react';
// 1. Import Lottie component
import Lottie from 'lottie-react';
// 2. Import your Lottie JSON animation file
//    Adjust the path based on your project structure!
import aboutAnimationData from '../assets/aboutus.json';
// Import the scroll animation hook
import useScrollAnimation from '../hook/useScrollAnimation';


function AboutUsSection() {
  // Use the scroll animation hook
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 }); // Lowered threshold slightly

  return (
    // Section container with light gradient background, padding, ID
    <section
      id="about"
      ref={sectionRef} // Attach ref for scroll animation
      // Changed background to a light white gradient
      className={`font-sans bg-gradient-to-b from-white to-slate-200 py-24 px-4 overflow-hidden`}
    >
      <div className="container mx-auto">
        {/* Grid for two-column layout */}
        {/* Adjusted gap for potentially larger animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Lottie Animation - Animated */}
          <div
            // Adjusted animation classes for visibility
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
             {/* 3. Lottie component replaces the icon div */}
             {/* Increased size constraint */}
             <div className="max-w-md mx-auto md:max-w-lg md:mx-0"> {/* Increased max-w */}
                <Lottie
                    animationData={aboutAnimationData} // Pass the imported JSON data
                    loop={true} // Set animation to loop
                    autoplay={true} // Set animation to play automatically
                    className="w-full h-auto" // Ensure it scales within the container
                 />
             </div>
          </div>

          {/* Right Column: Text Content - Animated */}
          <div
            // Adjusted animation classes
            className={`text-center md:text-left transition-all duration-1000 ease-out delay-150 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} // Slightly adjusted delay
          >
            {/* Section Title - Dark text, teal accent */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Unifying Our <span className="text-teal-600">Garment Workflow</span>
            </h2>

            {/* Main Content Paragraphs - Darker text */}
            <div className="text-lg text-gray-700 space-y-5 leading-relaxed">
              <p>
                Hidet Workflow is the central platform integrating every stage of our garment production. It bridges departments, ensuring a cohesive process from initial scheduling through to final reporting.
              </p>
              <p>
                By centralizing data and communication, we unlock greater <strong className="font-semibold text-teal-700">efficiency</strong>, provide essential <strong className="font-semibold text-blue-700">transparency</strong> across teams, and foster seamless <strong className="font-semibold text-emerald-700">collaboration</strong>—driving quality and on-time delivery.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
