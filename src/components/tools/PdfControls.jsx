import React, { useState, useEffect } from 'react';

export default function PdfControls({ onChange }) {
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('auto');
  const [margin, setMargin] = useState('normal');
  const [fitMode, setFitMode] = useState('contain');

  useEffect(() => {
    onChange({
      pageSize,
      orientation,
      margin,
      fitMode
    });
  }, [pageSize, orientation, margin, fitMode]);

  return (
    <div className="tool-controls-flow">
      <div className="control-group">
        <label className="input-header-label">Page size</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { id: 'a4', label: 'A4' },
            { id: 'letter', label: 'Letter' },
            { id: 'fit', label: 'Fit Image' }
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`pill-btn ${pageSize === fmt.id ? 'is-active' : ''}`}
              style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setPageSize(fmt.id)}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {pageSize !== 'fit' && (
        <div className="control-group">
          <label className="input-header-label">Orientation</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { id: 'auto', label: 'Auto' },
              { id: 'portrait', label: 'Portrait' },
              { id: 'landscape', label: 'Landscape' }
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                className={`pill-btn ${orientation === o.id ? 'is-active' : ''}`}
                style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setOrientation(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {pageSize !== 'fit' && (
        <div className="control-group">
          <label className="input-header-label">Margins</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { id: 'none', label: '0 mm' },
              { id: 'small', label: '8 mm' },
              { id: 'normal', label: '16 mm' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pill-btn ${margin === m.id ? 'is-active' : ''}`}
                style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setMargin(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        Generates a clean, single-page PDF document locally.
      </div>
    </div>
  );
}
