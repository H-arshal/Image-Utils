import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Camera,
  Calendar,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';
import { inspectFileMetadata } from '../../utils/canvasEngine';

export default function MetadataControls({ file, fileType, originalSize, onChange }) {
  const [metaInfo, setMetaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState('original'); // 'original' | 'image/jpeg' | 'image/png' | 'image/webp'
  const [quality, setQuality] = useState(0.92);

  useEffect(() => {
    let active = true;
    if (file) {
      setLoading(true);
      inspectFileMetadata(file).then((info) => {
        if (active) {
          setMetaInfo(info);
          setLoading(false);
        }
      });
    } else {
      setMetaInfo({ hasExif: false, isSample: true });
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [file]);

  // Propagate format and quality up to Workspace pipeline
  useEffect(() => {
    const resolvedFormat = format === 'original' ? (fileType || 'image/jpeg') : format;
    onChange({
      scrub: true,
      format: resolvedFormat,
      quality
    });
  }, [format, quality, fileType, onChange]);

  const isLossy = format === 'image/jpeg' || format === 'image/webp' || (format === 'original' && (!fileType || fileType.includes('jpeg')));

  return (
    <div className="tool-controls-flow" style={{ gap: '14px' }}>
      {/* 1. Primary Privacy Status Card */}
      <div style={{
        background: metaInfo?.hasExif
          ? 'linear-gradient(135deg, rgba(180, 83, 9, 0.12) 0%, rgba(217, 119, 6, 0.04) 100%)'
          : 'linear-gradient(135deg, rgba(21, 128, 61, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%)',
        border: metaInfo?.hasExif
          ? '1px solid rgba(180, 83, 9, 0.3)'
          : '1px solid rgba(21, 128, 61, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {metaInfo?.hasExif ? (
              <ShieldAlert size={18} color="var(--color-warning)" />
            ) : (
              <ShieldCheck size={18} color="var(--color-success)" />
            )}
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>
              {loading
                ? 'Inspecting Headers...'
                : metaInfo?.hasExif
                ? 'Sensitive Metadata Detected'
                : 'Zero Sensitive Tags Found'}
            </span>
          </div>

          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            background: metaInfo?.hasExif ? 'var(--color-warning)' : 'var(--color-success)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            {metaInfo?.hasExif ? 'Purge Active' : 'Clean'}
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
          {loading
            ? 'Analyzing binary EXIF markers and camera headers...'
            : metaInfo?.hasExif
            ? 'Embedded device and location tags were discovered in the original file. Exporting will scrub them completely.'
            : 'No GPS coordinates or EXIF device markers were found. Re-drawing through our pure canvas context ensures 100% anonymization.'}
        </p>

        {metaInfo?.hasExif && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
            {metaInfo.hasGps && (
              <span style={{
                background: 'rgba(185, 28, 28, 0.1)',
                color: 'var(--color-danger)',
                border: '1px solid rgba(185, 28, 28, 0.25)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <MapPin size={11} />
                <span>GPS Location Tagged</span>
              </span>
            )}
            {metaInfo.cameraModel && (
              <span style={{
                background: 'rgba(180, 83, 9, 0.1)',
                color: 'var(--color-warning)',
                border: '1px solid rgba(180, 83, 9, 0.25)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Camera size={11} />
                <span>Camera: {metaInfo.cameraModel}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Sanitization Audit Breakdown */}
      <div className="control-group">
        <label className="input-header-label">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} color="var(--color-accent)" />
            <span>Guaranteed Scrubbed Tags</span>
          </div>
        </label>
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text)' }}>
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>GPS Geotags</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text)' }}>
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>Device Serials</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text)' }}>
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>Camera & Lens</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text)' }}>
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>Timestamps</span>
          </div>
        </div>
      </div>

      {/* 3. Output Format Selector */}
      <div className="control-group">
        <label className="input-header-label">Export Format</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          <button
            type="button"
            className={`pill-btn ${format === 'original' ? 'is-active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '6px 4px' }}
            onClick={() => setFormat('original')}
          >
            Original
          </button>
          <button
            type="button"
            className={`pill-btn ${format === 'image/jpeg' ? 'is-active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '6px 4px' }}
            onClick={() => setFormat('image/jpeg')}
          >
            JPG
          </button>
          <button
            type="button"
            className={`pill-btn ${format === 'image/png' ? 'is-active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '6px 4px' }}
            onClick={() => setFormat('image/png')}
          >
            PNG
          </button>
          <button
            type="button"
            className={`pill-btn ${format === 'image/webp' ? 'is-active' : ''}`}
            style={{ fontSize: '0.75rem', padding: '6px 4px' }}
            onClick={() => setFormat('image/webp')}
          >
            WebP
          </button>
        </div>
      </div>

      {/* 4. Quality Slider (if Lossy Format) */}
      {isLossy && (
        <div className="control-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="input-header-label" style={{ margin: 0 }}>Output Quality</label>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.0}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* 5. Privacy Notice */}
      <div style={{
        background: 'var(--color-surface-subtle)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.8125rem' }}>
          <ShieldCheck size={14} />
          <span>Client-Side Guarantee</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
          Your photo never leaves your computer. Raw pixels are re-rasterized directly into a fresh canvas buffer with zero EXIF headers.
        </p>
      </div>
    </div>
  );
}
