import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ToolGrid from './components/ToolGrid';
import Workspace from './components/Workspace';
import AboutModal from './components/AboutModal';
import { CheckCircle2 } from 'lucide-react';
import { createSampleLandscape } from './utils/sampleImages';
import logoIcon from './assets/Orange Pixel Landscape Icon.png';

const TOOL_TITLES = {
  resize: 'Resize Image',
  compress: 'Compress Image',
  crop: 'Crop Image',
  circle: 'Circle Crop',
  radius: 'Corner Radius',
  border: 'Add Border',
  adjust: 'Adjust & Filters',
  rotate: 'Rotate & Flip',
  convert: 'Convert Format',
  watermark: 'Add Watermark',
  pdf: 'Image to PDF',
  metadata: 'Metadata Stripper'
};

/**
 * Route handler for individual tool pages (e.g. /crop, /circle, /compress)
 */
function ToolRouteWrapper({ imageData, setImageData, onShowToast }) {
  const { toolId } = useParams();
  const navigate = useNavigate();

  // If user lands directly on a tool URL without an image in state, load default sample
  useEffect(() => {
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
  }, [imageData, setImageData]);

  if (!imageData) {
    return null;
  }

  const activeTool = toolId && TOOL_TITLES[toolId] ? toolId : 'resize';

  return (
    <Workspace
      imageData={imageData}
      initialTool={activeTool}
      currentTool={activeTool}
      onToolChange={(newTool) => navigate(`/${newTool}`)}
      onBack={() => {
        setImageData(null);
        navigate('/');
      }}
      onShowToast={onShowToast}
      onFileLoaded={(data) => setImageData(data)}
    />
  );
}

/**
 * Route handler for root /
 */
function HomeRoute({ imageData, setImageData }) {
  const navigate = useNavigate();

  const handleSelectToolFromGrid = (toolId) => {
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
        navigate(`/${toolId}`);
      };
      img.src = dataUrl;
    } else {
      navigate(`/${toolId}`);
    }
  };

  const handleFileLoadedOnHome = (data) => {
    setImageData(data);
    navigate('/resize');
  };

  return (
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

      <Dropzone onFileLoaded={handleFileLoadedOnHome} />

      <ToolGrid onSelectTool={handleSelectToolFromGrid} />
    </div>
  );
}

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update dynamic document title based on active route for SEO
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '');
    if (path && TOOL_TITLES[path]) {
      document.title = `${TOOL_TITLES[path]} | Image Utility`;
    } else {
      document.title = 'Image Utility | Client-Side Image Tools';
    }
  }, [location.pathname]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleResetToHome = () => {
    setImageData(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <Header
        onReset={handleResetToHome}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomeRoute
                imageData={imageData}
                setImageData={setImageData}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/:toolId"
            element={
              <ToolRouteWrapper
                imageData={imageData}
                setImageData={setImageData}
                onShowToast={showToast}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
