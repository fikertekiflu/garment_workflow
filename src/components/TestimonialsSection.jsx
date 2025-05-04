import React, { useState, useEffect } from 'react';

// 1. Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Removed EffectFade for potentially smoother text transition

// 2. Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
// Removed fade effect CSS: import 'swiper/css/effect-fade';

// Updated Quote Icon Component - More subtle
const QuoteIcon = () => (
  // Larger, more stylized quote mark using text gradient
  <span className="text-6xl font-bold bg-gradient-to-br from-teal-400 to-blue-600 text-transparent bg-clip-text opacity-40 absolute -top-4 left-0">
    “
  </span>
);

// Mock Testimonial Data - Added Quality & Packaging
const testimonials = [
  {
    id: 1,
    quote: "Having a clear view of the production schedule in one place significantly reduces coordination time and prevents delays.", // Slightly rephrased
    author: "Production Manager",
    department: "Production Dept."
  },
  {
    id: 2,
    quote: "The ability to instantly submit cutting reports and see merchandising updates streamlines our workflow dramatically.", // Slightly rephrased
    author: "Cutting Team Lead",
    department: "Cutting Dept."
  },
  {
    id: 3,
    quote: "Viewing real-time reports helps us anticipate material needs and manage inventory much more effectively.", // Slightly rephrased
    author: "Warehouse Coordinator",
    department: "Warehouse"
  },
  {
    id: 4,
    quote: "This system promises the visibility we need to track orders accurately and communicate proactively with suppliers.", // Slightly rephrased
    author: "Merchandiser",
    department: "Merchandising"
  },
  {
    id: 5, // New Testimonial
    quote: "Centralized reporting for quality checks will allow us to identify trends and address potential issues faster than ever.",
    author: "Quality Manager",
    department: "Quality Control"
  },
  {
    id: 6, // New Testimonial
    quote: "Knowing the exact status of finished goods from reporting will greatly improve our packing and shipping efficiency.",
    author: "Packaging Supervisor",
    department: "Packaging"
  }
];

function TestimonialsSection() {
  // State for load animation
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Section container with padding and consistent background
    <section id="testimonials" className="font-sans bg-gradient-to-b from-white to-slate-200  py-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center">

        {/* Animated content container */}
        <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-teal-400 mb-4">
            Voices from the Floor
          </h2>
          <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
            How Hidet Workflow is set to enhance our daily operations.
          </p>

          {/* 3. Swiper Carousel Implementation - Modernized Slide Content */}
          <Swiper
            modules={[Pagination, Autoplay]} // Using default slide transition
            spaceBetween={50} // Increased space for visual separation if needed
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4500, // Slightly longer delay
              disableOnInteraction: true, // Stop autoplay on interaction
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: function (index, className) {
                // Custom pagination style - slightly larger, more opacity
                return '<span class="' + className + ' bg-teal-500 opacity-60 !w-3.5 !h-3.5"></span>';
              },
            }}
            className="pb-16 max-w-3xl mx-auto" // Increased padding-bottom, wider max-width
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="px-4"> {/* Added padding within slide */}
                {/* Modernized Testimonial Display - No card background/border */}
                <div
                  className="relative flex flex-col items-center text-center min-h-[250px] pt-10 pb-6" // Adjusted padding and min-height
                >
                  <QuoteIcon />
                  {/* Quote Text - Larger, centered */}
                  <blockquote className="text-gray-900 font-medium text-xl md:text-2xl leading-snug mb-8 max-w-xl mx-auto z-10"> {/* Increased size, adjusted leading */}
                    {testimonial.quote}
                  </blockquote>
                  {/* Author/Department Info - Clean layout */}
                  <div className="mt-auto z-10">
                    <p className="font-semibold text-gray-700 text-base">{testimonial.author}</p> {/* Slightly larger */}
                    <p className="text-sm text-teal-400 tracking-wide uppercase">{testimonial.department}</p> {/* Slightly larger */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
