import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileDown,
  Crop,
  Circle,
  Square,
  Repeat,
  RotateCw,
  FileText,
  ShieldAlert,
  Type,
  Sliders,
  Info,
  Columns,
  UploadCloud,
  Globe
} from 'lucide-react';
import {
  formatBytes,
  downloadBlob,
  loadImage,
  resizeImage,
  compressImage,
  compressToTargetSize,
  cropImage,
  circleCropImage,
  addBorderImage,
  cornerRadiusImage,
  convertFormat,
  rotateFlipImage,
  generatePdf,
  stripMetadata,
  watermarkImage,
  adjustImage,
  generateFavicon
} from '../utils/canvasEngine';
import ResizeControls from './tools/ResizeControls';
import CompressControls from './tools/CompressControls';
import CropControls from './tools/CropControls';
import CircleCropControls from './tools/CircleCropControls';
import AddBorderControls from './tools/AddBorderControls';
import ConvertControls from './tools/ConvertControls';
import RotateControls from './tools/RotateControls';
import PdfControls from './tools/PdfControls';
import MetadataControls from './tools/MetadataControls';
import WatermarkControls from './tools/WatermarkControls';
import AdjustControls from './tools/AdjustControls';
import InteractiveCircleCrop from './InteractiveCircleCrop';
import InteractiveRectCrop from './InteractiveRectCrop';
import CornerRadiusControls from './tools/CornerRadiusControls';
import FaviconControls from './tools/FaviconControls';
import ToolGuideSection from './ToolGuideSection';

const WORKSPACE_TOOLS = [
  { id: 'resize', name: 'Resize', desc: 'Change image dimensions', icon: Maximize2 },
  { id: 'compress', name: 'Compress', desc: 'Reduce file size', icon: FileDown },
  { id: 'convert', name: 'Convert', desc: 'Convert seamlessly between PNG, JPEG, WebP, BMP, AVIF, TIFF, and ICO', icon: Repeat },
  { id: 'crop', name: 'Crop', desc: 'Trim to your perfect frame', icon: Crop },
  { id: 'circle', name: 'Circle Crop', desc: 'Create perfect circle images', icon: Circle },
  { id: 'radius', name: 'Corner Radius', desc: 'Round corners with transparent PNG', icon: Square },
  { id: 'border', name: 'Add Border', desc: 'Add custom borders', icon: Square },
  { id: 'rotate', name: 'Rotate', desc: 'Rotate and flip images', icon: RotateCw },
  { id: 'favicon', name: 'Favicon Generator', desc: 'Create .ico and web app icons', icon: Globe },
  { id: 'watermark', name: 'Watermark', desc: 'Add text or logo', icon: Type },
  { id: 'adjust', name: 'Adjust', desc: 'Brightness, contrast and more', icon: Sliders },
  { id: 'pdf', name: 'Image to PDF', desc: 'Convert image to single-page PDF', icon: FileText },
  { id: 'metadata', name: 'Metadata', desc: 'Inspect and remove EXIF tags', icon: ShieldAlert }
];

