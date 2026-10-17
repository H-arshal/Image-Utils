import React from 'react';

export default function CircleCropControls({ originalWidth, originalHeight, cropState, onChange }) {
  const minDim = Math.min(originalWidth, originalHeight);
  const radius = cropState?.radius ?? Math.round(minDim / 2);
  const centerX = cropState?.centerX ?? Math.round(originalWidth / 2);
  const centerY = cropState?.centerY ?? Math.round(originalHeight / 2);
  const zoom = cropState?.zoom ?? 1;

  const updateParam = (partial) => {
    onChange({
      centerX,
      centerY,
      radius,
      zoom,
      ...partial
    });
  };

  const recenter = () => {
    onChange({
      centerX: Math.round(originalWidth / 2),
      centerY: Math.round(originalHeight / 2),
      radius: Math.round(minDim / 2),
      zoom: 1
    });
  };

  return (
    <div className="tool-controls-flow">
      {/* Interactive Drag Hint */}
      <div style={{ background: 'var(--color-accent-tint)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '0.8125rem', color: 'var(--color-accent)' }}>
        🎯 Drag the <strong>red circle</strong> to reposition, or pull any of the <strong>8 green handles</strong> to resize the crop.
      </div>

      <div className="control-group">
        <label className="input-header-label">
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
          onChange={(e) => updateParam({ radius: parseInt(e.target.value, 10) })}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">
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
          onChange={(e) => updateParam({ zoom: parseFloat(e.target.value) })}
        />
      </div>

      <div className="inputs-2col-grid">
        <div className="control-group">
          <label className="input-header-label">Center X</label>
          <input
            type="number"
            className="control-input mono"
            value={centerX}
            onChange={(e) => updateParam({ centerX: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
        <div className="control-group">
          <label className="input-header-label">Center Y</label>
          <input
            type="number"
            className="control-input mono"
            value={centerY}
            onChange={(e) => updateParam({ centerY: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
      </div>

      <button
        type="button"
        className="button-secondary"
        style={{ height: '38px' }}
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
