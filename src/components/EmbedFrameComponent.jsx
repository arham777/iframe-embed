// src/components/EmbedFrameComponent.jsx
// A reusable React component to embed any website via iframe, plus a dynamic selector
// Uses Tailwind CSS for styling with enhanced UI/UX

import React, { useState, useRef, useEffect } from 'react';

/**
 * Enhanced Loader component
 */
const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
    <div
      className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      role="status"
      aria-label="Loading..."
    ></div>
  </div>
);

/**
 * EmbedFrame: Displays a single iframe with an improved loading overlay
 */
export const EmbedFrame = ({
  src,
  title,
  width = '100%',
  height = 'calc(100vh - 100px)', // Adjust height considering button bar etc.
  sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox',
  style = {},
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  // Reset loaded state when src changes
  useEffect(() => {
    setLoaded(false);
    // Optional: You could try to focus the iframe after it loads, but browser security might prevent it.
    // const handleLoad = () => setLoaded(true);
    // const currentIframe = iframeRef.current;
    // if (currentIframe) {
    //   currentIframe.addEventListener('load', handleLoad);
    // }
    // return () => {
    //   if (currentIframe) {
    //     currentIframe.removeEventListener('load', handleLoad);
    //   }
    // };
  }, [src]);


  return (
    <div
      className={`relative w-full overflow-hidden ${className}`} // Added overflow-hidden
      style={{ width, height, ...style }}
    >
      {/* Improved Loader */}
      {!loaded && <Loader />}

      {/* Iframe - make it invisible until loaded to prevent flickering */}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        height="100%"
        sandbox={sandbox}
        className={`border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} // Fade in when loaded
        onLoad={() => setLoaded(true)}
        onError={() => {
            console.error(`Error loading iframe source: ${src}`);
            // Optionally handle the error state visually
            setLoaded(true); // Set loaded to true to hide the spinner even on error
        }}
      />
    </div>
  );
};

/**
 * DynamicEmbed: Renders minimal, professional buttons and shows one iframe at a time
 * Props:
 *  - sites: Array of { src, title, width?, height?, sandbox?, style?, className? }
 */
export default function DynamicEmbed({ sites = [] }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  // State to manage animation triggering
  const [isAnimating, setIsAnimating] = useState(false);

  const handleButtonClick = (index) => {
    if (index !== currentIndex) {
      setIsAnimating(true); // Trigger exit animation (implicitly via key change)
      setCurrentIndex(index);
      // Trigger enter animation for the new iframe container
      // The `animate-fade-in` class handles this directly on the keyed div
    }
  };

  if (!sites?.length) {
    return <p className="p-4 text-center text-gray-500">No sites configured to embed.</p>;
  }

  const currentSite = currentIndex !== null ? sites[currentIndex] : null;

  return (
    <div className="dynamic-embed-container w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Button Bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {sites.map((site, index) => (
          <button
            key={site.title || index} // Use title or index as key
            onClick={() => handleButtonClick(index)}
            className={`
              px-5 py-2 rounded-full border text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
              transition-all duration-300 ease-in-out transform
              hover:scale-105 hover:shadow-md active:scale-95
              ${
                currentIndex === index
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' // Active state
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400' // Inactive state
              }
            `}
            aria-current={currentIndex === index ? 'page' : undefined}
          >
            {site.title}
          </button>
        ))}
      </div>

      {/* Embed Frame Wrapper with Animation */}
      <div className="embed-frame-wrapper relative">
        {/*
          Using the `key` prop forces React to re-mount the component when `currentIndex` changes.
          This allows the `animate-fade-in` class to run each time a new iframe is selected.
          The outer div handles potential layout shifts and positioning.
        */}
        {currentSite && (
          <div
            key={currentIndex} // Force re-mount on index change for animation
            className="animate-fade-in" // Apply the custom fade-in animation
          >
            <EmbedFrame
              src={currentSite.src}
              title={currentSite.title}
              width={currentSite.width}
              height={currentSite.height} // You might want a default height here
              sandbox={currentSite.sandbox}
              style={currentSite.style}
              className={currentSite.className}
            />
          </div>
        )}
        {currentIndex === null && (
             <div className="text-center text-gray-500 py-10">
                Please select a website to view.
            </div>
        )}
      </div>
    </div>
  );
}