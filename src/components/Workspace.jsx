import React, { useState, useEffect } from 'react';
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
  ShieldAlert
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
  cornerRadiusImage,
  convertFormat,
  rotateFlipImage,
  generatePdf,
  stripMetadata
} from '../utils/canvasEngine';
import ResizeControls from './tools/ResizeControls';
import CompressControls from './tools/CompressControls';
import CropControls from './tools/CropControls';
import CircleCropControls from './tools/CircleCropControls';
import CornerRadiusControls from './tools/CornerRadiusControls';
import ConvertControls from './tools/ConvertControls';
import RotateControls from './tools/RotateControls';
import PdfControls from './tools/PdfControls';
import MetadataControls from './tools/MetadataControls';

const TOOL_DEFINITIONS = [
  { id: 'resize', name: 'Resize', icon: Maximize2 },
  { id: 'compress', name: 'Compress', icon: FileDown },
  { id: 'crop', name: 'Crop', icon: Crop },
  { id: 'rotate', name: 'Rotate & Flip', icon: RotateCw },
  { id: 'convert', name: 'Convert', icon: Repeat },
  { id: 'circle', name: 'Circle Crop', icon: Circle },
  { id: 'radius', name: 'Corner Radius', icon: Square },
  { id: 'pdf', name: 'Image to PDF', icon: FileText },
  { id: 'metadata', name: 'Metadata', icon: ShieldAlert }
];

export default function Workspace({ imageData, initialTool = 'resize', onBack, onShowToast }) {
  const [activeTool, setActiveTool] = useState(initialTool);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [imgElement, setImgElement] = useState(null);

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
                toolParams.targetBytes || 200 * 1024
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
            const r = toolParams.radius ?? 32;
            res = await cornerRadiusImage(imgElement, r);
            break;
          }
          case 'convert': {
            const targetFormat = toolParams.targetFormat || 'image/png';
            const quality = toolParams.quality ?? 0.92;
            const bgColor = toolParams.bgColor || '#ffffff';
            res = await convertFormat(imgElement, targetFormat, quality, bgColor);
            break;
          }
          case 'rotate': {
            const rot = toolParams.rotation ?? 0;
            const fH = toolParams.flipH ?? false;
            const fV = toolParams.flipV ?? false;
            res = await rotateFlipImage(imgElement, rot, fH, fV, 'image/png');
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

    const timer = setTimeout(process, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeTool, toolParams, imgElement]);

  const handleDownload = () => {
    if (!processedResult) return;

    const baseName = imageData.name ? imageData.name.replace(/\.[^/.]+$/, '') : 'image';
    let filename = '';

    if (activeTool === 'pdf') {
      filename = `${baseName}-document.pdf`;
      downloadBlob(processedResult.pdfBlob, filename);
    } else {
      let ext = 'jpg';
      if (activeTool === 'circle' || activeTool === 'radius') ext = 'png';
      else if (activeTool === 'convert') {
        ext = toolParams.targetFormat === 'image/webp' ? 'webp' : toolParams.targetFormat === 'image/png' ? 'png' : 'jpg';
      } else if (imageData.type?.includes('png')) ext = 'png';
      else if (imageData.type?.includes('webp')) ext = 'webp';

      filename = `${baseName}-${activeTool}.${ext}`;
      downloadBlob(processedResult.blob, filename);
    }

    onShowToast(`Downloaded ${filename}`);
  };

  const previewSrc = processedResult?.url || imageData.dataUrl;
  const currentWidth = processedResult?.width || imageData.width;
  const currentHeight = processedResult?.height || imageData.height;
  const currentSize = processedResult?.size || imageData.size;

  const sizeDiffPercent = imageData.size > 0 && currentSize > 0
    ? Math.round(((currentSize - imageData.size) / imageData.size) * 100)
    : 0;

  return (
    <div className="workspace-wrapper">
      {/* Topbar: Back action & secondary file metadata */}
      <div className="workspace-topbar">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={15} />
          <span>Change image</span>
        </button>

        <div className="file-info-pill">
          <span className="file-info-name">{imageData.name}</span>
          <span>•</span>
          <span className="mono">{formatBytes(imageData.size)}</span>
          <span>•</span>
          <span className="mono">{imageData.width} × {imageData.height} px</span>
        </div>
      </div>

      {/* Three-part Desktop Workspace Layout */}
      <div className="workspace-three-col">
        {/* Part 1: Tool Navigation Sidebar */}
        <aside className="tool-nav-sidebar">
          {TOOL_DEFINITIONS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`tool-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTool(t.id);
                  setToolParams({});
                }}
              >
                <Icon size={16} />
                <span>{t.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Part 2: Central Preview Area */}
        <div className="canvas-panel">
          <div className="canvas-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono">{currentWidth} × {currentHeight} px</span>
              {processing && (
                <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem' }}>
                  Processing...
                </span>
              )}
            </div>

            <div className="canvas-zoom-controls">
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.max(0.25, z - 0.25))}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                className="btn-zoom mono"
                style={{ width: 'auto', padding: '0 6px', fontSize: '0.75rem' }}
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          <div className="canvas-viewport">
            <img
              src={previewSrc}
              alt="Processed preview"
              className="preview-image"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center'
              }}
            />
          </div>
        </div>

        {/* Part 3: Contextual Settings Panel */}
        <aside className="settings-panel">
          <h3 className="settings-heading">
            {TOOL_DEFINITIONS.find((t) => t.id === activeTool)?.name || 'Settings'}
          </h3>

          {/* Active Tool Dynamic Controls */}
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
              onChange={setToolParams}
            />
          )}

          {activeTool === 'circle' && (
            <CircleCropControls
              originalWidth={imageData.width}
              originalHeight={imageData.height}
              onChange={setToolParams}
            />
          )}

          {activeTool === 'radius' && (
            <CornerRadiusControls
              originalWidth={imageData.width}
              originalHeight={imageData.height}
              onChange={setToolParams}
            />
          )}

          {activeTool === 'convert' && (
            <ConvertControls
              onChange={setToolParams}
            />
          )}

          {activeTool === 'rotate' && (
            <RotateControls
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

          {/* Result Statistics */}
          <div className="stats-card">
            <div className="stats-row">
              <span style={{ color: 'var(--color-text-secondary)' }}>Original:</span>
              <span className="mono">{formatBytes(imageData.size)}</span>
            </div>
            <div className="stats-row">
              <span style={{ color: 'var(--color-text-secondary)' }}>Estimated:</span>
              <span className="mono" style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                {formatBytes(currentSize)}
              </span>
            </div>
            {sizeDiffPercent !== 0 && (
              <div className="stats-row">
                <span style={{ color: 'var(--color-text-secondary)' }}>Size change:</span>
                <span
                  className="mono"
                  style={{
                    color: sizeDiffPercent < 0 ? 'var(--color-success)' : 'var(--color-warning)',
                    fontWeight: 600
                  }}
                >
                  {sizeDiffPercent > 0 ? `+${sizeDiffPercent}%` : `${sizeDiffPercent}%`}
                </span>
              </div>
            )}
            <div className="stats-row">
              <span style={{ color: 'var(--color-text-secondary)' }}>Dimensions:</span>
              <span className="mono">{currentWidth} × {currentHeight} px</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className="button-primary"
            onClick={handleDownload}
            disabled={processing || !processedResult}
          >
            <Download size={16} />
            <span>{activeTool === 'pdf' ? 'Download PDF' : 'Download Image'}</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
