import React, { useState, useEffect } from 'react';

export default function CompressControls({ originalSize, onChange }) {
  const [mode, setMode] = useState('target'); // 'target' or 'manual'
  const [targetKb, setTargetKb] = useState(
    Math.max(50, Math.round((originalSize / 1024) * 0.4))
  );
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState('image/jpeg');

  useEffect(() => {
    onChange({
      mode,
      targetBytes: targetKb * 1024,
      quality: quality / 100,
      mimeType: format
    });
  }, [mode, targetKb, quality, format]);

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">Compression Mode</label>
        <div className="inputs-2col-grid">
          <button
            type="button"
            className={`pill-btn ${mode === 'target' ? 'is-active' : ''}`}
            onClick={() => setMode('target')}
          >
            Target file size
          </button>
          <button
            type="button"
            className={`pill-btn ${mode === 'manual' ? 'is-active' : ''}`}
            onClick={() => setMode('manual')}
          >
            Quality slider
          </button>
        </div>
      </div>

      {mode === 'target' ? (
        <div className="control-group">
          <label className="input-header-label">
            <span>Target size (KB)</span>
            <span className="mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              Target: {targetKb} KB
            </span>
          </label>
          <input
            type="number"
            className="control-input mono"
            value={targetKb}
            onChange={(e) => setTargetKb(Math.max(10, parseInt(e.target.value, 10) || 10))}
            min={10}
            step={50}
          />
          <div className="preset-pills" style={{ marginTop: '8px' }}>
            {[100, 200, 500, 1000].map((kb) => (
              <button
                key={kb}
                type="button"
                className={`pill-btn ${targetKb === kb ? 'is-active' : ''}`}
                onClick={() => setTargetKb(kb)}
              >
                {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="control-group">
          <label className="input-header-label">
            <span>Quality</span>
            <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              {quality}%
            </span>
          </label>
          <input
            type="range"
            min={5}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            <span>Smaller size</span>
            <span>Higher quality</span>
          </div>
        </div>
      )}

      <div className="control-group">
        <label className="input-header-label">Format</label>
        <div className="inputs-2col-grid">
          <button
            type="button"
            className={`pill-btn ${format === 'image/jpeg' ? 'is-active' : ''}`}
            onClick={() => setFormat('image/jpeg')}
          >
            JPEG
          </button>
          <button
            type="button"
            className={`pill-btn ${format === 'image/webp' ? 'is-active' : ''}`}
            onClick={() => setFormat('image/webp')}
          >
            WebP
          </button>
        </div>
      </div>
    </div>
  );
}
