import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Interactive Rectangular Crop Component
 * Features an interactive crop box with 8 resize handles, darkened outer shroud,
 * dashed rule-of-thirds grid, center crosshair, dimension indicator,
 * and aspect-ratio preservation.
 */
export default function InteractiveRectCrop({
  imageSrc,
  naturalWidth,
  naturalHeight,
  cropBox, // { x, y, width, height } in natural px
  onChange,
  aspectRatio = null, // null for free, or numeric (e.g. 16/9, 1)
  zoomLevel = 1,
  showOriginal = false
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [imgLayout, setImgLayout] = useState({ x: 0, y: 0, width: 0, height: 0, scale: 1 });
  const [dragMode, setDragMode] = useState(null); // 'move' or handle id ('tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l')
  const dragStartRef = useRef(null);

  // Measure rendered image layout relative to container
  const updateLayout = useCallback(() => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const container = containerRef.current;

    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const scale = naturalWidth > 0 ? imgRect.width / naturalWidth : 1;

    setImgLayout({
      x: imgRect.left - containerRect.left,
      y: imgRect.top - containerRect.top,
      width: imgRect.width,
      height: imgRect.height,
      scale
    });
  }, [naturalWidth]);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout, zoomLevel, imageSrc]);

  // Pointer event handlers for moving and resizing
  const handlePointerDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();

    setDragMode(mode);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox }
    };
  };

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (e) => {
      if (!dragStartRef.current || imgLayout.scale <= 0) return;
      const { startX, startY, initialBox } = dragStartRef.current;

      const deltaNaturalX = (e.clientX - startX) / imgLayout.scale;
      const deltaNaturalY = (e.clientY - startY) / imgLayout.scale;

      const minSize = 20;

      if (dragMode === 'move') {
        const maxX = Math.max(0, naturalWidth - initialBox.width);
        const maxY = Math.max(0, naturalHeight - initialBox.height);
        const newX = Math.max(0, Math.min(maxX, initialBox.x + deltaNaturalX));
        const newY = Math.max(0, Math.min(maxY, initialBox.y + deltaNaturalY));

        onChange({
          ...initialBox,
          x: Math.round(newX),
          y: Math.round(newY)
        });
      } else {
        // Handle resizing with or without aspect ratio
        let newX = initialBox.x;
        let newY = initialBox.y;
        let newW = initialBox.width;
        let newH = initialBox.height;

        if (aspectRatio) {
          // Constrained aspect ratio resizing
          if (dragMode === 'r') {
            newW = Math.max(minSize, Math.min(naturalWidth - initialBox.x, initialBox.width + deltaNaturalX));
            newH = newW / aspectRatio;
            if (newY + newH > naturalHeight) {
              newH = naturalHeight - newY;
              newW = newH * aspectRatio;
            }
          } else if (dragMode === 'l') {
            const maxDeltaL = initialBox.width - minSize;
            const clampedDeltaL = Math.max(-initialBox.x, Math.min(maxDeltaL, deltaNaturalX));
            newW = initialBox.width - clampedDeltaL;
            newH = newW / aspectRatio;
            if (newY + newH > naturalHeight) {
              newH = naturalHeight - newY;
              newW = newH * aspectRatio;
            }
            newX = initialBox.x + (initialBox.width - newW);
          } else if (dragMode === 'b') {
            newH = Math.max(minSize, Math.min(naturalHeight - initialBox.y, initialBox.height + deltaNaturalY));
            newW = newH * aspectRatio;
            if (newX + newW > naturalWidth) {
              newW = naturalWidth - newX;
              newH = newW / aspectRatio;
            }
          } else if (dragMode === 't') {
            const maxDeltaT = initialBox.height - minSize;
            const clampedDeltaT = Math.max(-initialBox.y, Math.min(maxDeltaT, deltaNaturalY));
            newH = initialBox.height - clampedDeltaT;
            newW = newH * aspectRatio;
            if (newX + newW > naturalWidth) {
              newW = naturalWidth - newX;
              newH = newW / aspectRatio;
            }
            newY = initialBox.y + (initialBox.height - newH);
          } else if (dragMode === 'br') {
            const delta = (deltaNaturalX + deltaNaturalY * aspectRatio) / 2;
            newW = Math.max(minSize, Math.min(naturalWidth - initialBox.x, initialBox.width + delta));
            newH = newW / aspectRatio;
            if (initialBox.y + newH > naturalHeight) {
              newH = naturalHeight - initialBox.y;
              newW = newH * aspectRatio;
            }
          } else if (dragMode === 'tl') {
            const delta = (deltaNaturalX + deltaNaturalY * aspectRatio) / 2;
            const maxDelta = initialBox.width - minSize;
            const clampedDelta = Math.max(
              -initialBox.x,
              -initialBox.y * aspectRatio,
              Math.min(maxDelta, delta)
            );
            newW = initialBox.width - clampedDelta;
            newH = newW / aspectRatio;
            newX = initialBox.x + (initialBox.width - newW);
            newY = initialBox.y + (initialBox.height - newH);
          } else if (dragMode === 'tr') {
            const delta = (deltaNaturalX - deltaNaturalY * aspectRatio) / 2;
            newW = Math.max(minSize, Math.min(naturalWidth - initialBox.x, initialBox.width + delta));
            newH = newW / aspectRatio;
            if (initialBox.y + initialBox.height - newH < 0) {
              newH = initialBox.y + initialBox.height;
              newW = newH * aspectRatio;
            }
            newY = initialBox.y + initialBox.height - newH;
          } else if (dragMode === 'bl') {
            const delta = (-deltaNaturalX + deltaNaturalY * aspectRatio) / 2;
            newW = Math.max(minSize, Math.min(initialBox.x + initialBox.width, initialBox.width + delta));
            newH = newW / aspectRatio;
            if (initialBox.y + newH > naturalHeight) {
              newH = naturalHeight - initialBox.y;
              newW = newH * aspectRatio;
            }
            newX = initialBox.x + initialBox.width - newW;
          }
        } else {
          // Free resizing
          if (dragMode === 'r' || dragMode === 'br' || dragMode === 'tr') {
            newW = Math.max(minSize, Math.min(naturalWidth - initialBox.x, initialBox.width + deltaNaturalX));
          }
          if (dragMode === 'l' || dragMode === 'bl' || dragMode === 'tl') {
            const maxDeltaL = initialBox.width - minSize;
            const clampedDeltaL = Math.max(-initialBox.x, Math.min(maxDeltaL, deltaNaturalX));
            newX = initialBox.x + clampedDeltaL;
            newW = initialBox.width - clampedDeltaL;
          }

          if (dragMode === 'b' || dragMode === 'br' || dragMode === 'bl') {
            newH = Math.max(minSize, Math.min(naturalHeight - initialBox.y, initialBox.height + deltaNaturalY));
          }
          if (dragMode === 't' || dragMode === 'tr' || dragMode === 'tl') {
            const maxDeltaT = initialBox.height - minSize;
            const clampedDeltaT = Math.max(-initialBox.y, Math.min(maxDeltaT, deltaNaturalY));
            newY = initialBox.y + clampedDeltaT;
            newH = initialBox.height - clampedDeltaT;
          }
        }

        onChange({
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH)
        });
      }
    };

    const handlePointerUp = () => {
      setDragMode(null);
      dragStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragMode, imgLayout.scale, naturalWidth, naturalHeight, cropBox, aspectRatio, onChange]);

  // Convert natural crop coordinates to screen coordinates
  const scale = imgLayout.scale || 1;
  const boxX = imgLayout.x + cropBox.x * scale;
  const boxY = imgLayout.y + cropBox.y * scale;
  const boxW = cropBox.width * scale;
  const boxH = cropBox.height * scale;

  const handleSize = 8;
  const handles = [
    { id: 'tl', x: boxX, y: boxY, cursor: 'nwse-resize' },
    { id: 't', x: boxX + boxW / 2, y: boxY, cursor: 'ns-resize' },
    { id: 'tr', x: boxX + boxW, y: boxY, cursor: 'nesw-resize' },
    { id: 'r', x: boxX + boxW, y: boxY + boxH / 2, cursor: 'ew-resize' },
    { id: 'br', x: boxX + boxW, y: boxY + boxH, cursor: 'nwse-resize' },
    { id: 'b', x: boxX + boxW / 2, y: boxY + boxH, cursor: 'ns-resize' },
    { id: 'bl', x: boxX, y: boxY + boxH, cursor: 'nesw-resize' },
    { id: 'l', x: boxX, y: boxY + boxH / 2, cursor: 'ew-resize' }
  ];

  const midX = boxX + boxW / 2;
  const midY = boxY + boxH / 2;

  return (
    <div
      ref={containerRef}
      className="interactive-crop-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt="Crop target"
        className="main-preview-img"
        onLoad={updateLayout}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center'
        }}
      />

      {imgLayout.width > 0 && !showOriginal && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
        >
          <defs>
            <mask id="rect-crop-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect x={boxX} y={boxY} width={boxW} height={boxH} fill="black" />
            </mask>
          </defs>

          {/* 1. Dimmed outer region */}
          <rect
            x={imgLayout.x}
            y={imgLayout.y}
            width={imgLayout.width}
            height={imgLayout.height}
            fill="rgba(0, 0, 0, 0.45)"
            mask="url(#rect-crop-mask)"
            style={{ pointerEvents: 'none' }}
          />

          {/* 2. Rule of thirds grid inside box */}
          <g stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1" strokeDasharray="3 3">
            <line x1={boxX} y1={boxY + boxH / 3} x2={boxX + boxW} y2={boxY + boxH / 3} />
            <line x1={boxX} y1={boxY + (boxH * 2) / 3} x2={boxX + boxW} y2={boxY + (boxH * 2) / 3} />
            <line x1={boxX + boxW / 3} y1={boxY} x2={boxX + boxW / 3} y2={boxY + boxH} />
            <line x1={boxX + (boxW * 2) / 3} y1={boxY} x2={boxX + (boxW * 2) / 3} y2={boxY + boxH} />
            {/* Center crosshair */}
            <line x1={midX - 6} y1={midY} x2={midX + 6} y2={midY} strokeWidth="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeDasharray="none" />
            <line x1={midX} y1={midY - 6} x2={midX} y2={midY + 6} strokeWidth="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeDasharray="none" />
          </g>

          {/* 3. Green bounding box (interactive draggable area) */}
          <rect
            x={boxX}
            y={boxY}
            width={boxW}
            height={boxH}
            fill="transparent"
            stroke="#22c55e"
            strokeWidth="1.8"
            style={{
              pointerEvents: 'all',
              cursor: 'move'
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          />

          {/* 4. 8 Green resize handles */}
          {handles.map((h) => (
            <rect
              key={h.id}
              x={h.x - handleSize / 2}
              y={h.y - handleSize / 2}
              width={handleSize}
              height={handleSize}
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="1"
              style={{
                pointerEvents: 'all',
                cursor: h.cursor
              }}
              onPointerDown={(e) => handlePointerDown(e, h.id)}
            />
          ))}

          {/* 5. Floating Dimension Badge */}
          {boxW > 60 && boxH > 40 && (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={midX - 44}
                y={boxY > 30 ? boxY - 24 : boxY + 8}
                width="88"
                height="20"
                rx="4"
                fill="rgba(17, 24, 39, 0.85)"
              />
              <text
                x={midX}
                y={boxY > 30 ? boxY - 10 : boxY + 22}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="500"
                fontFamily="JetBrains Mono, monospace"
              >
                {Math.round(cropBox.width)} × {Math.round(cropBox.height)}
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
