import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Package,
  Layers,
  FileCode,
  Sliders,
  Eye,
  BookOpen
} from 'lucide-react';

const SINGLE_PRESETS = [
  { id: 'ico', label: 'Multi-Size .ICO (16 + 32 + 48 px)' },
  { id: '180', label: 'Apple Touch Icon (180×180 PNG)' },
  { id: '32', label: 'Standard Tab (32×32 PNG)' },
  { id: '16', label: 'Small Tab (16×16 PNG)' },
  { id: '192', label: 'Android Home Screen (192×192 PNG)' },
  { id: '512', label: 'PWA Splash (512×512 PNG)' }
];

export default function FaviconControls({ previewUrl, onChange }) {
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'previews' | 'install'
  const [isPackageMode, setIsPackageMode] = useState(true);
  const [singlePreset, setSinglePreset] = useState('ico');
  const [bgColor, setBgColor] = useState('transparent');
  const [radius, setRadius] = useState(0); // 0 to 100%
  const [copied, setCopied] = useState(false);

  const preset = isPackageMode ? 'package' : singlePreset;

  useEffect(() => {
    onChange({
      preset,
      bgColor,
      radius
    });
  }, [preset, bgColor, radius, onChange]);

  const htmlCode = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getPreviewStyle = (size) => ({
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    borderRadius: `${radius * 0.5}%`,
    backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor,
    flexShrink: 0
  });

  return (
    <div className="tool-controls-flow" style={{ gap: '14px' }}>
      {/* Mini Navigation Tabs to keep panel compact */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'var(--color-surface-subtle)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          style={{
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: activeTab === 'config' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'config' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            boxShadow: activeTab === 'config' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Sliders size={13} />
          <span>Config</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('previews')}
          style={{
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: activeTab === 'previews' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'previews' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            boxShadow: activeTab === 'previews' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Eye size={13} />
          <span>Previews</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('install')}
          style={{
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: activeTab === 'install' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'install' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            boxShadow: activeTab === 'install' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={13} />
          <span>Install</span>
        </button>
      </div>

      {/* TAB 1: MAIN CONFIGURATION (Compact, fits completely without vertical scrolling) */}
      {activeTab === 'config' && (
        <>
          {/* Output Mode Switcher */}
          <div className="control-group">
            <label className="input-header-label">Output Target</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                className={`pill-btn ${isPackageMode ? 'is-active' : ''}`}
                style={{
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
                onClick={() => setIsPackageMode(true)}
              >
                <Package size={14} color={isPackageMode ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
                <span>ZIP Package (7)</span>
              </button>

              <button
                type="button"
                className={`pill-btn ${!isPackageMode ? 'is-active' : ''}`}
                style={{
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
                onClick={() => setIsPackageMode(false)}
              >
                <Layers size={14} color={!isPackageMode ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
                <span>Single File</span>
              </button>
            </div>

            {/* Single File Dropdown if Single File mode is chosen */}
            {!isPackageMode && (
              <select
                value={singlePreset}
                onChange={(e) => setSinglePreset(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {SINGLE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Compact Browser Tab Mockup */}
          <div className="control-group">
            <div style={{
              background: '#2b2d30',
              borderRadius: '6px',
              padding: '6px 8px 0 8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e1f22',
                padding: '4px 10px',
                borderRadius: '6px 6px 0 0',
                maxWidth: '190px',
                fontSize: '0.6875rem',
                color: '#e6e6e6'
              }}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Favicon"
                    style={{
                      width: '14px',
                      height: '14px',
                      objectFit: 'contain',
                      borderRadius: `${radius * 0.5}%`,
                      backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor
                    }}
                  />
                ) : (
                  <div style={{ width: '14px', height: '14px', background: 'var(--color-accent)', borderRadius: '2px' }} />
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  Tab Preview
                </span>
                <span style={{ color: '#888', marginLeft: 'auto', fontSize: '10px' }}>×</span>
              </div>
              <div style={{
                background: '#1e1f22',
                padding: '3px 8px',
                fontSize: '0.625rem',
                color: '#8e9196',
                borderRadius: '0 0 3px 3px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ color: '#4caf50' }}>🔒</span>
                <span>mysite.com</span>
              </div>
            </div>
          </div>

          {/* Background Fill & Corner Rounding in Compact Rows */}
          <div className="control-group">
            <label className="input-header-label">Background Fill</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className={`pill-btn ${bgColor === 'transparent' ? 'is-active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '5px 10px', flex: 1 }}
                onClick={() => setBgColor('transparent')}
              >
                None
              </button>
              <button
                type="button"
                className={`pill-btn ${bgColor === '#ffffff' ? 'is-active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '5px 10px', flex: 1 }}
                onClick={() => setBgColor('#ffffff')}
              >
                White
              </button>
              <button
                type="button"
                className={`pill-btn ${bgColor === '#18181b' ? 'is-active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '5px 10px', flex: 1 }}
                onClick={() => setBgColor('#18181b')}
              >
                Dark
              </button>
              <input
                type="color"
                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                title="Custom color"
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'transparent',
                  flexShrink: 0
                }}
              />
            </div>
          </div>

          <div className="control-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="input-header-label" style={{ margin: 0 }}>Corner Rounding</label>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>{radius}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Quick 1-Click Copy HTML Snippet Row */}
          <div style={{
            background: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
              <FileCode size={14} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                &lt;link rel="icon" ...&gt;
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                background: copied ? 'var(--color-success)' : 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
                transition: 'background-color 0.15s ease'
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? 'Copied' : 'Copy HTML'}</span>
            </button>
          </div>
        </>
      )}

      {/* TAB 2: LIVE PREVIEW SIZES AT SCALE */}
      {activeTab === 'previews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Desktop Browser & Bookmarks
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={previewUrl} alt="16px" style={getPreviewStyle(16)} />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>16×16</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={previewUrl} alt="32px" style={getPreviewStyle(32)} />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>32×32</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={previewUrl} alt="48px" style={getPreviewStyle(48)} />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>48×48</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '11px',
              overflow: 'hidden',
              boxShadow: '0 3px 10px rgba(0,0,0,0.16)',
              backgroundColor: bgColor === 'transparent' ? '#ffffff' : bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img
                src={previewUrl}
                alt="Apple Touch Icon"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: `${radius * 0.5}%`
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Apple & Android Tile
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                180×180 & 192×192 on mobile home screens.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP INSTALL GUIDE & FULL CODE */}
      {activeTab === 'install' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                background: 'var(--color-accent)',
                color: '#fff',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                flexShrink: 0
              }}>1</span>
              <div>Download the ZIP package or ICO.</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                background: 'var(--color-accent)',
                color: '#fff',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                flexShrink: 0
              }}>2</span>
              <div>Extract all 7 files beside your <code style={{ color: 'var(--color-accent)' }}>index.html</code>.</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                background: 'var(--color-accent)',
                color: '#fff',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                flexShrink: 0
              }}>3</span>
              <div>Paste snippet before <code style={{ color: 'var(--color-accent)' }}>&lt;/head&gt;</code>.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>HTML Tags</span>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                background: 'transparent',
                border: 'none',
                color: copied ? 'var(--color-success)' : 'var(--color-accent)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre style={{
            background: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            fontSize: '0.625rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text)',
            overflowX: 'auto',
            lineHeight: 1.5,
            margin: 0
          }}>
            {htmlCode}
          </pre>
        </div>
      )}
    </div>
  );
}
