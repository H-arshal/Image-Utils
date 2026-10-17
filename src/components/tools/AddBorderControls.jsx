import React, { useState, useEffect } from 'react';

export default function AddBorderControls({ onChange }) {
  const [borderWidth, setBorderWidth] = useState(16);
  const [borderColor, setBorderColor] = useState('#c65d21');
  const [radius, setRadius] = useState(12);

  useEffect(() => {
    onChange({ borderWidth, borderColor, radius });
  }, [borderWidth, borderColor, radius]);

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">
          <span>Border Width</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{borderWidth} px</span>
        </label>
        <input
          type="range"
          min={0}
          max={60}
          value={borderWidth}
          onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">
          <span>Corner Radius</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{radius} px</span>
        </label>
        <input
          type="range"
          min={0}
          max={64}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">Border Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'transparent'
            }}
          />
          <span className="mono" style={{ fontSize: '0.8125rem' }}>{borderColor.toUpperCase()}</span>
          <div className="preset-pills" style={{ marginLeft: 'auto' }}>
            {['#c65d21', '#111827', '#ffffff', '#2563eb', '#15803d'].map((c) => (
              <button
                key={c}
                type="button"
                className="pill-btn"
                style={{ width: '22px', height: '22px', padding: 0, backgroundColor: c, border: '1px solid #d6d3d1' }}
                onClick={() => setBorderColor(c)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
