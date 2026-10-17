import React, { useState, useEffect } from 'react';

export default function WatermarkControls({ onChange }) {
  const [text, setText] = useState('© Image Utility');
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(28);

  useEffect(() => {
    onChange({
      text,
      opacity: opacity / 100,
      position,
      fontSize,
      color: '#ffffff'
    });
  }, [text, opacity, position, fontSize]);

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">Watermark Text</label>
        <input
          type="text"
          className="control-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">
          <span>Opacity</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{opacity}%</span>
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={opacity}
          onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">Position</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {[
            { id: 'top-left', label: 'Top Left' },
            { id: 'top-right', label: 'Top Right' },
            { id: 'bottom-left', label: 'Bottom Left' },
            { id: 'bottom-right', label: 'Bottom Right' },
            { id: 'center', label: 'Center' }
          ].map((pos) => (
            <button
              key={pos.id}
              type="button"
              className={`pill-btn ${position === pos.id ? 'is-active' : ''}`}
              onClick={() => setPosition(pos.id)}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
