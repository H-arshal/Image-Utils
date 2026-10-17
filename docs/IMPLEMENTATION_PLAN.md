# Implementation Plan & Roadmap

## 1. Directory Structure

```text
image-utils/
├── index.html                 # Single page application entry point
├── package.json               # Dependencies and scripts (Vite, jsPDF, lucide)
├── vite.config.js             # Vite configuration
├── src/
│   ├── main.js                # App bootstrap & event wiring
│   ├── state.js               # Reactive centralized state management
│   ├── styles/
│   │   ├── main.css           # Design tokens, reset, typography, layout
│   │   ├── dropzone.css       # Drag and drop styling & animations
│   │   ├── workspace.css      # Split-panel workspace & preview canvas
│   │   └── tools.css          # Tool-specific controls & widgets
│   ├── core/
│   │   ├── file-loader.js     # File reader, format detector, metadata reader
│   │   ├── canvas-engine.js   # Offscreen canvas transformations & export
│   │   ├── compressor.js      # Iterative binary search quality compressor
│   │   ├── pdf-engine.js      # Single-page client-side PDF generator (jsPDF)
│   │   └── exif-utils.js      # EXIF parser & privacy sanitizer
│   ├── components/
│   │   ├── Dropzone.js        # File dropzone & clipboard handler
│   │   ├── ToolGrid.js        # 9-tool navigation card grid
│   │   ├── PreviewCanvas.js   # Interactive viewport with zoom & checkerboard
│   │   └── Header.js          # Navigation & privacy badge
│   └── tools/
│       ├── ResizeTool.js      # Width, height, aspect ratio locking
│       ├── CompressTool.js    # File size reduction & quality controls
│       ├── CropTool.js        # Interactive rectangular crop with presets
│       ├── CircleCropTool.js  # Circular mask avatar cutout
│       ├── CornerRadiusTool.js# Rounded corners with transparency
│       ├── ConvertTool.js     # JPG, PNG, WebP format converter
│       ├── RotateTool.js      # 90° CW/CCW, 180°, Flip H/V
│       ├── PdfTool.js         # Image to A4/Letter/Fit PDF
│       └── MetadataTool.js    # EXIF inspection & privacy scrubber
├── docs/                      # Architectural and specification docs
└── tests/                     # Test cases & sample image fixtures
```

---

## 2. Phased Roadmap

### Phase 1: Scaffolding & Design Foundation
- Initialize lightweight Vite configuration with zero bloat.
- Build pure Vanilla CSS design system:
  - Custom color tokens (Obsidian, Indigo, Violet, Slate).
  - Modern typography with Google Fonts (`Inter` + `JetBrains Mono`).
  - Glassmorphic panels, glowing focus states, and responsive layout grids.
- Implement the Application Header with the live privacy badge indicator:
  `🔒 100% Client-Side • No Server Uploads`.

### Phase 2: Ingestion Engine & State Management
- Implement `state.js`:
  - Reactive state tracking `currentFile`, `imageBitmap`, `activeTool`, `processedBlob`, `processingStatus`.
- Implement `file-loader.js`:
  - Drag-and-drop zone with animated glow effects.
  - Native file picker button.
  - Global clipboard paste listener (`window.addEventListener('paste', ...)`).
  - File validation (MIME types, dimension retrieval, human-readable file size formatter).

### Phase 3: Core Canvas Engine & Transformation Modules
Implement individual tools in modular classes/functions:
1. **Resize Engine:** Aspect ratio locking math, percentage shortcuts (`25%`, `50%`, `75%`, `200%`), high-quality downsampling.
2. **Compression Engine:** Binary search convergence for exact target file size (e.g. `500 KB`).
3. **Crop Engine:** Visual crop overlay with preset aspect ratios (`Free`, `1:1`, `4:3`, `16:9`, `3:2`, `9:16`).
4. **Circle Crop Engine:** Circular `ctx.clip()` avatar mask with transparent PNG output.
5. **Corner Radius Engine:** Canvas `ctx.roundRect()` clipping with live radius preview slider.
6. **Format Conversion Engine:** Lossless/lossy matrix between JPEG, PNG, and WebP with customizable background fallback for alpha-to-JPEG.
7. **Orientation Engine:** 90° CW/CCW, 180°, Horizontal & Vertical matrix flips without degradation.
8. **PDF Engine:** Client-side A4, Letter, and Fit-to-Page PDF generation using `jsPDF`.
9. **Metadata Sanitizer:** EXIF/GPS inspector and clean pixel re-encoder.

### Phase 4: UI/UX Workspace & Download Pipeline
- Split-screen workspace view:
  - Left pane: Responsive preview canvas with zoom controls (`Fit`, `100%`, `200%`) and checkerboard transparency grid.
  - Right pane: Dedicated tool controls, real-time statistics (original size vs new size, dimension changes), and prominent `Download` button.
- Clean filename generator (e.g. `original-resized-1920x1080.jpg`, `avatar-circle.png`).
- Direct blob download trigger with memory cleanup (`URL.revokeObjectURL`).

### Phase 5: Verification & Quality Assurance
- **Stress test with high-resolution images:** Verify smooth performance on 24MP+ images without browser crashes.
- **Alpha channel verification:** Confirm transparent backgrounds stay transparent on PNG/WebP exports for Circle Crop and Corner Radius.
- **Privacy test:** Inspect exported files with EXIF tooling to confirm zero GPS or camera metadata leaks.
- **Cross-browser check:** Ensure complete functionality across Chrome, Firefox, Safari, and Edge.
