import { useState, useEffect, useRef } from 'react';

/**
 * Custom Hook for Triggering Animations on Scroll using Intersection Observer.
 *
 * @param {object} options - Intersection Observer options (optional).
 * @param {number} options.threshold - Percentage of element visibility required to trigger (default: 0.1).
 * @param {boolean} options.triggerOnce - Whether the animation should only trigger once (default: true).
 * @returns {[React.RefObject, boolean]} - A ref to attach to the element and a boolean indicating visibility.
 */
function useScrollAnimation(options = { threshold: 0.1, triggerOnce: true }) {
  // State to track if the element is currently visible according to the observer
  const [isVisible, setIsVisible] = useState(false);
  // Ref to attach to the DOM element we want to observe
  const elementRef = useRef(null);

  useEffect(() => {
    // Create the Intersection Observer instance
    // It takes a callback function that receives an array of entries
    const observer = new IntersectionObserver(
      (entries) => {
        // We usually observe only one element with this hook instance
        const entry = entries[0];
        if (entry) { // Check if entry exists
          if (entry.isIntersecting) {
            // Element is intersecting (visible based on threshold)
            setIsVisible(true);

            // If triggerOnce is true, stop observing the element
            // once it becomes visible to prevent re-triggering animation
            if (options.triggerOnce && elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          } else {
            // Element is not intersecting
            // Only reset visibility if triggerOnce is false
            if (!options.triggerOnce) {
              setIsVisible(false);
            }
          }
        }
      },
      // Pass the observer options (threshold determines visibility percentage)
      { threshold: options.threshold }
    );

    // Store the current element ref value
    const currentElement = elementRef.current;

    // Start observing the element if it exists
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup function: Stop observing the element when the component unmounts
    // or when the effect re-runs
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
    // Dependency array: Re-run the effect if the options object changes
    // Note: If options object is created inline in the component, it might cause unnecessary re-runs.
    // Consider memoizing it with useMemo if performance becomes an issue.
  }, [options]);

  // Return the ref (to be attached to the element) and the visibility state
  return [elementRef, isVisible];
}

export default useScrollAnimation;
