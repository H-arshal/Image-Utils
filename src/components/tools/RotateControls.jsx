import React, { useState, useEffect } from 'react';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';

export default function RotateControls({ onChange }) {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  useEffect(() => {
    onChange({
      rotation,
      flipH,
      flipV
    });
  }, [rotation, flipH, flipV]);

  const rotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const rotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const rotate180 = () => setRotation((prev) => (prev + 180) % 360);
  const toggleFlipH = () => setFlipH((prev) => !prev);
  const toggleFlipV = () => setFlipV((prev) => !prev);

  const resetAll = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">
          <span>Rotation angle</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {rotation}°
          </span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <button
            type="button"
            className="pill-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px' }}
            onClick={rotateLeft}
          >
            <RotateCcw size={14} />
            <span>-90°</span>
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px' }}
            onClick={rotateRight}
          >
            <RotateCw size={14} />
            <span>+90°</span>
          </button>
          <button
            type="button"
            className="pill-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px' }}
            onClick={rotate180}
          >
            <RefreshCw size={14} />
            <span>180°</span>
          </button>
        </div>
      </div>

      <div className="control-group">
        <label className="input-header-label">Flip</label>
        <div className="inputs-2col-grid">
          <button
            type="button"
            className={`pill-btn ${flipH ? 'is-active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px' }}
            onClick={toggleFlipH}
          >
            <FlipHorizontal size={15} />
            <span>Horizontal</span>
          </button>
          <button
            type="button"
            className={`pill-btn ${flipV ? 'is-active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '38px' }}
            onClick={toggleFlipV}
          >
            <FlipVertical size={15} />
            <span>Vertical</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="button-secondary"
        style={{ height: '38px' }}
        onClick={resetAll}
      >
        Reset orientation
      </button>
    </div>
  );
}
