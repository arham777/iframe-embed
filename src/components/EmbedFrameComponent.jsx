// EmbedFrameComponent.jsx
// A reusable React component to embed any website via iframe, plus a dynamic selector
// Uses Tailwind CSS for styling
// Place this file in your Website2 project: src/components/EmbedFrameComponent.jsx

import React, { useState, useRef } from 'react';

/**
 * EmbedFrame: Displays a single iframe with loading overlay
 */
export const EmbedFrame = ({
  src,
  title,
  width = '100%',
  height = '100vh',
  sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox',
  style = {},
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ width, height, ...style }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <span>Loading…</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        height="100%"
        sandbox={sandbox}
        className="border-0"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

/**
 * DynamicEmbed: Renders buttons for each site and shows one iframe at a time
 * Props:
 *  - sites: Array of { src, title, width?, height?, sandbox?, style?, className? }
 */
export default function DynamicEmbed({ sites = [] }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  if (!sites.length) {
    return <p className="text-gray-500">No sites configured to embed.</p>;
  }

  return (
    <div className="dynamic-embed-container">
      <div className="flex flex-wrap gap-2 mb-4">
        {sites.map((site, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`px-4 py-2 rounded focus:outline-none transition-colors duration-200 \
              ${currentIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {site.title}
          </button>
        ))}
      </div>
      <div className="embed-frame-wrapper">
        {currentIndex !== null && (
          <EmbedFrame
            src={sites[currentIndex].src}
            title={sites[currentIndex].title}
            width={sites[currentIndex].width}
            height={sites[currentIndex].height}
            sandbox={sites[currentIndex].sandbox}
            style={sites[currentIndex].style}
            className={sites[currentIndex].className}
          />
        )}
      </div>
    </div>
  );
}
