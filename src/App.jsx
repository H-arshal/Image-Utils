import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import ToolGrid from './components/ToolGrid';
import FAQSection from './components/FAQSection';
import { CheckCircle2 } from 'lucide-react';
import { createSampleLandscape } from './utils/sampleImages';
import heroBadgeWebp from './assets/hero-badge.webp';
import heroBadgeWebp2x from './assets/hero-badge@2x.webp';

const Workspace = lazy(() => import('./components/Workspace'));
const AboutModal = lazy(() => import('./components/AboutModal'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const NotFound = lazy(() => import('./components/NotFound'));

const ROUTE_SEO = {
  home: {
    title: 'Image Utils | Free In-Browser Image Utility & Tools (100% Private)',
    desc: 'Image Utils is a free, 100% private in-browser image utility. Resize, compress, crop, convert formats, and remove EXIF data without uploading. Fast, local & secure.',
  },
  resize: {
    title: 'Resize Image Online | Image Utility',
    desc: 'Resize image dimensions with aspect ratio lock or custom width and height. 100% private in-browser.',
  },
  compress: {
    title: 'Compress Image Online (Reduce KB) | Image Utility',
    desc: 'Compress images to a target file size or custom quality slider directly in your browser without quality loss.',
  },
  crop: {
    title: 'Crop Image Online (Freeform & Presets) | Image Utility',
    desc: 'Crop rectangular regions with 1:1, 16:9, 4:3, or custom freeform crop boxes with interactive handles.',
  },
  circle: {
    title: 'Circle Crop Image (Round Avatar Maker) | Image Utility',
    desc: 'Create circular profile pictures and avatars with transparent PNG output and interactive drag handles.',
  },
  radius: {
    title: 'Round Image Corners (Corner Radius) | Image Utility',
    desc: 'Add clean rounded corners to photos with transparent PNG or custom background fill.',
  },
  border: {
    title: 'Add Border to Image Online | Image Utility',
    desc: 'Add custom border frames with adjustable widths, colors, and corner radius directly in your browser.',
  },
  adjust: {
    title: 'Photo Adjustments & Filters Online | Image Utility',
    desc: 'Fine-tune exposure, contrast, saturation, warmth, vignette, blur, and 9 Instagram-style one-click photo filters.',
  },
  rotate: {
    title: 'Rotate & Flip Image Online | Image Utility',
    desc: 'Rotate photos 90°, 180°, 270° or mirror flip horizontally and vertically in-browser.',
  },
  convert: {
    title: 'Convert Image Format | Image Utility',
    desc: 'Convert seamlessly between PNG, JPEG, WebP, BMP, AVIF, TIFF, and ICO formats with custom quality and background fill.',
  },
  favicon: {
    title: 'Favicon Generator (.ICO & App Icons) | Image Utility',
    desc: 'Generate multi-resolution .ico favicons, 180x180 Apple Touch icons, Android PWA icons, and copy HTML embed snippet locally.',
  },
  watermark: {
    title: 'Add Watermark to Photo Online | Image Utility',
    desc: 'Protect photos with customizable text watermarks, opacity, positions, and styling client-side.',
  },
  pdf: {
    title: 'Convert Image to PDF Online | Image Utility',
    desc: 'Convert images to single-page A4, Letter, or fit-to-image printable PDF documents locally.',
  },
  metadata: {
    title: 'EXIF Metadata Stripper (Scrub GPS) | Image Utility',
    desc: 'Inspect and remove EXIF tags, GPS location coordinates, and camera device serial numbers for privacy.',
  },
  privacy: {
    title: 'Privacy Policy | Image Utility (100% Private)',
    desc: 'Read our zero-upload privacy policy. All image editing, resizing, compression, and conversions run 100% client-side in your browser RAM.',
  },
  terms: {
    title: 'Terms of Service | Image Utility',
    desc: 'Free, open-source image utility terms under the MIT License. No subscriptions, no hidden limits, and full copyright ownership of your media.',
  }
};

/**
 * Route handler for individual tool pages (e.g. /crop, /circle, /compress)
 */
function ToolRouteWrapper({ imageData, setImageData, onShowToast }) {
  const { toolId } = useParams();
  const navigate = useNavigate();

  const isValidTool = Boolean(toolId && ROUTE_SEO[toolId] && toolId !== 'home');

  // If user lands directly on a tool URL without an image in state, load default sample
  useEffect(() => {
    if (!isValidTool) return;
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
  }, [imageData, setImageData, isValidTool]);

  if (!isValidTool) {
    return <NotFound />;
  }

  if (!imageData) {
    return null;
  }

  return (
    <Workspace
      imageData={imageData}
      initialTool={toolId}
      currentTool={toolId}
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
          <picture>
            <source type="image/webp" srcSet={`${heroBadgeWebp} 1x, ${heroBadgeWebp2x} 2x`} />
            <img src={heroBadgeWebp} alt="Image Utility" className="hero-badge-icon" width="95" height="95" fetchpriority="high" />
          </picture>
        </div>
        <h1 className="hero-title">Everyday image tools. Simple, private, in-browser.</h1>
        <p className="hero-subtitle">
          Make quick adjustments, resize, compress, and convert formats directly inside your browser.
        </p>
      </div>

      <Dropzone onFileLoaded={handleFileLoadedOnHome} />

      <ToolGrid onSelectTool={handleSelectToolFromGrid} />

      <FAQSection />
    </div>
  );
}

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update dynamic document title, meta description, and canonical link based on active route for SEO
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '');
    const isKnownTool = path === '' || (ROUTE_SEO[path] && path !== 'home');
    const meta = isKnownTool
      ? (ROUTE_SEO[path] || ROUTE_SEO.home)
      : {
          title: '404 - Page Not Found | Image Utility',
          desc: 'The requested image tool or page could not be found. Explore our 13 client-side image editing tools.'
        };

    document.title = meta.title;

    // Update Meta Description
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', meta.desc);
    }

    // Dynamic Canonical URL (clean path without query strings or hash)
    const productionOrigin = 'https://www.image-utils.site';
    const cleanPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
    const canonicalHref = `${productionOrigin}${cleanPath}`;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalHref);
    }

    // Dynamic Robots Meta Tag: ensure 404s are not indexed
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', isKnownTool ? 'index, follow' : 'noindex, nofollow');

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.desc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalHref);

    // Update Twitter / X tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', meta.desc);
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
      {/* Accessibility: Skip to main content link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <Header
        onReset={handleResetToHome}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main id="main-content" className="main-content" role="main">
        <Suspense fallback={null}>
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
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* About Modal */}
      {isAboutOpen && (
        <Suspense fallback={null}>
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        </Suspense>
      )}

      {/* SEO Footer - crawlable internal links to all tool pages & legal pages */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-tools-section">
            <h2 className="footer-heading">All Tools</h2>
            <nav className="footer-tool-links" aria-label="Image tools">
              {Object.entries(ROUTE_SEO)
                .filter(([key]) => key !== 'home' && key !== 'privacy' && key !== 'terms')
                .map(([id, meta]) => (
                  <Link key={id} to={`/${id}`} className="footer-tool-link">
                    {meta.title.split(' | ')[0]}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} Image Utility by{' '}
              <a href="https://h-arshal.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">
                Harshal Moon
              </a>. 100% client-side. Zero data uploaded.
            </p>
            <div className="footer-ext-links">
              <a href="https://github.com/H-arshal/Image-Utils" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="footer-dot">·</span>
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-dot">·</span>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

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
