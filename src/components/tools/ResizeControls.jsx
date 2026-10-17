import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';

export default function ResizeControls({ originalWidth, originalHeight, onChange }) {
  const [width, setWidth] = useState(originalWidth);
  const [height, setHeight] = useState(originalHeight);
  const [lockAspect, setLockAspect] = useState(true);

  const aspectRatio = originalWidth / originalHeight;

  useEffect(() => {
    setWidth(originalWidth);
    setHeight(originalHeight);
  }, [originalWidth, originalHeight]);

  useEffect(() => {
    onChange({ width: Math.round(width), height: Math.round(height) });
  }, [width, height]);

  const handleWidthChange = (val) => {
    const num = Math.max(1, parseInt(val, 10) || 1);
    setWidth(num);
    if (lockAspect) {
      setHeight(Math.round(num / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    const num = Math.max(1, parseInt(val, 10) || 1);
    setHeight(num);
    if (lockAspect) {
      setWidth(Math.round(num * aspectRatio));
    }
  };

  const applyPercent = (pct) => {
    const newW = Math.round((originalWidth * pct) / 100);
    const newH = Math.round((originalHeight * pct) / 100);
    setWidth(newW);
    setHeight(newH);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="control-group">
        <label className="control-label">
          <span>Width (px)</span>
          <span className="mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            Orig: {originalWidth}px
          </span>
        </label>
        <input
          type="number"
          className="control-input mono"
          value={width}
          onChange={(e) => handleWidthChange(e.target.value)}
          min={1}
          max={10000}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => setLockAspect(!lockAspect)}
          className={`pill-btn ${lockAspect ? 'is-active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px'
          }}
        >
          {lockAspect ? <Lock size={13} /> : <Unlock size={13} />}
          <span>{lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}</span>
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">
          <span>Height (px)</span>
          <span className="mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            Orig: {originalHeight}px
          </span>
        </label>
        <input
          type="number"
          className="control-input mono"
          value={height}
          onChange={(e) => handleHeightChange(e.target.value)}
          min={1}
          max={10000}
        />
      </div>

      <div className="control-group">
        <label className="control-label">Presets</label>
        <div className="preset-pills">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              className="pill-btn"
              onClick={() => applyPercent(pct)}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