export default function Workspace({
  imageData,
  initialTool = 'resize',
  currentTool,
  onToolChange,
  onBack,
  onShowToast,
  onFileLoaded
}) {
  const [internalTool, setInternalTool] = useState(initialTool);
  const activeTool = currentTool || internalTool;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('fit'); // 'fit' or 'fill'
  const [showOriginal, setShowOriginal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [imgElement, setImgElement] = useState(null);
  const prevUrlRef = useRef(null);

  // Free previous object URLs from browser memory to prevent memory exhaustion
  useEffect(() => {
    if (processedResult?.url && processedResult.url !== prevUrlRef.current) {
      if (prevUrlRef.current && prevUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
      prevUrlRef.current = processedResult.url;
    }
  }, [processedResult]);

  // Clean up remaining object URL on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current && prevUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  // Tool parameter states
  const [toolParams, setToolParams] = useState({});

  // Direct Canvas Drag & Drop and File Replace Handlers
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const dragCounterRef = useRef(0);
  const canvasFileInputRef = useRef(null);
  const sidebarNavRef = useRef(null);

  // Auto-scroll active tool into view in horizontal navigation on mobile/tablet
  useEffect(() => {
    if (sidebarNavRef.current) {
      const activeBtn = sidebarNavRef.current.querySelector('.sidebar-tool-card.is-active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTool]);

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const MAX_PIXEL_DIMENSION = 12000;

  const handleIncomingFile = (file) => {
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      if (onShowToast) onShowToast('Unsupported format. Please drop JPG, PNG, WebP, BMP, or GIF.');
      else alert('Unsupported file format.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (onShowToast) onShowToast('File exceeds 50MB maximum size limit.');
      else alert('File is too large.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      if (onShowToast) onShowToast('Failed to read image file.');
    };
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        if (onShowToast) onShowToast('Corrupted or invalid image data.');
      };
      img.onload = () => {
        if (img.naturalWidth > MAX_PIXEL_DIMENSION || img.naturalHeight > MAX_PIXEL_DIMENSION) {
          if (onShowToast) onShowToast(`Dimensions exceed safe limit (${MAX_PIXEL_DIMENSION}px).`);
          return;
        }
        if (onFileLoaded) {
          onFileLoaded({
            file,
            dataUrl: e.target.result,
            name: file.name,
            size: file.size,
            width: img.naturalWidth,
            height: img.naturalHeight,
            type: file.type
          });
        }
        setToolParams({});
        if (onShowToast) onShowToast(`Loaded ${file.name}`);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsCanvasDragOver(true);
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsCanvasDragOver(false);
    }
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsCanvasDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste directly into workspace (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleIncomingFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Load source Image DOM element
  useEffect(() => {
    let active = true;
    loadImage(imageData.dataUrl).then((img) => {
      if (active) setImgElement(img);
    });
    return () => {
      active = false;
    };
  }, [imageData.dataUrl]);

  // Execute processing pipeline whenever activeTool, toolParams, or imgElement changes
  useEffect(() => {
    if (!imgElement) return;

    let cancelled = false;
    const process = async () => {
      setProcessing(true);
      try {
        let res = null;
        switch (activeTool) {
          case 'resize': {
            const w = toolParams.width || imageData.width;
            const h = toolParams.height || imageData.height;
            res = await resizeImage(imgElement, w, h, imageData.type || 'image/jpeg');
            break;
          }
          case 'compress': {
            if (toolParams.mode === 'target') {
              res = await compressToTargetSize(
                imgElement,
                toolParams.mimeType || 'image/jpeg',
                toolParams.targetBytes || 380 * 1024
              );
            } else {
              res = await compressImage(
                imgElement,
                toolParams.mimeType || 'image/jpeg',
                toolParams.quality ?? 0.8
              );
            }
            break;
          }
          case 'crop': {
            const cropBox = {
              x: toolParams.x ?? 0,
              y: toolParams.y ?? 0,
              width: toolParams.width ?? imageData.width,
              height: toolParams.height ?? imageData.height
            };
            res = await cropImage(imgElement, cropBox, 'image/png');
            break;
          }
          case 'rotate': {
            const rot = toolParams.rotation ?? 0;
            const fH = toolParams.flipH ?? false;
            const fV = toolParams.flipV ?? false;
            res = await rotateFlipImage(imgElement, rot, fH, fV, 'image/png');
            break;
          }
          case 'convert': {
            const targetFormat = toolParams.targetFormat || 'image/png';
            const quality = toolParams.quality ?? 0.92;
            const bgColor = toolParams.bgColor || '#ffffff';
            res = await convertFormat(imgElement, targetFormat, quality, bgColor);
            break;
          }
          case 'favicon': {
            res = await generateFavicon(imgElement, {
              preset: toolParams.preset || 'package',
              bgColor: toolParams.bgColor || 'transparent',
              radius: toolParams.radius ?? 0
            });
            break;
          }
          case 'circle': {
            const minDim = Math.min(imageData.width, imageData.height);
            const radius = toolParams.radius ?? Math.round(minDim / 2);
            const cX = toolParams.centerX ?? Math.round(imageData.width / 2);
            const cY = toolParams.centerY ?? Math.round(imageData.height / 2);
            res = await circleCropImage(imgElement, cX, cY, radius);
            break;
          }
          case 'radius': {
            const r = toolParams.radius ?? 24;
            const bg = toolParams.bgColor || 'transparent';
            res = await cornerRadiusImage(imgElement, { radius: r, bgColor: bg });
            break;
          }
          case 'border': {
            res = await addBorderImage(imgElement, {
              borderWidth: toolParams.borderWidth ?? 16,
              borderColor: toolParams.borderColor ?? '#c65d21',
              radius: toolParams.radius ?? 12,
              mode: toolParams.mode || 'auto'
            });
            break;
          }
          case 'watermark': {
            res = await watermarkImage(imgElement, {
              text: toolParams.text ?? '© Image Utility',
              opacity: toolParams.opacity ?? 0.7,
              position: toolParams.position ?? 'bottom-right',
              fontSize: toolParams.fontSize ?? 28,
              color: toolParams.color ?? '#ffffff'
            });
            break;
          }
          case 'adjust': {
            res = await adjustImage(imgElement, {
              brightness: toolParams.brightness ?? 100,
              contrast: toolParams.contrast ?? 100,
              saturation: toolParams.saturation ?? 100,
              warmth: toolParams.warmth ?? 0,
              blur: toolParams.blur ?? 0,
              sepia: toolParams.sepia ?? 0,
              grayscale: toolParams.grayscale ?? 0,
              hueRotate: toolParams.hueRotate ?? 0,
              invert: toolParams.invert ?? 0,
              vignette: toolParams.vignette ?? 0
            });
            break;
          }
          case 'pdf': {
            const pdfRes = await generatePdf(imgElement, {
              pageSize: toolParams.pageSize || 'a4',
              orientation: toolParams.orientation || 'auto',
              margin: toolParams.margin || 'normal',
              fitMode: toolParams.fitMode || 'contain'
            });
            res = {
              blob: pdfRes.blob,
              url: imageData.dataUrl,
              width: imageData.width,
              height: imageData.height,
              size: pdfRes.size,
              isPdf: true,
              pdfBlob: pdfRes.blob
            };
            break;
          }
          case 'metadata': {
            const targetFormat = toolParams.format || imageData.type || 'image/jpeg';
            const quality = toolParams.quality ?? 0.92;
            res = await stripMetadata(imgElement, targetFormat, quality);
            break;
          }
          default:
            break;
        }

        if (!cancelled && res) {
          setProcessedResult(res);
        }
      } catch (err) {
        console.error('Processing error:', err);
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };

    const timer = setTimeout(process, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeTool, toolParams, imgElement]);

  const handleDownload = () => {
    if (!processedResult) return;

    // Sanitize filename against path traversal, control chars, and reserved characters
    const rawName = imageData.name ? imageData.name.replace(/\.[^/.]+$/, '') : 'image';
    const baseName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '_').trim().slice(0, 100) || 'image';
    let filename = '';

    if (activeTool === 'pdf') {
      filename = `${baseName}-document.pdf`;
      downloadBlob(processedResult.pdfBlob, filename);
    } else if (activeTool === 'favicon') {
      filename = processedResult.filename || 'favicon_package.zip';
      downloadBlob(processedResult.blob, filename);
    } else {
      let ext = 'jpg';
      if (activeTool === 'circle' || activeTool === 'radius' || activeTool === 'border' || activeTool === 'watermark') {
        ext = 'png';
      } else if (activeTool === 'convert') {
        const fmt = toolParams.targetFormat || 'image/png';
        if (fmt === 'image/webp') ext = 'webp';
        else if (fmt === 'image/png') ext = 'png';
        else if (fmt === 'image/bmp') ext = 'bmp';
        else if (fmt === 'image/tiff') ext = 'tiff';
        else if (fmt === 'image/x-icon') ext = 'ico';
        else if (fmt === 'image/avif') ext = 'avif';
        else ext = 'jpg';
      } else if (activeTool === 'metadata') {
        const fmt = toolParams.format || imageData.type || 'image/jpeg';
        if (fmt.includes('png')) ext = 'png';
        else if (fmt.includes('webp')) ext = 'webp';
        else ext = 'jpg';
      } else if (imageData.type?.includes('png')) {
        ext = 'png';
      } else if (imageData.type?.includes('webp')) {
        ext = 'webp';
      }

      filename = activeTool === 'metadata'
        ? `${baseName}-cleaned.${ext}`
        : `${baseName}-${activeTool}.${ext}`;
      downloadBlob(processedResult.blob, filename);
    }

    onShowToast(`Downloaded ${filename}`);
  };

  const previewSrc = showOriginal
    ? imageData.dataUrl
    : (processedResult?.url || imageData.dataUrl);

  const currentWidth = processedResult?.width || imageData.width;
  const currentHeight = processedResult?.height || imageData.height;
  const currentSize = processedResult?.size || imageData.size;

  const sizeDiffPercent = imageData.size > 0 && currentSize > 0
    ? Math.round(((currentSize - imageData.size) / imageData.size) * 100)
    : 0;

  const activeToolDef = WORKSPACE_TOOLS.find((t) => t.id === activeTool) || WORKSPACE_TOOLS[0];
  const ToolIcon = activeToolDef.icon;

  return (
    <div className="workspace-main-wrapper">
      {/* SEO: Visible h1 for each tool page */}
      <h1 className="workspace-seo-h1">{activeToolDef.name} - Image Utility</h1>

      {/* Three Column Desktop Workspace */}
      <div className="workspace-desktop-grid">
        {/* Column 1: Left Navigation Sidebar */}
        <aside className="workspace-sidebar" ref={sidebarNavRef} aria-label="Image utility options">
          {WORKSPACE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                className={`sidebar-tool-card ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (onToolChange) {
                    onToolChange(tool.id);
                  } else {
                    setInternalTool(tool.id);
                  }
                  setToolParams({});
                }}
              >
                <div className="sidebar-tool-icon">
                  <Icon size={18} />
                </div>
                <div className="sidebar-tool-meta">
                  <span className="sidebar-tool-title">{tool.name}</span>
                  <span className="sidebar-tool-desc">{tool.desc}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Column 2: Central Preview & Canvas */}
        <section className="workspace-center">
          {/* Top File Info Card */}
          <div className="file-info-header-card">
            <div className="file-info-left">
              <img
                src={imageData.dataUrl}
                alt="thumbnail"
                className="file-info-thumb"
              />
              <div className="file-info-details">
                <span className="file-info-title">{imageData.name}</span>
                <span className="file-info-specs mono">
                  {formatBytes(imageData.size)} • {imageData.width} × {imageData.height} px
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="file"
                ref={canvasFileInputRef}
                style={{ display: 'none' }}
                accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleIncomingFile(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                className="btn-change-image"
                onClick={() => canvasFileInputRef.current?.click()}
                title="Select a replacement image from your device"
              >
                <UploadCloud size={14} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                className="btn-change-image"
                onClick={onBack}
                title="Return to homepage"
              >
                <ArrowLeft size={14} />
                <span>Change Image</span>
              </button>
            </div>
          </div>

          {/* Central Preview Card with Checkerboard and Direct Drag-and-Drop */}
          <div
            className={`preview-canvas-card ${isCanvasDragOver ? 'is-dragover' : ''}`}
            onDragEnter={handleCanvasDragEnter}
            onDragOver={handleCanvasDragOver}
            onDragLeave={handleCanvasDragLeave}
            onDrop={handleCanvasDrop}
          >
            {/* Direct Canvas Drop Overlay */}
            {isCanvasDragOver && (
              <div className="canvas-drop-overlay">
                <div className="canvas-drop-badge">
                  <div className="canvas-drop-icon-box">
                    <UploadCloud size={28} color="var(--color-accent)" />
                  </div>
                  <h4 className="canvas-drop-title">Drop new image here</h4>
                  <p className="canvas-drop-sub">Release to replace current image in workspace</p>
                  <div className="canvas-drop-pills">
                    <span>JPG</span>
                    <span>PNG</span>
                    <span>WEBP</span>
                    <span>BMP</span>
                    <span>GIF</span>
                  </div>
                </div>
              </div>
            )}
            {showOriginal && (
              <div className="compare-floating-badge">
                Original Image
              </div>
            )}
            <div className="preview-canvas-viewport">
              {activeTool === 'circle' && !showOriginal ? (
                <InteractiveCircleCrop
                  imageSrc={imageData.dataUrl}
                  naturalWidth={imageData.width}
                  naturalHeight={imageData.height}
                  cropState={{
                    centerX: toolParams.centerX ?? Math.round(imageData.width / 2),
                    centerY: toolParams.centerY ?? Math.round(imageData.height / 2),
                    radius: toolParams.radius ?? Math.round(Math.min(imageData.width, imageData.height) / 2)
                  }}
                  onChange={(newCrop) => setToolParams((prev) => ({ ...prev, ...newCrop }))}
                  zoomLevel={zoomLevel}
                  showOriginal={showOriginal}
                />
              ) : activeTool === 'crop' && !showOriginal ? (
                <InteractiveRectCrop
                  imageSrc={imageData.dataUrl}
                  naturalWidth={imageData.width}
                  naturalHeight={imageData.height}
                  cropBox={{
                    x: toolParams.x ?? 0,
                    y: toolParams.y ?? 0,
                    width: toolParams.width ?? imageData.width,
                    height: toolParams.height ?? imageData.height
                  }}
                  aspectRatio={toolParams.aspectRatio ?? null}
                  onChange={(newBox) => setToolParams((prev) => ({ ...prev, ...newBox }))}
                  zoomLevel={zoomLevel}
                  showOriginal={showOriginal}
                />
              ) : (
                <img
                  src={previewSrc}
                  alt="Preview"
                  className={`main-preview-img ${viewMode === 'fill' ? 'is-fill' : ''}`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center'
                  }}
                />
              )}
            </div>
          </div>

          {/* Bottom Toolbar below Canvas */}
          <div className="canvas-bottom-toolbar">
            {/* Zoom Controls */}
            <div className="toolbar-zoom-group">
              <button
                type="button"
                className="btn-tool-icon"
                onClick={() => setZoomLevel((z) => Math.max(0.25, z - 0.25))}
                title="Zoom out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="zoom-value-label mono">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                className="btn-tool-icon"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                title="Zoom in"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Fit / Fill buttons */}
            <div className="toolbar-fit-group">
              <button
                type="button"
                className={`btn-fit-toggle ${viewMode === 'fit' ? 'is-active' : ''}`}
                onClick={() => setViewMode('fit')}
              >
                Fit
              </button>
              <button
                type="button"
                className={`btn-fit-toggle ${viewMode === 'fill' ? 'is-active' : ''}`}
                onClick={() => setViewMode('fill')}
              >
                Fill
              </button>
            </div>

            <div className="toolbar-divider" />

            {/* Compare Toggle */}
            <div
              className="toolbar-compare-group"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              <Columns size={15} color="var(--color-text-secondary)" />
              <span className="compare-label">Compare</span>
              <div className={`switch-toggle ${showOriginal ? 'is-checked' : ''}`}>
                <span className="switch-thumb" />
              </div>
            </div>
          </div>
        </section>

        {/* Column 3: Contextual Settings Panel */}
        <aside className="workspace-controls-panel">
          {/* Header */}
          <div className="panel-header-block">
            <div className="panel-header-icon-box">
              <ToolIcon size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h3 className="panel-header-title">
                {activeTool === 'metadata'
                  ? 'Remove Metadata'
                  : activeTool === 'favicon'
                  ? 'Favicon Generator'
                  : activeTool === 'pdf'
                  ? 'Image to PDF'
                  : `${activeToolDef.name} Image`}
              </h3>
              <p className="panel-header-desc">{activeToolDef.desc}</p>
            </div>
          </div>

          {/* Dynamic Active Controls */}
          <div className="panel-controls-container">
            {activeTool === 'resize' && (
              <ResizeControls
                originalWidth={imageData.width}
                originalHeight={imageData.height}
                onChange={setToolParams}
              />
            )}

            {activeTool === 'compress' && (
              <CompressControls
                originalSize={imageData.size}
                onChange={setToolParams}
              />
            )}

            {activeTool === 'crop' && (
              <CropControls
                originalWidth={imageData.width}
                originalHeight={imageData.height}
                cropBox={{
                  x: toolParams.x ?? 0,
                  y: toolParams.y ?? 0,
                  width: toolParams.width ?? imageData.width,
                  height: toolParams.height ?? imageData.height
                }}
                activePreset={toolParams.activePreset ?? 'Free'}
                onChange={(newBox) => setToolParams((prev) => ({ ...prev, ...newBox }))}
              />
            )}

            {activeTool === 'rotate' && (
              <RotateControls
                onChange={setToolParams}
              />
            )}

            {activeTool === 'convert' && (
              <ConvertControls
                onChange={setToolParams}
              />
            )}

            {activeTool === 'favicon' && (
              <FaviconControls
                previewUrl={processedResult?.url || imageData.dataUrl}
                onChange={setToolParams}
              />
            )}

            {activeTool === 'circle' && (
              <CircleCropControls
                originalWidth={imageData.width}
                originalHeight={imageData.height}
                cropState={{
                  centerX: toolParams.centerX ?? Math.round(imageData.width / 2),
                  centerY: toolParams.centerY ?? Math.round(imageData.height / 2),
                  radius: toolParams.radius ?? Math.round(Math.min(imageData.width, imageData.height) / 2)
                }}
                onChange={(newCrop) => setToolParams((prev) => ({ ...prev, ...newCrop }))}
              />
            )}

            {activeTool === 'radius' && (
              <CornerRadiusControls
                originalWidth={imageData.width}
                originalHeight={imageData.height}
                onChange={setToolParams}
              />
            )}

            {activeTool === 'border' && (
              <AddBorderControls
                imgElement={imgElement}
                onChange={setToolParams}
              />
            )}

            {activeTool === 'watermark' && (
              <WatermarkControls
                onChange={setToolParams}
              />
            )}

            {activeTool === 'adjust' && (
              <AdjustControls
                onChange={setToolParams}
              />
            )}

            {activeTool === 'pdf' && (
              <PdfControls
                onChange={setToolParams}
              />
            )}

            {activeTool === 'metadata' && (
              <MetadataControls
                file={imageData.file}
                fileType={imageData.type}
                originalSize={imageData.size}
                onChange={setToolParams}
              />
            )}
          </div>

          {/* Live Result Box */}
          <div className="live-result-card">
            <div className="live-result-header">
              <span>Live Result</span>
              <Info size={14} color="var(--color-accent)" />
            </div>
            <div className="live-result-row">
              <span className="live-result-label">File Size</span>
              <span className="live-result-value mono" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                ~ {formatBytes(currentSize)} {sizeDiffPercent !== 0 && `(${sizeDiffPercent > 0 ? `+${sizeDiffPercent}` : sizeDiffPercent}%)`}
              </span>
            </div>
            <div className="live-result-row">
              <span className="live-result-label">Dimensions</span>
              <span className="live-result-value mono">
                {currentWidth} × {currentHeight} px
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-download-primary"
            onClick={handleDownload}
            disabled={processing || !processedResult}
          >
            <Download size={18} />
            <span>
              {activeTool === 'pdf'
                ? 'Download PDF'
                : activeTool === 'favicon'
                ? (processedResult?.filename ? `Download ${processedResult.filename}` : 'Download Favicon')
                : activeTool === 'metadata'
                ? 'Download Clean Image'
                : 'Download Image'}
            </span>
          </button>
        </aside>
      </div>

      {/* SEO & User Helpful Content: How-To Steps, Features, FAQs & Related Tools */}
      <ToolGuideSection toolId={activeTool} />
    </div>
  );
}
