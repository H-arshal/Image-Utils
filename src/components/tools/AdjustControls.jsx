import React, { useState, useEffect } from 'react';

export default function AdjustControls({ onChange }) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  useEffect(() => {
    onChange({ brightness, contrast, saturation });
  }, [brightness, contrast, saturation]);

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">
          <span>Brightness</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{brightness}%</span>
        </label>
        <input
          type="range"
          min={30}
          max={170}
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">
          <span>Contrast</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{contrast}%</span>
        </label>
        <input
          type="range"
          min={30}
          max={170}
          value={contrast}
          onChange={(e) => setContrast(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="control-group">
        <label className="input-header-label">
          <span>Saturation</span>
          <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{saturation}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={200}
          value={saturation}
          onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
        />
      </div>

      <button
        type="button"
        className="button-secondary"
        onClick={resetAll}
      >
        Reset adjustments
      </button>
    </div>
  );
}
