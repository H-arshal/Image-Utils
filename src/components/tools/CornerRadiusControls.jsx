import React, { useState, useEffect } from 'react';

export default function CornerRadiusControls({ originalWidth, originalHeight, onChange }) {
  const maxRadius = Math.round(Math.min(originalWidth, originalHeight) / 2);
  const [radius, setRadius] = useState(Math.round(maxRadius * 0.2));

  useEffect(() => {
    onChange({ radius });
  }, [radius]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="control-group">
        <label className="control-label">
          <span>Radius (px)</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {radius} px
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={maxRadius}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="control-label">Presets</label>
        <div className="preset-pills">
          {[16, 32, 64, 128, maxRadius].map((r, idx) => (
            <button
              key={r + '-' + idx}
              type="button"
              className={`pill-btn ${radius === r ? 'is-active' : ''}`}
              onClick={() => setRadius(r)}
            >
              {idx === 4 ? 'Max (Pill)' : `${r}px`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        Exported as PNG to preserve transparent cutouts outside the rounded corners.
      </div>
    </div>
  );
}
