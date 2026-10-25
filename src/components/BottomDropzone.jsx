import React, { useRef, useState } from 'react';

export default function BottomDropzone({ onFileLoaded }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const MAX_PIXEL_DIMENSION = 12000;

  const handleFile = (file) => {
    if (!file || !ALLOWED_MIME_TYPES.includes(file.type)) return;
    if (file.size > MAX_FILE_SIZE) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > MAX_PIXEL_DIMENSION || img.naturalHeight > MAX_PIXEL_DIMENSION) return;
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

  return (
    <div
      className={`bottom-dropzone-card ${isDragOver ? 'is-dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div className="bottom-dropzone-icon">
        <picture>
          <source type="image/webp" srcSet="/logo-48.webp" />
          <img src="/logo-48.png" alt="Drop target" width="38" height="38" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
        </picture>
      </div>

      <h4 className="bottom-dropzone-title">Drag & drop an image here</h4>
      <p className="bottom-dropzone-desc">
        or click to browse • or paste from clipboard (Ctrl+V / Cmd+V)
      </p>

      <div className="format-pills-row">
        {['JPG', 'PNG', 'WEBP', 'BMP', 'GIF'].map((fmt) => (
          <span key={fmt} className="format-badge-pill">
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
}
