import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Camera, AlertTriangle } from 'lucide-react';
import { inspectFileMetadata } from '../../utils/canvasEngine';

export default function MetadataControls({ file, onChange }) {
  const [metaInfo, setMetaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (file) {
      setLoading(true);
      inspectFileMetadata(file).then((info) => {
        setMetaInfo(info);
        setLoading(false);
      });
    } else {
      setMetaInfo({ hasExif: false });
      setLoading(false);
    }
    onChange({ scrub: true });
  }, [file]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Camera size={15} color="var(--color-accent)" />
          <span>Metadata inspection</span>
        </h4>

        {loading ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Scanning file headers...</p>
        ) : metaInfo?.hasExif ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-warning)' }}>
              <AlertTriangle size={14} />
              <span>EXIF metadata tags detected in original file.</span>
            </div>
            {metaInfo.hasGps && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)' }}>
                <MapPin size={14} />
                <span>GPS location data found!</span>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            No embedded EXIF or GPS tags found in source file.
          </p>
        )}
      </div>

      <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }}>
          <ShieldCheck size={16} />
          <span>Privacy sanitization guaranteed</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
          Exporting renders pure pixel data to a fresh canvas context, scrubbing all GPS coordinates, timestamps, camera serial numbers, and device details completely.
        </p>
      </div>
    </div>
  );
}
