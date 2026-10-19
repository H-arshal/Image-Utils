# Image Utility

> **Everyday image tools. Simple, private, 100% in-browser.**  
> Fast, client-side image editing with zero server uploads, zero tracking, and zero latency.

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-success.svg)](#privacy--security-guarantee)

---

## Overview

**Image Utility** is a modern, lightweight web application that provides 12 essential image editing and conversion utilities directly inside the user's browser. Unlike typical online image converters that upload personal files to remote servers, Image Utility processes everything locally using browser Canvas 2D and Web Workers.

---

## 12 Everyday Image Utilities

| Tool | Route | Description |
| :--- | :--- | :--- |
| **Resize** | `/resize` | Resize image width and height with aspect ratio lock or custom dimensions. |
| **Compress** | `/compress` | Reduce file size using target KB or interactive quality slider. |
| **Crop** | `/crop` | Crop rectangular regions with freeform handles or 1:1, 16:9, and 4:3 presets. |
| **Circle Crop** | `/circle` | Create circular profile avatars with transparent PNG output and interactive handles. |
| **Corner Radius** | `/radius` | Apply smooth rounded corners with transparent outer clipping or color background. |
| **Add Border** | `/border` | Frame photos with customizable border widths, colors, and inner radius. |
| **Adjust & Filters** | `/adjust` | Exposure, contrast, saturation, warmth, vignette, blur, and 9 Instagram-style filters. |
| **Rotate & Flip** | `/rotate` | Rotate 90°, 180°, 270° or mirror flip horizontally and vertically. |
| **Convert Format** | `/convert` | Seamlessly convert between PNG, JPEG, and WebP formats. |
| **Add Watermark** | `/watermark` | Protect photos with customizable text watermark copyright, opacity, and positioning. |
| **Image to PDF** | `/pdf` | Generate printable single-page PDF documents (A4, Letter, or Fit-to-Image). |
| **Metadata Stripper**| `/metadata` | Inspect and scrub EXIF, camera serials, and GPS location coordinates. |

---

## Privacy & Security Guarantee

- **Zero Server Uploads:** Images, filenames, and metadata are **never** transmitted over the network.
- **Client-Side Sandbox:** All pixel manipulations execute in your device's memory using HTML5 Canvas.
- **Zero Cookies & Zero Analytics:** No tracking scripts, advertising networks, or third-party tracking.
- **Memory Safety:** Blobs and Object URLs are revoked automatically upon changing images or closing tabs.
- **Strict Input Validation:** Rejects unsafe vector SVGs, limits maximum dimensions to 12,000 px, and caps file uploads to 50 MB to prevent client-side resource exhaustion.

---

## Supported Formats

- **Import:** `JPEG` (`.jpg`, `.jpeg`), `PNG` (`.png`), `WebP` (`.webp`), `BMP` (`.bmp`), `GIF` (`.gif`)
- **Export:** `PNG`, `JPEG`, `WebP`, and `PDF` (via jsPDF)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/H-arshal/Image-Utils.git

# Navigate to project directory
cd Image-Utils

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Compile and optimize production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment

The application compiles to a static Single Page Application (SPA) in the `dist/` directory.

### Vercel
A [`vercel.json`](./vercel.json) file is included with SPA rewrites and recommended HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Connect the repository on Vercel and it deploys automatically.

### Netlify & Cloudflare Pages
A [`public/_redirects`](./public/_redirects) file is included to support client-side routing on nested paths (`/resize`, `/crop`, etc.). Set build command to `npm run build` and publish directory to `dist`.

---

## License

This project is open-source. We recommend the [MIT License](https://opensource.org/licenses/MIT). See the repository settings to select and apply your preferred license.

---

## Feedback & Contributions

Bug reports, feature requests, and pull requests are welcome on [GitHub Issues](https://github.com/H-arshal/Image-Utils/issues).
