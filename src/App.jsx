import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ToolGrid from './components/ToolGrid';
import Workspace from './components/Workspace';
import AboutModal from './components/AboutModal';
import { CheckCircle2 } from 'lucide-react';
import { createSampleLandscape } from './utils/sampleImages';
import logoIcon from './assets/Orange Pixel Landscape Icon.png';

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [activeTool, setActiveTool] = useState('resize');
  const [toastMessage, setToastMessage] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load default sample landscape (mountains.jpg) on initial launch to mirror the mockup design
  useEffect(() => {
    const dataUrl = createSampleLandscape();
    const img = new Image();
    img.onload = () => {
      setImageData({
        file: null,
        dataUrl,
        name: 'mountains.jpg',
        size: 2.4 * 1024 * 1024,
        width: 3840,
        height: 2160,
        type: 'image/jpeg'
      });
    };
    img.src = dataUrl;
  }, []);

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
          name: 'mountains.jpg',
          size: 2.4 * 1024 * 1024,
          width: 3840,
          height: 2160,
          type: 'image/jpeg'
        });
      };
      img.src = dataUrl;
    }
  };

  return (
    <div className="app-container">
      <Header
        onReset={() => setImageData(null)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="main-content">
        {!imageData ? (
          <div>
            <div className="hero-section">
              <div className="hero-badge-wrap">
                <img src={logoIcon} alt="Image Utility" className="hero-badge-icon" />
              </div>
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
            onFileLoaded={(data) => setImageData(data)}
          />
        )}
      </main>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={16} color="var(--color-success)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
