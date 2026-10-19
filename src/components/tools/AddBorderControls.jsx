import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { hasImageTransparency } from '../../utils/canvasEngine';

export default function AddBorderControls({ imgElement, onChange }) {
  const [borderWidth, setBorderWidth] = useState(16);
  const [borderColor, setBorderColor] = useState('#c65d21');
  const [radius, setRadius] = useState(12);
  const [mode, setMode] = useState('auto'); // 'auto' | 'frame'
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    if (imgElement) {
      const transparent = hasImageTransparency(imgElement);
      setIsTransparent(transparent);
    }
  }, [imgElement]);

  useEffect(() => {
    onChange({
      borderWidth,
      borderColor,
      radius,
      mode: mode === 'auto' ? (isTransparent ? 'contour' : 'frame') : mode
    });
  }, [borderWidth, borderColor, radius, mode, isTransparent, onChange]);

  const activeMode = mode === 'auto' ? (isTransparent ? 'contour' : 'frame') : mode;

  return (
    <div className="tool-controls-flow" style={{ gap: '16px' }}>
      {/* 1. Shape Auto-Detection Notice (if image has transparency like Circle Crop) */}
      {isTransparent && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(198, 93, 33, 0.1) 0%, rgba(235, 111, 43, 0.04) 100%)',
          border: '1px solid rgba(198, 93, 33, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8125rem' }}>
            <Sparkles size={14} />
            <span>Contour Outline Active</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
            Detected transparent background. The border automatically hugs the exact silhouette of your image (circle, cutout, sticker) with transparent outer corners.
          </p>
        </div>
      )}

      {/* 2. Border Width Slider */}
      <div className="control-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label className="input-header-label" style={{ margin: 0 }}>Border Width</label>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8125rem' }}>
            {borderWidth} px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          value={borderWidth}
          onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* 3. Corner Radius Slider (Only shown if applying a rectangular frame box) */}
      {activeMode === 'frame' && (
        <div className="control-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="input-header-label" style={{ margin: 0 }}>Corner Radius</label>
            <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8125rem' }}>
              {radius} px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={64}
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* 4. Border Color Picker */}
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
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              background: 'transparent',
              padding: 0
            }}
          />
          <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
            {borderColor.toUpperCase()}
          </span>
          <div className="preset-pills" style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
            {['#c65d21', '#111827', '#ffffff', '#2563eb', '#15803d', '#dc2626'].map((c) => (
              <button
                key={c}
                type="button"
                className="pill-btn"
                style={{
                  width: '22px',
                  height: '22px',
                  padding: 0,
                  backgroundColor: c,
                  border: borderColor.toLowerCase() === c.toLowerCase() ? '2px solid var(--color-accent)' : '1px solid #d6d3d1',
                  borderRadius: '4px'
                }}
                onClick={() => setBorderColor(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Optional Mode Toggle for Transparent Images */}
      {isTransparent && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Border Style</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className={`pill-btn ${activeMode === 'contour' ? 'is-active' : ''}`}
              style={{ fontSize: '0.6875rem', padding: '4px 8px' }}
              onClick={() => setMode('contour')}
            >
              Hugging Outline
            </button>
            <button
              type="button"
              className={`pill-btn ${activeMode === 'frame' ? 'is-active' : ''}`}
              style={{ fontSize: '0.6875rem', padding: '4px 8px' }}
              onClick={() => setMode('frame')}
            >
              Outer Box
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
