import React, { useState, useEffect } from 'react';

const PRESETS = [
  { label: '8px', value: 8 },
  { label: '16px', value: 16 },
  { label: '24px', value: 24 },
  { label: '36px', value: 36 },
  { label: '48px', value: 48 },
  { label: '64px', value: 64 },
  { label: 'Full Pill', value: 'max' }
];

export default function CornerRadiusControls({ originalWidth, originalHeight, onChange }) {
  const maxRadius = Math.round(Math.min(originalWidth, originalHeight) / 2);
  const [radius, setRadius] = useState(24);
  const [bgColor, setBgColor] = useState('transparent');

  useEffect(() => {
    onChange({ radius, bgColor });
  }, [radius, bgColor]);

  const applyPreset = (preset) => {
    if (preset.value === 'max') {
      setRadius(maxRadius);
    } else {
      setRadius(Math.min(preset.value, maxRadius));
    }
  };

  const handleReset = () => {
    setRadius(0);
    setBgColor('transparent');
  };

  return (
    <div className="tool-controls-flow">
      {/* 1. Radius Slider */}
      <div className="control-group">
        <label className="input-header-label">
          <span>Corner Radius</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {radius} px
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={maxRadius}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10) || 0)}
        />
      </div>

      {/* 2. Quick Presets */}
      <div className="control-group">
        <label className="input-header-label">Quick Presets</label>
        <div className="preset-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PRESETS.map((p) => {
            const isSelected = p.value === 'max' ? radius === maxRadius : radius === p.value;
            return (
              <button
                key={p.label}
                type="button"
                className={`pill-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Outer Corner Fill */}
      <div className="control-group">
        <label className="input-header-label">Corner Background Fill</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={`pill-btn ${bgColor === 'transparent' ? 'is-active' : ''}`}
            onClick={() => setBgColor('transparent')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                border: '1px solid #d6d3d1',
                background:
                  'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px'
              }}
            />
            Transparent (PNG)
          </button>
          <button
            type="button"
            className={`pill-btn ${bgColor === '#ffffff' ? 'is-active' : ''}`}
            onClick={() => setBgColor('#ffffff')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: '#ffffff',
                border: '1px solid #d6d3d1'
              }}
            />
            White
          </button>
          <button
            type="button"
            className={`pill-btn ${bgColor === '#000000' ? 'is-active' : ''}`}
            onClick={() => setBgColor('#000000')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: '#000000',
                border: '1px solid #d6d3d1'
              }}
            />
            Black
          </button>
        </div>
      </div>

      {/* 4. Reset Button */}
      <button
        type="button"
        className="button-secondary"
        style={{ height: '38px' }}
        onClick={handleReset}
      >
        Reset corner radius
      </button>

      {/* Info notice */}
      <div
        style={{
          background: 'var(--color-surface-subtle)',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5
        }}
      >
        Corner clipping is rendered as clean anti-aliased curves. Exported as PNG with alpha transparency when transparent fill is selected.
      </div>
    </div>
  );
}
