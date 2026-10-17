import React, { useState, useEffect } from 'react';

export default function ConvertControls({ onChange }) {
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    onChange({
      targetFormat: format,
      quality: quality / 100,
      bgColor
    });
  }, [format, quality, bgColor]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="control-group">
        <label className="control-label">Target format</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          {[
            { id: 'image/png', label: 'PNG' },
            { id: 'image/jpeg', label: 'JPEG' },
            { id: 'image/webp', label: 'WebP' }
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`pill-btn ${format === fmt.id ? 'is-active' : ''}`}
              onClick={() => setFormat(fmt.id)}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {format !== 'image/png' && (
        <div className="control-group">
          <label className="control-label">
            <span>Encoding quality</span>
            <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              {quality}%
            </span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
          />
        </div>
      )}

      {format === 'image/jpeg' && (
        <div className="control-group">
          <label className="control-label">
            <span>Background fill (for transparent PNG)</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
              {bgColor.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            JPEG does not support transparency; transparent areas are filled with this color.
          </span>
        </div>
      )}
    </div>
  );
}
