import React, { useState } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ToolGrid from './components/ToolGrid';
import Workspace from './components/Workspace';
import { CheckCircle2 } from 'lucide-react';
import { createSampleLandscape } from './utils/sampleImages';

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [activeTool, setActiveTool] = useState('resize');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectToolFromGrid = (toolId) => {
    setActiveTool(toolId);
    if (!imageData) {
      const dataUrl = createSampleLandscape();
      const img = new Image();
      img.onload = () => {
        setImageData({
          file: null,
          dataUrl,
          name: 'sample-landscape.jpg',
          size: 420 * 1024,
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: 'image/jpeg'
        });
      };
      img.src = dataUrl;
    }
  };

  return (
    <div className="app-container">
      <Header onReset={() => setImageData(null)} />

      <main className="main-content">
        {!imageData ? (
          <div>
            <div className="hero-section">
              <h1 className="hero-title">Everyday image tools. Simple, private, in-browser.</h1>
              <p className="hero-subtitle">
                Make quick adjustments, resize, compress, and convert formats directly inside your browser.
              </p>
            </div>

            <Dropzone onFileLoaded={(data) => setImageData(data)} />

            <ToolGrid onSelectTool={handleSelectToolFromGrid} />
          </div>
        ) : (
          <Workspace
            imageData={imageData}
            initialTool={activeTool}
            onBack={() => setImageData(null)}
            onShowToast={showToast}
          />
        )}
      </main>

      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={16} color="var(--color-success)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
