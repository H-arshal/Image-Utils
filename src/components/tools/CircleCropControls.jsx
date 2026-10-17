import React, { useState, useEffect } from 'react';

export default function CircleCropControls({ originalWidth, originalHeight, onChange }) {
  const minDim = Math.min(originalWidth, originalHeight);
  const [radius, setRadius] = useState(Math.round(minDim / 2));
  const [zoom, setZoom] = useState(1);
  const [centerX, setCenterX] = useState(Math.round(originalWidth / 2));
  const [centerY, setCenterY] = useState(Math.round(originalHeight / 2));

  useEffect(() => {
    onChange({
      centerX,
      centerY,
      radius,
      zoom
    });
  }, [centerX, centerY, radius, zoom]);

  const recenter = () => {
    setCenterX(Math.round(originalWidth / 2));
    setCenterY(Math.round(originalHeight / 2));
    setRadius(Math.round(minDim / 2));
    setZoom(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="control-group">
        <label className="control-label">
          <span>Diameter (px)</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {radius * 2} px
          </span>
        </label>
        <input
          type="range"
          min={30}
          max={minDim / 2}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="control-label">
          <span>Zoom</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {zoom.toFixed(1)}x
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <div className="control-group">
          <label className="control-label">Center X</label>
          <input
            type="number"
            className="control-input mono"
            value={centerX}
            onChange={(e) => setCenterX(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div className="control-group">
          <label className="control-label">Center Y</label>
          <input
            type="number"
            className="control-input mono"
            value={centerY}
            onChange={(e) => setCenterY(parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>

      <button
        type="button"
        className="button-secondary"
        onClick={recenter}
      >
        Re-center circle
      </button>

      <div style={{ background: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        Exported as PNG with transparent outer corners.
      </div>
    </div>
  );
}
