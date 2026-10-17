# Technical Architecture: Image Utility

## 1. System Overview

**Image Utility** is an entirely client-side, zero-server-upload image manipulation web application. All computations, decoding, transformations, re-encoding, and document generation occur strictly in the user's browser environment using standard Web APIs, HTML5 Canvas, Web Workers, and lightweight client-side libraries.

```text
┌─────────────────────────────────────────────────────────────┐
│                       Browser Window                        │
│                                                             │
│  ┌─────────────────┐       ┌──────────────────────────────┐ │
│  │   UI & Router   │ <---> │     Application State        │ │
│  │  (DOM / CSS)    │       │ (Active Image, History, Tool)│ │
│  └─────────────────┘       └──────────────┬───────────────┘ │
│           │                               │                 │
│           ▼                               ▼                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             Core Image Engine (Canvas API)             │ │
│  │  - Scaler / Resizer          - Crop & Clip Geometry    │ │
│  │  - Compression Engine        - Transform / Orientation │ │
│  │  - Metadata Sanitizer        - Format Converter        │ │
│  └────────────────────────────────────────────────────────┘ │
│           │                               │                 │
│           ▼                               ▼                 │
│  ┌─────────────────┐       ┌──────────────────────────────┐ │
│  │  PDF Generator  │       │     Export & Download        │ │
│  │  (jsPDF engine) │       │ (Blob URLs / Stream Saver)   │ │
│  └─────────────────┘       └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Zero-Server Footprint (Zero Uploads):**
   - No image or document data ever leaves the client device.
   - Operable completely offline once assets are cached (PWA ready).
   - Complies with strict privacy postures (HIPAA, GDPR, enterprise security).

2. **Non-Destructive Pipeline:**
   - The original file buffer (`ArrayBuffer` or `File`) is preserved in memory as an immutable source of truth.
   - Every transformation renders to an off-screen intermediate canvas or creates a new derived Blob, preventing quality degradation from sequential lossy operations.

3. **Memory Safety & Resource Lifecycle Management:**
   - Image files can quickly exhaust client RAM (e.g., a 48MP smartphone photo uncompresses to ~192MB raw RGBA bitmap data in canvas memory).
   - Rigorous cleanup using `URL.revokeObjectURL()`, explicit canvas dimension resetting (`canvas.width = 0; canvas.height = 0;`), and releasing typed arrays.

4. **Predictable Performance:**
   - Immediate responsive UI feedback using lower-resolution viewports/CSS preview layers for interactive manipulations (e.g. crop drag, radius slider).
   - High-fidelity full-resolution processing on final apply and export.

---

## 3. Technology Stack Recommendation

| Layer | Recommended Technology | Justification |
| :--- | :--- | :--- |
| **Bundler & Build Tool** | **Vite** | Ultra-fast HMR, tiny production footprint, modern ESM handling. |
| **Language** | **TypeScript / Modern ES6+** | Strict typing for canvas geometric transformations, file specs, and blob pipelines. |
| **UI Styling** | **Vanilla CSS (Custom Properties / Design Tokens)** | Zero CSS-in-JS runtime overhead, maximum rendering speed, fluid dark/light design system. |
| **Canvas Operations** | **HTML5 Canvas 2D Context API** | Native, hardware-accelerated, universally supported in all modern browsers. |
| **PDF Generation** | **jsPDF** (client-side only) | Lightweight (~100kb), robust single-page image-to-PDF embedding with accurate dimension/DPI math. |
| **Icons & Micro-animations** | **Lucide Icons (SVG)** + CSS transitions | Clean, vector-sharp icons with zero dependency weight. |

---

## 4. Processing Pipeline & Data Flow

```text
1. File Selection / Drag & Drop
   │
   ├─► Read File into Memory via FileReader / createImageBitmap()
   │   Extract metadata: filename, original format, byte size, dimensions
   │
2. Store in Central State Manager
   │
3. Tool Activation (e.g., Resize, Compress, Circle Crop)
   │
   ├─► Interactive Preview:
   │   Canvas or CSS-filtered preview rendered at screen DPI
   │
   ├─► Parameter Adjustment:
   │   Real-time parameter computation (dimensions, quality, radius, crop box)
   │
4. Process Execution:
   │
   ├─► Render to Full-Resolution Offscreen Canvas
   │   Apply transformation matrices (translate, rotate, scale, clip)
   │
5. Export & Encoding:
   │
   ├─► canvas.toBlob(callback, mimeType, quality)
   │   Calculate output file size
   │
6. User Download:
   │   Dynamic anchor `<a download="...">` with `URL.createObjectURL(blob)`
   │   Automatic cleanup on component unmount
```

---

## 5. Metadata & Privacy Engine

When a digital photograph is taken, cameras attach EXIF/IPTC/XMP metadata (GPS location coordinates, camera model, date/time, serial numbers, lens specifications).

- **Default Canvas Re-rendering Sanitization:** Standard browser `ctx.drawImage()` paints raw raster pixels to an HTML5 canvas. Calling `canvas.toBlob()` re-encodes pure pixel data, inherently stripping all EXIF/GPS metadata chunks.
- **Orientation Awareness:** Browsers automatically honor EXIF orientation tags during `createImageBitmap()` or standard `<img>` decoding in modern standards, ensuring rotated photos do not get skewed during metadata stripping.

---

## 6. Error Handling & Edge Case Strategy

1. **Unsupported Format / Corrupted Files:**
   - Detect MIME type via magic bytes or file header verification, not just file extensions.
   - Catch decoding errors early during `img.onerror` or `createImageBitmap()` rejection.

2. **Browser Canvas Limits (Large Images):**
   - Mobile Safari and certain Android/Chrome viewports limit canvas to 4096×4096 or 16 megapixels.
   - Detect maximum canvas dimensions (`MAX_CANVAS_WIDTH`, `MAX_CANVAS_HEIGHT`) and downsample gracefully with user notification if dimensions exceed safe device thresholds.

3. **Memory Pressure:**
   - Avoid creating multiple simultaneous canvas instances. Reuse a persistent worker or single off-screen canvas context wherever possible.
