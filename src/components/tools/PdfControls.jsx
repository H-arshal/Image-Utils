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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="control-group">
        <label className="control-label">Page size</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          {[
            { id: 'a4', label: 'A4' },
            { id: 'letter', label: 'Letter' },
            { id: 'fit', label: 'Fit Image' }
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              className={`pill-btn ${pageSize === fmt.id ? 'is-active' : ''}`}
              onClick={() => setPageSize(fmt.id)}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {pageSize !== 'fit' && (
        <div className="control-group">
          <label className="control-label">Orientation</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
            {[
              { id: 'auto', label: 'Auto' },
              { id: 'portrait', label: 'Portrait' },
              { id: 'landscape', label: 'Landscape' }
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                className={`pill-btn ${orientation === o.id ? 'is-active' : ''}`}
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
          <label className="control-label">Margins</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
            {[
              { id: 'none', label: '0 mm' },
              { id: 'small', label: '8 mm' },
              { id: 'normal', label: '16 mm' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pill-btn ${margin === m.id ? 'is-active' : ''}`}
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
