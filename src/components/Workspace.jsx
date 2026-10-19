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
  RotateCw,
  FileText,
  ShieldAlert,
  Type,
  Sliders,
  Info,
  Columns
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
  adjustImage
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
import BottomDropzone from './BottomDropzone';
import InteractiveCircleCrop from './InteractiveCircleCrop';
import InteractiveRectCrop from './InteractiveRectCrop';
import CornerRadiusControls from './tools/CornerRadiusControls';

const WORKSPACE_TOOLS = [
  { id: 'resize', name: 'Resize', desc: 'Change image dimensions', icon: Maximize2 },
  { id: 'compress', name: 'Compress', desc: 'Reduce file size', icon: FileDown },
  { id: 'crop', name: 'Crop', desc: 'Trim to your perfect frame', icon: Crop },
  { id: 'circle', name: 'Circle Crop', desc: 'Create perfect circle images', icon: Circle },
  { id: 'radius', name: 'Corner Radius', desc: 'Round corners with transparent PNG', icon: Square },
  { id: 'border', name: 'Add Border', desc: 'Add custom borders', icon: Square },
  { id: 'rotate', name: 'Rotate', desc: 'Rotate and flip images', icon: RotateCw },
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
          case 'circle': {
            const minDim = Math.min(imageData.width, imageData.height);
            const radius = toolParams.radius ?? Math.round(minDim / 2);
            const cX = toolParams.centerX ?? Math.round(imageData.width / 2);
            const cY = toolParams.centerY ?? Math.round(imageData.height / 2);
            const zoom = toolParams.zoom ?? 1;
            res = await circleCropImage(imgElement, cX, cY, radius, zoom);
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
              radius: toolParams.radius ?? 12
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
            res = await stripMetadata(imgElement, imageData.type || 'image/jpeg');
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
    } else {
      let ext = 'jpg';
      if (activeTool === 'circle' || activeTool === 'radius' || activeTool === 'border' || activeTool === 'watermark') ext = 'png';
      else if (activeTool === 'convert') {
        ext = toolParams.targetFormat === 'image/webp' ? 'webp' : toolParams.targetFormat === 'image/png' ? 'png' : 'jpg';
      } else if (imageData.type?.includes('png')) ext = 'png';
      else if (imageData.type?.includes('webp')) ext = 'webp';

      filename = `${baseName}-${activeTool}.${ext}`;
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
      {/* Three Column Desktop Workspace */}
      <div className="workspace-desktop-grid">
        {/* Column 1: Left Navigation Sidebar */}
        <aside className="workspace-sidebar">
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

            <button
              type="button"
              className="btn-change-image"
              onClick={onBack}
            >
              <ArrowLeft size={15} />
              <span>Change Image</span>
            </button>
          </div>

          {/* Central Preview Card with Checkerboard */}
          <div className="preview-canvas-card">
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
              <h3 className="panel-header-title">{activeToolDef.name} Image</h3>
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

            {activeTool === 'circle' && (
              <CircleCropControls
                originalWidth={imageData.width}
                originalHeight={imageData.height}
                cropState={{
                  centerX: toolParams.centerX ?? Math.round(imageData.width / 2),
                  centerY: toolParams.centerY ?? Math.round(imageData.height / 2),
                  radius: toolParams.radius ?? Math.round(Math.min(imageData.width, imageData.height) / 2),
                  zoom: toolParams.zoom ?? 1
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

          {/* Primary Action Button */}
          <button
            type="button"
            className="btn-download-primary"
            onClick={handleDownload}
            disabled={processing || !processedResult}
          >
            <Download size={18} />
            <span>{activeTool === 'pdf' ? 'Download PDF' : 'Download Image'}</span>
          </button>
        </aside>
      </div>

      {/* Bottom Dropzone Card (Exactly as in Mockup) */}
      <BottomDropzone onFileLoaded={onFileLoaded} />
    </div>
  );
}
