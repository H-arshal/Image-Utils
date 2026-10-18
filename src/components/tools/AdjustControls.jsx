import React, { useState, useEffect } from 'react';
import { Sun, Contrast, Palette, Thermometer, Focus, Sparkles, Moon, RotateCw, Shield, Sliders } from 'lucide-react';

const PRESETS = [
  {
    id: 'original',
    name: 'Original',
    values: { brightness: 100, contrast: 100, saturation: 100, warmth: 0, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0, vignette: 0 }
  },
  {
    id: 'vivid',
    name: 'Vivid',
    values: { brightness: 104, contrast: 118, saturation: 140, warmth: 0, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0, vignette: 0 }
  },
  {
    id: 'warm',
    name: 'Warm Sun',
    values: { brightness: 102, contrast: 106, saturation: 112, warmth: 30, blur: 0, sepia: 15, grayscale: 0, hueRotate: 0, invert: 0, vignette: 10 }
  },
  {
    id: 'cool',
    name: 'Cool Breeze',
    values: { brightness: 100, contrast: 108, saturation: 96, warmth: -30, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0, vignette: 0 }
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    values: { brightness: 94, contrast: 132, saturation: 88, warmth: 0, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0, vignette: 35 }
  },
  {
    id: 'mono',
    name: 'Mono B&W',
    values: { brightness: 100, contrast: 118, saturation: 0, warmth: 0, blur: 0, sepia: 0, grayscale: 100, hueRotate: 0, invert: 0, vignette: 0 }
  },
  {
    id: 'silvertone',
    name: 'Silvertone',
    values: { brightness: 108, contrast: 145, saturation: 0, warmth: 0, blur: 0, sepia: 0, grayscale: 100, hueRotate: 0, invert: 0, vignette: 20 }
  },
  {
    id: 'vintage',
    name: 'Vintage 70s',
    values: { brightness: 95, contrast: 92, saturation: 82, warmth: 20, blur: 0, sepia: 45, grayscale: 0, hueRotate: 0, invert: 0, vignette: 28 }
  },
  {
    id: 'cinema',
    name: 'Cinematic',
    values: { brightness: 96, contrast: 122, saturation: 110, warmth: 12, blur: 0, sepia: 10, grayscale: 0, hueRotate: 0, invert: 0, vignette: 42 }
  }
];

export default function AdjustControls({ onChange }) {
  const [activeTab, setActiveTab] = useState('light'); // 'light' or 'effects'
  const [activePreset, setActivePreset] = useState('original');

  // Adjustment values state
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    vignette: 0
  });

  useEffect(() => {
    onChange(adjustments);
  }, [adjustments]);

  const updateField = (field, value) => {
    setActivePreset('custom');
    setAdjustments((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setAdjustments({ ...preset.values });
  };

  const resetAll = () => {
    applyPreset(PRESETS[0]);
  };

  return (
    <div className="tool-controls-flow">
      {/* 1. Quick Presets Header */}
      <div className="control-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="input-header-label" style={{ margin: 0 }}>
            <span>Quick Filters</span>
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            {activePreset === 'custom' ? 'Custom' : PRESETS.find((p) => p.id === activePreset)?.name}
          </span>
        </div>
        <div className="preset-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${activePreset === p.id ? 'is-active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '5px 11px' }}
              onClick={() => applyPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sub-Category Selector (Light & Color vs Effects & Tone) */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface-subtle)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('light')}
          style={{
            flex: 1,
            padding: '6px 12px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'light' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'light' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            boxShadow: activeTab === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Light & Color
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('effects')}
          style={{
            flex: 1,
            padding: '6px 12px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'effects' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'effects' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            boxShadow: activeTab === 'effects' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Effects & Tone
        </button>
      </div>

      {/* Tab 1: Light & Color */}
      {activeTab === 'light' && (
        <>
          {/* Brightness */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sun size={15} color="var(--color-accent)" />
                <span>Brightness</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.brightness}%
              </span>
            </label>
            <input
              type="range"
              min={30}
              max={180}
              value={adjustments.brightness}
              onChange={(e) => updateField('brightness', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Contrast */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Contrast size={15} color="var(--color-accent)" />
                <span>Contrast</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.contrast}%
              </span>
            </label>
            <input
              type="range"
              min={30}
              max={180}
              value={adjustments.contrast}
              onChange={(e) => updateField('contrast', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Saturation */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Palette size={15} color="var(--color-accent)" />
                <span>Saturation</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.saturation}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={250}
              value={adjustments.saturation}
              onChange={(e) => updateField('saturation', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Warmth / Temperature */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={15} color="var(--color-accent)" />
                <span>Warmth / Temp</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.warmth > 0 ? `+${adjustments.warmth} (Warm)` : adjustments.warmth < 0 ? `${adjustments.warmth} (Cool)` : '0'}
              </span>
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={adjustments.warmth}
              onChange={(e) => updateField('warmth', parseInt(e.target.value, 10))}
            />
          </div>
        </>
      )}

      {/* Tab 2: Effects & Tone */}
      {activeTab === 'effects' && (
        <>
          {/* Vignette */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Focus size={15} color="var(--color-accent)" />
                <span>Vignette (Edges)</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.vignette}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={adjustments.vignette}
              onChange={(e) => updateField('vignette', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Blur (Soft Focus) */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="var(--color-accent)" />
                <span>Blur (Softness)</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.blur} px
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={20}
              value={adjustments.blur}
              onChange={(e) => updateField('blur', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Sepia */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={15} color="var(--color-accent)" />
                <span>Sepia (Vintage)</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.sepia}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={adjustments.sepia}
              onChange={(e) => updateField('sepia', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Grayscale (Black & White) */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Moon size={15} color="var(--color-accent)" />
                <span>Grayscale (B&W)</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.grayscale}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={adjustments.grayscale}
              onChange={(e) => updateField('grayscale', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Hue Shift */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCw size={15} color="var(--color-accent)" />
                <span>Hue Shift</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.hueRotate}°
              </span>
            </label>
            <input
              type="range"
              min={-180}
              max={180}
              value={adjustments.hueRotate}
              onChange={(e) => updateField('hueRotate', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Invert */}
          <div className="control-group">
            <label className="input-header-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} color="var(--color-accent)" />
                <span>Invert (Negative)</span>
              </span>
              <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {adjustments.invert}%
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={adjustments.invert}
              onChange={(e) => updateField('invert', parseInt(e.target.value, 10))}
            />
          </div>
        </>
      )}

      {/* Reset Button */}
      <button
        type="button"
        className="button-secondary"
        style={{ height: '38px', marginTop: '4px' }}
        onClick={resetAll}
      >
        Reset all adjustments
      </button>
    </div>
  );
}
