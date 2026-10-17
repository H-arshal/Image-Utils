# V1 Features Detailed Technical Specification

This document breaks down the 9 core V1 features defined in the PRD, detailing inputs, UI controls, mathematical canvas operations, output formats, and edge cases for each tool.

---

## Tool 1: Resize Image

### Objective
Allow users to modify the pixel dimensions (width × height) of an image with optional aspect-ratio lock.

### Inputs & Controls
- **Width Input:** Number input (min: 1px, max: 10,000px).
- **Height Input:** Number input (min: 1px, max: 10,000px).
- **Aspect Ratio Lock:** Toggle switch/button (default: locked `true`).
  - Formula: $\text{Ratio} = \frac{\text{Width}_{\text{orig}}}{\text{Height}_{\text{orig}}}$.
  - When locked, changing Width updates $\text{Height} = \text{round}\left(\frac{\text{Width}}{\text{Ratio}}\right)$.
  - Changing Height updates $\text{Width} = \text{round}\left(\text{Height} \times \text{Ratio}\right)$.
- **Percentage Quick Presets:** `25%`, `50%`, `75%`, `100%`, `200%`.
- **Interpolation Quality:** High quality (`imageSmoothingEnabled = true`, `imageSmoothingQuality = 'high'`).

### Implementation Details
```javascript
const canvas = document.createElement('canvas');
canvas.width = targetWidth;
canvas.height = targetHeight;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
```

### Edge Cases & Validation
- Handling extreme downsizing: Downscaling by more than 50% in a single step can cause aliasing in standard canvas. Use stepped downscaling (halving canvas dimensions incrementally) if superior sharpness is needed.
- Rejection of negative or zero values.

---

## Tool 2: Compress Image

### Objective
Reduce the file size (bytes) of an image while preserving visual fidelity through lossy encoding or quality sliders.

### Inputs & Controls
- **Target File Size Mode:**
  - Target input (e.g., `500 KB`, `1 MB`, `200 KB`).
  - Iterative binary search algorithm that adjusts export quality between 0.05 and 0.98 to reach within $\pm 5\%$ of the target size without exceeding it.
- **Manual Quality Slider Mode:**
  - Range: `1%` to `100%` (step: 1%).
- **Live Output Statistics:**
  - Original size (e.g., `4.8 MB`) vs New size (e.g., `485 KB`).
  - Percentage saved (e.g., `-90%`).

### Implementation Strategy
```javascript
// Binary search for target file size in bytes
async function findOptimalQuality(canvas, mimeType, targetBytes, minQ = 0.05, maxQ = 0.95, maxSteps = 6) {
  let low = minQ, high = maxQ, bestBlob = null;
  for (let i = 0; i < maxSteps; i++) {
    const mid = (low + high) / 2;
    const blob = await new Promise(r => canvas.toBlob(r, mimeType, mid));
    bestBlob = blob;
    if (Math.abs(blob.size - targetBytes) < targetBytes * 0.05) break;
    if (blob.size > targetBytes) high = mid;
    else low = mid;
  }
  return bestBlob;
}
```

### Edge Cases
- PNG files do not support lossy quality parameter in `toBlob('image/png')`. If the input is PNG and user requests compression, offer option to convert to JPEG/WebP or downscale dimensions.

---

## Tool 3: Crop Image

### Objective
Allow free-form or preset aspect ratio rectangle cropping of an image.

### Presets
- `Free` (unconstrained)
- `1:1` (Square / Profile)
- `4:3` (Standard photo)
- `16:9` (Widescreen / Landscape banner)
- `3:2` (Classic 35mm film)
- `9:16` (Stories / Reels / Shorts)

### Controls & Visuals
- Interactive overlay box with 8 drag handles (corners and midpoints).
- Rule-of-thirds grid lines inside the crop boundary.
- Live readout of crop dimensions (`W × H px`).

### Implementation Details
```javascript
const canvas = document.createElement('canvas');
canvas.width = cropWidth;
canvas.height = cropHeight;
const ctx = canvas.getContext('2d');
ctx.drawImage(sourceImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
```

---

## Tool 4: Circle Crop

### Objective
Create a circular cutout of the image with a transparent background, ideal for avatars, profile photos, and badges.

### Controls & Visuals
- Circular viewport mask with drag-to-position and zoom slider (`100%` to `300%`).
- Center alignment snap button.
- Diameter indicator.

### Implementation Details
```javascript
const size = Math.min(cropWidth, cropHeight);
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
ctx.closePath();
ctx.clip(); // Creates circular stencil

ctx.drawImage(sourceImage, sourceX, sourceY, sourceW, sourceH, 0, 0, size, size);
// Must export as PNG or WebP to preserve alpha transparency!
```

---

