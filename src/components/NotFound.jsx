import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import logoIcon from '../assets/Orange Pixel Landscape Icon.png';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '560px',
      margin: '60px auto',
      textAlign: 'center',
      padding: '40px 24px',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--color-accent-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>
        <img src={logoIcon} alt="Image Utility Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
      </div>

      <span className="mono" style={{
        fontSize: '0.875rem',
        fontWeight: 700,
        color: 'var(--color-accent)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        404 Error
      </span>

      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        color: 'var(--color-text)',
        margin: '8px 0 12px 0'
      }}>
        Page Not Found
      </h2>

      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5,
        marginBottom: '28px'
      }}>
        The page or tool route you are looking for doesn't exist or may have been moved.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="button-primary"
          style={{ width: 'auto', padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onClick={() => navigate('/')}
        >
          <Home size={16} />
          <span>Back to Home & Tools</span>
        </button>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Popular Utilities: </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          {[
            { id: 'resize', label: 'Resize' },
            { id: 'compress', label: 'Compress' },
            { id: 'crop', label: 'Crop' },
            { id: 'circle', label: 'Circle Crop' },
            { id: 'convert', label: 'Convert' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn-sample"
              onClick={() => navigate(`/${t.id}`)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
