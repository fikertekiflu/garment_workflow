import React from 'react';
// Suggestion: Install react-icons for actual icons: npm install react-iconsnpm install react-icons
// Example Usage: import { FaCalendarAlt, FaChartLine, FaComments } from 'react-icons/fa';

// Placeholder Icon Component - Replace with actual icons later
const PlaceholderIcon = ({ className = "bg-teal-500" }) => (
  <div className={`w-16 h-16 rounded-full mb-5 mx-auto flex items-center justify-center ${className} shadow-lg`}>
    {/* Placeholder shape or initial */}
    <svg className="w-8 h-8 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  </div>
);


function FeaturesSection() {
  // Define the features with titles, descriptions, and potentially specific icon components
  const features = [
    {
      id: 1,
      title: 'Centralized Scheduling',
      description: 'Admins can create and assign production tasks with clear deadlines, visible to relevant departments.',
      icon: <PlaceholderIcon className="bg-gradient-to-br from-blue-500 to-indigo-600" />, // Example: Replace with FaCalendarAlt
    },
    {
      id: 2,
      title: 'Task & Report Management',
      description: 'Submit daily or task-based reports, view updates from other teams, and track overall production flow.',
      icon: <PlaceholderIcon className="bg-gradient-to-br from-teal-500 to-cyan-600" />, // Example: Replace with FaChartLine
    },
    {
      id: 3,
      title: 'Transparent Communication',
      description: 'View reports across departments and use the commenting feature for feedback and quick clarifications.',
      icon: <PlaceholderIcon className="bg-gradient-to-br from-emerald-500 to-green-600" />, // Example: Replace with FaComments
    },
  ];

  return (
    // Section container with padding and ID for navigation
    <section id="services" className="font-sans bg-gray-900 py-20 px-4"> {/* Slightly different background for contrast */}
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Core Features
        </h2>
        <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          Hidet Workflow simplifies production management with these key capabilities.
        </p>

        {/* Grid for Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            // Feature Card Styling
            <div
              key={feature.id}
              className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50
                         transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-teal-500/20 hover:border-teal-500/50"
            >
              {/* Icon Placeholder */}
              {feature.icon}
              {/* Card Title */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              {/* Card Description */}
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
