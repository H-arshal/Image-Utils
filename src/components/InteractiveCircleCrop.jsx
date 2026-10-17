import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Interactive Circle Crop Component
 * Displays the green bounding box, red circular border, dashed rule-of-thirds grid,
 * and 8 resize handles exactly matching the user's reference mockup.
 */
export default function InteractiveCircleCrop({
  imageSrc,
  naturalWidth,
  naturalHeight,
  cropState, // { centerX, centerY, radius } in natural px
  onChange,
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

  // Pointer event handlers for moving and resizing the circle
  const handlePointerDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();

    setDragMode(mode);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialCenterX: cropState.centerX,
      initialCenterY: cropState.centerY,
      initialRadius: cropState.radius
    };
  };

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (e) => {
      if (!dragStartRef.current || imgLayout.scale <= 0) return;
      const { startX, startY, initialCenterX, initialCenterY, initialRadius } = dragStartRef.current;

      const deltaScreenX = e.clientX - startX;
      const deltaScreenY = e.clientY - startY;

      // Convert delta screen pixels to natural image pixels
      const deltaNaturalX = deltaScreenX / imgLayout.scale;
      const deltaNaturalY = deltaScreenY / imgLayout.scale;

      const minDim = Math.min(naturalWidth, naturalHeight);
      const minRadius = 20;
      const maxRadius = minDim / 2;

      if (dragMode === 'move') {
        const newCenterX = Math.max(
          initialRadius,
          Math.min(naturalWidth - initialRadius, initialCenterX + deltaNaturalX)
        );
        const newCenterY = Math.max(
          initialRadius,
          Math.min(naturalHeight - initialRadius, initialCenterY + deltaNaturalY)
        );

        onChange({
          ...cropState,
          centerX: Math.round(newCenterX),
          centerY: Math.round(newCenterY)
        });
      } else {
        // Handle resizing based on handle dragged
        let radiusDelta = 0;
        if (dragMode === 'r') radiusDelta = deltaNaturalX;
        else if (dragMode === 'l') radiusDelta = -deltaNaturalX;
        else if (dragMode === 'b') radiusDelta = deltaNaturalY;
        else if (dragMode === 't') radiusDelta = -deltaNaturalY;
        else if (dragMode === 'br') radiusDelta = (deltaNaturalX + deltaNaturalY) / 2;
        else if (dragMode === 'tl') radiusDelta = (-deltaNaturalX - deltaNaturalY) / 2;
        else if (dragMode === 'tr') radiusDelta = (deltaNaturalX - deltaNaturalY) / 2;
        else if (dragMode === 'bl') radiusDelta = (-deltaNaturalX + deltaNaturalY) / 2;

        const newRadius = Math.max(
          minRadius,
          Math.min(
            maxRadius,
            Math.min(
              initialCenterX,
              naturalWidth - initialCenterX,
              initialCenterY,
              naturalHeight - initialCenterY,
              initialRadius + radiusDelta
            )
          )
        );

        onChange({
          ...cropState,
          radius: Math.round(newRadius)
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
  }, [dragMode, imgLayout.scale, naturalWidth, naturalHeight, cropState, onChange]);

  // Convert natural crop state to displayed overlay screen coordinates
  const scale = imgLayout.scale || 1;
  const cx = imgLayout.x + cropState.centerX * scale;
  const cy = imgLayout.y + cropState.centerY * scale;
  const r = cropState.radius * scale;

  const boxX = cx - r;
  const boxY = cy - r;
  const boxSize = r * 2;

  // Handles: 4 corners + 4 edges
  const handleSize = 8;
  const handles = [
    { id: 'tl', x: boxX, y: boxY, cursor: 'nwse-resize' },
    { id: 't', x: cx, y: boxY, cursor: 'ns-resize' },
    { id: 'tr', x: boxX + boxSize, y: boxY, cursor: 'nesw-resize' },
    { id: 'r', x: boxX + boxSize, y: cy, cursor: 'ew-resize' },
    { id: 'br', x: boxX + boxSize, y: boxY + boxSize, cursor: 'nwse-resize' },
    { id: 'b', x: cx, y: boxY + boxSize, cursor: 'ns-resize' },
    { id: 'bl', x: boxX, y: boxY + boxSize, cursor: 'nesw-resize' },
    { id: 'l', x: boxX, y: cy, cursor: 'ew-resize' }
  ];

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
      {/* Base Image */}
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

      {/* SVG Interactive Overlay */}
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
            {/* Mask to darken area outside the circle */}
            <mask id="circle-crop-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx={cx} cy={cy} r={r} fill="black" />
            </mask>

            {/* Clip path for the rule-of-thirds grid lines so they stay inside circle */}
            <clipPath id="circle-inner-clip">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>

          {/* 1. Darkened outer shroud */}
          <rect
            x={imgLayout.x}
            y={imgLayout.y}
            width={imgLayout.width}
            height={imgLayout.height}
            fill="rgba(0, 0, 0, 0.45)"
            mask="url(#circle-crop-mask)"
            style={{ pointerEvents: 'none' }}
          />

          {/* 2. Rule-of-thirds grid lines inside circle (clipped) */}
          <g clipPath="url(#circle-inner-clip)" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1" strokeDasharray="3 3">
            {/* Horizontal grid lines */}
            <line x1={cx - r} y1={cy - r / 3} x2={cx + r} y2={cy - r / 3} />
            <line x1={cx - r} y1={cy + r / 3} x2={cx + r} y2={cy + r / 3} />
            {/* Vertical grid lines */}
            <line x1={cx - r / 3} y1={cy - r} x2={cx - r / 3} y2={cy + r} />
            <line x1={cx + r / 3} y1={cy - r} x2={cx + r / 3} y2={cy + r} />
            {/* Center crosshair */}
            <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} strokeWidth="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeDasharray="none" />
            <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} strokeWidth="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeDasharray="none" />
          </g>

          {/* 3. Green bounding box */}
          <rect
            x={boxX}
            y={boxY}
            width={boxSize}
            height={boxSize}
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            style={{ pointerEvents: 'none' }}
          />

          {/* 4. Red circle boundary */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth="2.2"
            style={{
              pointerEvents: 'all',
              cursor: 'move'
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          />

          {/* 5. 8 Green resize handles (matching user screenshot) */}
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
        </svg>
      )}
    </div>
  );
}
