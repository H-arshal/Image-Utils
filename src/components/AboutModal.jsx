import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Lock, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import logoIcon from '../assets/Orange Pixel Landscape Icon.png';

export default function AboutModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'privacy'

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="logo-icon-box" style={{ width: '28px', height: '28px' }}>
              <img src={logoIcon} alt="Image Utility Logo" className="logo-icon-img" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Image Utility</h3>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 24px', borderBottom: '1px solid var(--color-border)' }}>
          <button
            type="button"
            className={`pill-btn ${activeTab === 'about' ? 'is-active' : ''}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'about' ? '2px solid var(--color-accent)' : '2px solid transparent', background: 'transparent', padding: '10px 16px', fontWeight: 600 }}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            type="button"
            className={`pill-btn ${activeTab === 'privacy' ? 'is-active' : ''}`}
            style={{ borderRadius: '0', borderBottom: activeTab === 'privacy' ? '2px solid var(--color-accent)' : '2px solid transparent', background: 'transparent', padding: '10px 16px', fontWeight: 600 }}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy & Terms
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'about' ? (
            <div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>
                <strong>Image Utility</strong> is a lightweight, professional suite of image editing tools designed for everyday tasks. Everything runs directly inside your web browser.
              </p>

              <div className="about-features-grid">
                <div className="about-feature-item">
                  <ShieldCheck size={20} color="var(--color-accent)" />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>100% In-Browser Processing</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      All operations happen locally using HTML5 Canvas 2D and client-side memory buffers.
                    </p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <Zap size={20} color="var(--color-accent)" />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Instant Real-Time Results</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      Zero network upload latency, no bandwidth caps, and lightning-fast client-side downloads.
                    </p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <Lock size={20} color="var(--color-accent)" />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Zero Data Retention</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      No cloud storage or databases. Closing your browser tab immediately frees all image memory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  1. Local Image Processing Guarantee
                </h4>
                <p>
                  We believe your photos and graphics belong to you. When you load an image into Image Utility, your files are read locally using your browser's FileReader and rendered onto an HTML5 Canvas context. <strong>Your images, filenames, and metadata are never uploaded to any remote server or third-party cloud.</strong>
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  2. No Tracking, Analytics, or Cookies
                </h4>
                <p>
                  Image Utility does not use tracking cookies, advertising trackers, or fingerprinting scripts. There is no tracking of user activity. Web fonts are served via Google Fonts with preconnected CDN links.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  3. Memory & Limitations
                </h4>
                <p>
                  Because processing happens entirely within your browser's sandbox:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                  <li>File size is capped at 50 MB to prevent client-side memory exhaustion.</li>
                  <li>Images are constrained to safe browser canvas dimensions (up to 12,000 px).</li>
                  <li>Supported formats: JPG, PNG, WebP, GIF, and BMP (SVG vector files are excluded to maintain canvas security).</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  4. Feedback & Open Source Contact
                </h4>
                <p>
                  Found a bug or want to suggest a feature? Visit our project repository on GitHub:
                </p>
                <a
                  href="https://github.com/H-arshal/Image-Utils/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontWeight: 600, marginTop: '4px', textDecoration: 'none' }}
                >
                  <MessageSquare size={14} />
                  <span>Report an Issue or Feedback on GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            v1.0.0 • 100% Client-Side
          </span>
          <button type="button" className="button-primary" onClick={onClose} style={{ width: 'auto', padding: '6px 20px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
