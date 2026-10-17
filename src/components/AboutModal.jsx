import React from 'react';
import { X, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="logo-icon-box" style={{ width: '28px', height: '28px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                <circle cx="17.5" cy="6.5" r="2.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>About Image Utility</h3>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <strong>Image Utility</strong> is a clean, client-side image editor designed for everyday tasks without uploading your personal files to a server.
          </p>

          <div className="about-features-grid">
            <div className="about-feature-item">
              <ShieldCheck size={20} color="var(--color-accent)" />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>100% Client-Side Privacy</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  All image operations happen locally via browser Canvas 2D and Web Workers.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <Zap size={20} color="var(--color-accent)" />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Instant Processing</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  No network upload latency or bandwidth caps. Changes render in real-time.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <Lock size={20} color="var(--color-accent)" />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Zero Data Retention</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  Closing the tab wipes all intermediate image buffers from device memory.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="button-primary" onClick={onClose} style={{ width: 'auto', padding: '6px 20px' }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
