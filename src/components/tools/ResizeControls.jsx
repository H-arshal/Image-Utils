import React, { useState, useEffect } from 'react';
import { Lock, Link as LinkIcon } from 'lucide-react';

export default function ResizeControls({ originalWidth, originalHeight, onChange }) {
  const [width, setWidth] = useState(originalWidth);
  const [height, setHeight] = useState(originalHeight);
  const [lockAspect, setLockAspect] = useState(true);
  const [activePreset, setActivePreset] = useState(null);

  const aspectRatio = originalWidth / originalHeight;

  useEffect(() => {
    setWidth(originalWidth);
    setHeight(originalHeight);
  }, [originalWidth, originalHeight]);

  useEffect(() => {
    onChange({ width: Math.round(width), height: Math.round(height) });
  }, [width, height]);

  const handleWidthChange = (val) => {
    setActivePreset(null);
    const num = Math.max(1, parseInt(val, 10) || 1);
    setWidth(num);
    if (lockAspect) {
      setHeight(Math.round(num / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    setActivePreset(null);
    const num = Math.max(1, parseInt(val, 10) || 1);
    setHeight(num);
    if (lockAspect) {
      setWidth(Math.round(num * aspectRatio));
    }
  };

  const applyPercent = (pct) => {
    setActivePreset(pct);
    const newW = Math.round((originalWidth * pct) / 100);
    const newH = Math.round((originalHeight * pct) / 100);
    setWidth(newW);
    setHeight(newH);
  };

  return (
    <div className="tool-controls-flow">
      {/* Aspect Ratio Lock Toggle */}
      <div className="aspect-ratio-row">
        <div className="aspect-ratio-label">
          <Lock size={15} color="var(--color-text-secondary)" />
          <span>Aspect Ratio Lock</span>
        </div>
        <button
          type="button"
          className={`switch-toggle ${lockAspect ? 'is-checked' : ''}`}
          onClick={() => setLockAspect(!lockAspect)}
          aria-label="Toggle Aspect Ratio Lock"
        >
          <span className="switch-thumb" />
        </button>
      </div>

      {/* Width and Height with Link Icon */}
      <div className="dimension-inputs-row">
        <div className="dimension-field">
          <label className="input-header-label">Width</label>
          <div className="input-with-suffix">
            <input
              type="number"
              className="mono"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              min={1}
              max={10000}
            />
            <span className="input-suffix">px</span>
          </div>
        </div>

        <button
          type="button"
          className="link-icon-btn"
          onClick={() => setLockAspect(!lockAspect)}
          title={lockAspect ? 'Aspect ratio linked' : 'Aspect ratio unlinked'}
        >
          <LinkIcon size={16} color="var(--color-accent)" />
        </button>

        <div className="dimension-field">
          <label className="input-header-label">Height</label>
          <div className="input-with-suffix">
            <input
              type="number"
              className="mono"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              min={1}
              max={10000}
            />
            <span className="input-suffix">px</span>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="presets-block">
        <label className="input-header-label">Presets</label>
        <div className="preset-grid-4">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              className={`preset-btn-item ${activePreset === pct ? 'is-active' : ''}`}
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
