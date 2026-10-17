import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import { createSampleLandscape, createSampleAvatar } from '../utils/sampleImages';

export default function Dropzone({ onFileLoaded }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Global paste handler (Ctrl+V from clipboard)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a supported image file (JPG, PNG, WebP, BMP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onFileLoaded({
          file,
          dataUrl: e.target.result,
          name: file.name,
          size: file.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: file.type
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const loadSample = (type) => {
    const dataUrl = type === 'landscape' ? createSampleLandscape() : createSampleAvatar();
    const img = new Image();
    img.onload = () => {
      const byteSize = Math.round((dataUrl.length * 3) / 4);
      onFileLoaded({
        file: null,
        dataUrl,
        name: type === 'landscape' ? 'sample-landscape.jpg' : 'sample-avatar.png',
        size: byteSize,
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: type === 'landscape' ? 'image/jpeg' : 'image/png'
      });
    };
    img.src = dataUrl;
  };

  return (
    <div
      className={`dropzone-container ${isDragOver ? 'is-dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div className="dropzone-icon-wrap">
        <UploadCloud size={26} />
      </div>

      <h3 className="dropzone-title">Drop your image here, or browse</h3>
      <p className="dropzone-desc">
        Supports JPG, PNG, WebP, BMP, and GIF • Paste directly with <kbd>Ctrl + V</kbd>
      </p>

      <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="button-primary"
          style={{ width: 'auto', padding: '8px 18px', fontSize: '0.875rem' }}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Image
        </button>

        <div className="sample-button-group">
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>or try:</span>
          <button
            type="button"
            className="btn-sample"
            onClick={() => loadSample('landscape')}
          >
            Landscape
          </button>
          <button
            type="button"
            className="btn-sample"
            onClick={() => loadSample('avatar')}
          >
            Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
