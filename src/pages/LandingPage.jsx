// src/pages/LandingPage.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutUsSection from '../components/Aboutus'; 
import TestimonialsSection from '../components/TestimonialsSection';


function LandingPage() {
  return (
    <> 
    <div  className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 to-black text-gray-200 font-sans">
      <HeroSection />
      <AboutUsSection />
      <FeaturesSection />
      <TestimonialsSection />
      </div>
    </>
  );
}

export default LandingPage;