// src/App.jsx
import React from 'react';
import DynamicEmbed from './components/EmbedFrameComponent';

function App() {
  const sitesToEmbed = [
    {
      src: 'https://assessments.cybergen.com/',
      title: 'AI-Readiness Assessment',
      height: '800px'
    },
    // {
    //   src: 'https://capturebyarham.netlify.app',
    //   title: 'Capturebyarham',
    //   height: '600px'
    // },
    {
      src: 'https://cybergen-report.vercel.app/',
      title: 'Cybergen Branding Report',
      height: '600px'
    },
    {
      src: 'https://en.wikipedia.org/wiki/Main_Page',
      title: 'Wikipedia',
      height: '600px'
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Embedded Sites</h1>
      <DynamicEmbed sites={sitesToEmbed} />
    </div>
  );
}

export default App;
