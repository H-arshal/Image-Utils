import React, { useState, useEffect } from 'react';
import { isAvifSupported } from '../../utils/canvasEngine';
import { Check, Sparkles, FileImage, ShieldCheck } from 'lucide-react';

const CONVERT_FORMATS = [
  { id: 'image/png', label: 'PNG', ext: 'png', tag: 'Lossless & Transparent' },
  { id: 'image/jpeg', label: 'JPEG', ext: 'jpg', tag: 'Compressed Photo' },
  { id: 'image/webp', label: 'WebP', ext: 'webp', tag: 'High-Efficiency Web' },
  { id: 'image/bmp', label: 'BMP', ext: 'bmp', tag: 'Windows 24-Bit Bitmap' },
  { id: 'image/avif', label: 'AVIF', ext: 'avif', tag: 'Next-Gen Ultra Compact' },
  { id: 'image/tiff', label: 'TIFF', ext: 'tiff', tag: 'Archival & Print Quality' },
  { id: 'image/x-icon', label: 'ICO', ext: 'ico', tag: 'Windows Icon File' }
];

export default function ConvertControls({ onChange }) {
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const avifAvailable = isAvifSupported();

  useEffect(() => {
    onChange({
      targetFormat: format,
      quality: quality / 100,
      bgColor
    });
  }, [format, quality, bgColor]);

  const activeFormatMeta = CONVERT_FORMATS.find((f) => f.id === format) || CONVERT_FORMATS[0];
  const supportsQuality = format === 'image/jpeg' || format === 'image/webp' || format === 'image/avif';
  const needsBgFill = format === 'image/jpeg' || format === 'image/bmp';

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">
          <span>Target Format</span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            .{activeFormatMeta.ext.toUpperCase()}
          </span>
        </label>
        <div className="convert-format-grid">
          {CONVERT_FORMATS.map((fmt) => {
            const isActive = format === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                className={`pill-btn format-select-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setFormat(fmt.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{fmt.label}</span>
                  {isActive && <Check size={14} color="var(--color-accent)" />}
                </div>
                <span style={{ fontSize: '0.6875rem', color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                  {fmt.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {format === 'image/avif' && !avifAvailable && (
        <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Sparkles size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Your browser doesn't natively support AVIF encoding. It will automatically export as high-efficiency WebP.</span>
        </div>
      )}

      {supportsQuality && (
        <div className="control-group">
          <label className="input-header-label">
            <span>Encoding Quality</span>
            <span className="mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              {quality}%
            </span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            <span>Smaller file</span>
            <span>Balanced</span>
            <span>Maximum fidelity</span>
          </div>
        </div>
      )}

      {needsBgFill && (
        <div className="control-group">
          <label className="input-header-label">
            <span>Background Fill (replaces transparency)</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: '38px',
                height: '38px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--color-text)', fontWeight: 600 }}>
              {bgColor.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {activeFormatMeta.label} does not support alpha transparency; transparent pixels are filled with this color.
          </span>
        </div>
      )}

      <div style={{ background: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ShieldCheck size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
        <span>100% In-Browser Conversion. Zero server uploads.</span>
      </div>
    </div>
  );
}
