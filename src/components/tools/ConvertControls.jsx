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
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">Target format</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { id: 'image/png', label: 'PNG' },
            { id: 'image/jpeg', label: 'JPEG' },
            { id: 'image/webp', label: 'WebP' }
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`pill-btn ${format === fmt.id ? 'is-active' : ''}`}
              style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setFormat(fmt.id)}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {format !== 'image/png' && (
        <div className="control-group">
          <label className="input-header-label">
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
          <label className="input-header-label">
            <span>Background fill (for transparent PNG)</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: '36px',
                height: '36px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-text)', fontWeight: 500 }}>
              {bgColor.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            JPEG does not support transparency; transparent areas are filled with this color.
          </span>
        </div>
      )}
    </div>
  );
}