## Tool 5: Corner Radius

### Objective
Apply smooth rounded corners to an image with transparent outer corners.

### Controls
- **Radius Slider:** `0px` to `50%` (or max `min(width, height) / 2`).
- **Unit toggle:** Pixels (`px`) or Percentage (`%`).
- **Live Preview:** Real-time CSS border-radius on preview container, followed by canvas clipping on export.

### Implementation Details
```javascript
const canvas = document.createElement('canvas');
canvas.width = sourceImage.naturalWidth;
canvas.height = sourceImage.naturalHeight;
const ctx = canvas.getContext('2d');

const r = calculatedRadiusInPx;
ctx.beginPath();
ctx.roundRect(0, 0, canvas.width, canvas.height, r);
ctx.clip();

ctx.drawImage(sourceImage, 0, 0);
// Export as PNG or WebP to keep corners transparent
```

---

## Tool 6: Format Conversion

### Objective
Convert between major web image formats: JPEG, PNG, and WebP.

### Matrix of Behaviors

| Source | Target | Transparency Handling | Compression Setting |
| :--- | :--- | :--- | :--- |
| PNG (transparent) | JPEG | Transparency replaced with customizable background (Default: White `#FFFFFF`) | Quality (0.1 - 1.0) |
| JPEG | PNG | Lossless RGB encoding | None (standard PNG) |
| JPEG / PNG | WebP | Preserves alpha if present | Quality (0.1 - 1.0) |

### Controls
- Format Selector: `JPEG`, `PNG`, `WebP`.
- Background fill color picker (only visible when converting transparent images to JPEG).
- Output quality slider (available for JPEG and WebP).

---

## Tool 7: Rotate & Flip

### Objective
Provide fast geometric orientation adjustments without image quality loss.

### Operations
- **Rotate 90° Clockwise:** Swaps width and height ($W' = H, H' = W$).
- **Rotate 90° Counter-Clockwise:** Swaps width and height.
- **Rotate 180°:** Keeps dimensions ($W' = W, H' = H$).
- **Flip Horizontal (Mirror X):** `ctx.scale(-1, 1)`.
- **Flip Vertical (Mirror Y):** `ctx.scale(1, -1)`.

### Implementation Details
```javascript
function renderTransformed(img, rotationDeg, flipH, flipV) {
  const rad = (rotationDeg * Math.PI) / 180;
  const is90or270 = Math.abs(rotationDeg % 180) === 90;
  const canvas = document.createElement('canvas');
  canvas.width = is90or270 ? img.naturalHeight : img.naturalWidth;
  canvas.height = is90or270 ? img.naturalWidth : img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return canvas;
}
```

---

## Tool 8: Image to PDF

### Objective
Embed an image into a clean, printable PDF document formatted for standard physical paper sizes or exact image proportions.

### Controls
- **Page Size:**
  - `A4` ($210 \times 297 \text{ mm}$)
  - `US Letter` ($8.5 \times 11 \text{ in}$)
  - `Fit to Image` (Page size matches exact image aspect ratio)
- **Orientation:** `Portrait` or `Landscape` (auto-selected based on image dimensions).
- **Margins:** `None (0mm)`, `Small (10mm)`, `Normal (20mm)`.
- **Page Fit Mode:** `Fit (Contain)` or `Fill (Cover)`.

### Implementation Details
Using `jsPDF` completely in-browser:
```javascript
import { jsPDF } from 'jspdf';

const doc = new jsPDF({
  orientation: isLandscape ? 'landscape' : 'portrait',
  unit: 'mm',
  format: pageSize // 'a4', 'letter', or [customW, customH]
});

// Calculate aspect-preserved width and height inside page bounds with margins
doc.addImage(imgDataUrl, 'JPEG', marginX, marginY, renderWidth, renderHeight);
doc.save('converted-document.pdf');
```

---

## Tool 9: Remove Image Metadata (EXIF Stripper)

### Objective
Scrub all personal identification tags, GPS coordinates, camera serials, timestamps, and camera settings from photos.

### Inspection & Display UI
- **Metadata Inspector Panel:** Shows found metadata prior to stripping:
  - GPS Coordinates (Latitude, Longitude, Altitude, Location link)
  - Device Make & Model (e.g. `Apple iPhone 15 Pro`)
  - Capture Date & Time
  - Software & Editing History
- **Strip & Export Action:**
  - Generates a 100% clean image file.
  - Displays confirmation badge: `"All EXIF, IPTC, and location data removed"`.

### Implementation Technique
Loading the image into an HTML5 Canvas and calling `canvas.toBlob()` naturally discards all metadata chunks because the canvas context holds only the raw decoded RGBA pixel buffer. Re-encoding creates fresh standard JPEG/PNG headers with zero private tags.
