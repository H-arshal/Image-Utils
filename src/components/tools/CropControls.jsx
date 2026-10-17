import React, { useState, useEffect } from 'react';

const PRESETS = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '9:16', ratio: 9 / 16 }
];

export default function CropControls({ originalWidth, originalHeight, onChange }) {
  const [activePreset, setActivePreset] = useState('Free');
  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: originalWidth,
    height: originalHeight
  });

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    if (!preset.ratio) {
      const full = { x: 0, y: 0, width: originalWidth, height: originalHeight };
      setCropBox(full);
      onChange(full);
      return;
    }

    const targetRatio = preset.ratio;
    let newW, newH;

    if (originalWidth / originalHeight > targetRatio) {
      newH = originalHeight;
      newW = Math.round(newH * targetRatio);
    } else {
      newW = originalWidth;
      newH = Math.round(newW / targetRatio);
    }

    const newX = Math.round((originalWidth - newW) / 2);
    const newY = Math.round((originalHeight - newH) / 2);

    const updated = { x: newX, y: newY, width: newW, height: newH };
    setCropBox(updated);
    onChange(updated);
  };

  const handleBoxChange = (key, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = { ...cropBox, [key]: num };
    setCropBox(updated);
    onChange(updated);
  };

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">Aspect ratio presets</label>
        <div className="preset-pills">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`pill-btn ${activePreset === p.label ? 'is-active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="inputs-2col-grid">
        <div className="control-group">
          <label className="input-header-label">Width (px)</label>
          <input
            type="number"
            className="control-input mono"
            value={cropBox.width}
            max={originalWidth}
            onChange={(e) => handleBoxChange('width', e.target.value)}
          />
        </div>
        <div className="control-group">
          <label className="input-header-label">Height (px)</label>
          <input
            type="number"
            className="control-input mono"
            value={cropBox.height}
            max={originalHeight}
            onChange={(e) => handleBoxChange('height', e.target.value)}
          />
        </div>
      </div>

      <div className="inputs-2col-grid">
        <div className="control-group">
          <label className="input-header-label">Offset X</label>
          <input
            type="number"
            className="control-input mono"
            value={cropBox.x}
            max={originalWidth - cropBox.width}
            onChange={(e) => handleBoxChange('x', e.target.value)}
          />
        </div>
        <div className="control-group">
          <label className="input-header-label">Offset Y</label>
          <input
            type="number"
            className="control-input mono"
            value={cropBox.y}
            max={originalHeight - cropBox.height}
            onChange={(e) => handleBoxChange('y', e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="button-secondary"
        onClick={() => applyPreset(PRESETS[0])}
      >
        Reset crop
      </button>
    </div>
  );
}
