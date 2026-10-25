import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Lock, ExternalLink, MessageSquare, CheckCircle2, Code2, Sparkles, Globe } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'privacy' | 'developer'

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-logo-icon-box">
              <picture>
                <source type="image/webp" srcSet="/logo-48.webp" />
                <img src="/logo-48.png" alt="Image Utility Logo" className="modal-logo-img" width="48" height="48" />
              </picture>
            </div>
            <div>
              <h3 id="about-modal-title" className="modal-title-text">Image Utility</h3>
              <span className="modal-title-sub">v1.0.0 • 100% In-Browser</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close dialogue"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'about' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'developer' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('developer')}
          >
            Developer
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'about' && (
            <div className="about-tab-content">
              <p className="about-hero-p">
                <strong>Image Utility</strong> is a lightweight, professional suite of 13 everyday image editing and conversion utilities that run directly inside your web browser. Zero server uploads, zero network latency, and zero tracking.
              </p>

              <div className="about-features-grid">
                <div className="about-feature-item">
                  <div className="about-feature-icon-box">
                    <ShieldCheck size={18} color="var(--color-accent)" />
                  </div>
                  <div className="about-feature-text">
                    <h4>100% In-Browser Processing</h4>
                    <p>
                      All pixel operations execute locally using HTML5 Canvas 2D and client-side memory buffers. Your original files never touch any external server.
                    </p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="about-feature-icon-box">
                    <Zap size={18} color="var(--color-accent)" />
                  </div>
                  <div className="about-feature-text">
                    <h4>Instant Real-Time Results</h4>
                    <p>
                      Zero upload queue and no bandwidth bottlenecks. Live visual updates with instant client-side downloads for single files or ZIP packages.
                    </p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="about-feature-icon-box">
                    <Lock size={18} color="var(--color-accent)" />
                  </div>
                  <div className="about-feature-text">
                    <h4>Zero Data Retention</h4>
                    <p>
                      No database, no cookies, and no cloud caching. Closing your browser tab or navigating home immediately frees all image memory buffers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="about-cta-note">
                <span>Want to know more about the vision behind this project?</span>
                <button
                  type="button"
                  className="about-inline-tab-link"
                  onClick={() => setActiveTab('developer')}
                >
                  Meet the Developer →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="privacy-tab-content">
              <div className="policy-section-card">
                <h4 className="policy-section-title">
                  <span className="policy-section-num">1</span>
                  Local Image Processing Guarantee
                </h4>
                <p className="policy-section-body">
                  When you drag or select an image, it is read into browser memory via FileReader and manipulated locally on an HTML5 Canvas. <strong>Your images, filenames, and metadata are never uploaded to any remote server or third-party cloud.</strong>
                </p>
              </div>

              <div className="policy-section-card">
                <h4 className="policy-section-title">
                  <span className="policy-section-num">2</span>
                  Zero Tracking, Analytics & Cookies
                </h4>
                <p className="policy-section-body">
                  Image Utility contains no tracking cookies, analytics scripts, advertising beacons, or telemetry. Web typography is served with preconnected Google Fonts CDN links.
                </p>
              </div>

              <div className="policy-section-card">
                <h4 className="policy-section-title">
                  <span className="policy-section-num">3</span>
                  Safe Sandbox Specifications
                </h4>
                <ul className="policy-checklist">
                  <li>
                    <CheckCircle2 size={15} color="var(--color-accent)" className="policy-check-icon" />
                    <span><strong>50 MB File Size Ceiling:</strong> Prevents client-side RAM exhaustion on mobile devices.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--color-accent)" className="policy-check-icon" />
                    <span><strong>12,000 px Max Dimension:</strong> Constrained to safe hardware canvas boundaries.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--color-accent)" className="policy-check-icon" />
                    <span><strong>Supported Inputs:</strong> JPG, PNG, WebP, GIF, and BMP (SVG vector code is excluded for security).</span>
                  </li>
                  <li>
                    <CheckCircle2 size={15} color="var(--color-accent)" className="policy-check-icon" />
                    <span><strong>Supported Outputs:</strong> PNG, JPEG, WebP, BMP, AVIF, TIFF, ICO, PDF, and 7-file ZIP Favicon bundles.</span>
                  </li>
                </ul>
              </div>

              <div className="policy-section-card">
                <h4 className="policy-section-title">
                  <span className="policy-section-num">4</span>
                  Feedback & Open Source
                </h4>
                <p className="policy-section-body">
                  Have a suggestion or encountered a bug? Open an issue on GitHub:
                </p>
                <a
                  href="https://github.com/H-arshal/Image-Utils/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-github-cta"
                >
                  <MessageSquare size={15} />
                  <span>Report an Issue or Feedback on GitHub</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="developer-tab-content">
              {/* Profile Card */}
              <div className="developer-profile-card">
                <div className="developer-profile-top">
                  <div className="developer-avatar-box">
                    <span className="developer-avatar-initial">H</span>
                  </div>
                  <div className="developer-profile-details">
                    <div className="developer-name-row">
                      <h4 className="developer-name">Harshal Moon</h4>
                      <span className="developer-badge">Creator & Developer</span>
                    </div>
                    <p className="developer-title">Software Engineer & Cybersecurity Researcher</p>
                  </div>
                </div>
                <p className="developer-bio">
                  Software engineer and cybersecurity researcher passionate about building high-performance, privacy-first web utilities with clean design and zero server footprint. Built <strong>Image Utility</strong> to give creators and developers an instant, reliable image manipulation toolkit that respects their data and executes entirely in their local browser sandbox.
                </p>
              </div>

              {/* Engineering Highlights */}
              <div className="developer-section-card">
                <h5 className="developer-section-subtitle">
                  <Sparkles size={15} color="var(--color-accent)" />
                  Core Engineering Principles
                </h5>
                <div className="developer-pillars-grid">
                  <div className="developer-pillar">
                    <strong>100% Client-Side Architecture</strong>
                    <p>Zero file uploads to external clouds. Pixel computations happen entirely in browser memory using HTML5 Canvas 2D.</p>
                  </div>
                  <div className="developer-pillar">
                    <strong>Zero Friction & Real-Time</strong>
                    <p>Instant drag-and-drop workflow with zero wait queues, no accounts, and no intrusive subscriptions or paywalls.</p>
                  </div>
                  <div className="developer-pillar">
                    <strong>Thoughtful Craftsmanship</strong>
                    <p>Designed with clean typography, responsive ergonomics, and lightweight bundle optimization.</p>
                  </div>
                </div>
              </div>

              {/* Source Code & Connect Links */}
              <div className="developer-section-card">
                <h5 className="developer-section-subtitle">
                  <Code2 size={15} color="var(--color-accent)" />
                  Connect & Source Code
                </h5>
                <p className="developer-subtext">
                  Explore projects, view open-source code, or connect across profiles:
                </p>
                <div className="developer-links-cluster">
                  <a
                    href="https://h-arshal.github.io/Portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-action-btn primary"
                  >
                    <div className="developer-action-btn-left">
                      <Globe size={15} />
                      <span>Harshal Moon - Portfolio Website</span>
                    </div>
                    <ExternalLink size={13} />
                  </a>

                  <a
                    href="https://github.com/h-arshal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-action-btn"
                  >
                    <div className="developer-action-btn-left">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>Follow @h-arshal on GitHub</span>
                    </div>
                    <ExternalLink size={13} />
                  </a>

                  <a
                    href="https://github.com/H-arshal/Image-Utils"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-action-btn"
                  >
                    <div className="developer-action-btn-left">
                      <Code2 size={15} />
                      <span>Image-Utils GitHub Repository</span>
                    </div>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Social Handles Tray */}
                <div className="developer-socials-tray">
                  <span className="developer-socials-label">Social Handles:</span>
                  <div className="developer-social-pills">
                    <a
                      href="https://h-arshal.github.io/Portfolio/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="developer-social-pill"
                      title="Portfolio Website"
                    >
                      <Globe size={13} />
                      <span>Portfolio</span>
                    </a>
                    <a
                      href="https://github.com/h-arshal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="developer-social-pill"
                      title="GitHub @h-arshal"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/harshal-moon-064956174/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="developer-social-pill"
                      title="LinkedIn Profile"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://leetcode.com/u/harshal_jaipal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="developer-social-pill"
                      title="LeetCode Profile"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                      </svg>
                      <span>LeetCode</span>
                    </a>
                    <a
                      href="https://www.instagram.com/harshal.moon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="developer-social-pill"
                      title="Instagram @harshal.moon"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="modal-footer-badge">
            <span className="status-dot-green" />
            <span>100% Client-Side Safe</span>
          </div>

          <div className="modal-footer-socials" aria-label="Harshal's Social Links">
            <span className="modal-footer-socials-label">Connect:</span>
            <a
              href="https://h-arshal.github.io/Portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-footer-social-btn"
              aria-label="Harshal Moon Portfolio"
              title="Portfolio Website"
            >
              <Globe size={13} />
            </a>
            <a
              href="https://github.com/h-arshal"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-footer-social-btn"
              aria-label="GitHub (@h-arshal)"
              title="GitHub (@h-arshal)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/harshal-moon-064956174/"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-footer-social-btn"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://leetcode.com/u/harshal_jaipal/"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-footer-social-btn"
              aria-label="LeetCode Profile"
              title="LeetCode (@harshal_jaipal)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/harshal.moon"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-footer-social-btn"
              aria-label="Instagram Profile"
              title="Instagram (@harshal.moon)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <button
            type="button"
            className="button-primary modal-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

