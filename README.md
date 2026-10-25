<div align="center">

# 🖼️ Image Utils (Image Utility)

### A lightning-fast, privacy-first image editing & conversion suite running 100% in your browser.

**Zero server uploads · Zero tracking · Zero latency · 100% Client-Side Sandbox**

[![Live App: image-utils.site](https://img.shields.io/badge/Live_App-image--utils.site-f97316?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.image-utils.site/)

[![License: MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-image--utils.site-c65d21?style=flat-square&logo=googlechrome&logoColor=white)](https://www.image-utils.site/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25_Local_Sandbox-10b981?style=flat-square&logo=shield&logoColor=white)](#privacy--security-guarantee)
[![Linter: Oxlint](https://img.shields.io/badge/linter-oxlint-c65d21?style=flat-square)](https://oxc.rs/)
[![Deploy: Vercel](https://img.shields.io/badge/deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://www.image-utils.site/)
[![GitHub stars](https://img.shields.io/github/stars/h-arshal/Image-Utils?style=flat-square&color=c65d21)](https://github.com/h-arshal/Image-Utils/stargazers)

**[🚀 Try Image Utils Online](https://www.image-utils.site/) · [Portfolio](https://h-arshal.github.io/Portfolio/) · [GitHub](https://github.com/h-arshal) · [LinkedIn](https://www.linkedin.com/in/harshal-moon-064956174/) · [LeetCode](https://leetcode.com/u/harshal_jaipal/) · [Instagram](https://www.instagram.com/harshal.moon)**

[Quick start](#quick-start) · [13 Everyday Utilities](#13-everyday-utilities) · [How It Works](#how-it-works) · [Privacy & Security](#privacy--security-guarantee) · [Supported Formats](#supported-formats) · [FAQ](#faq) · [License](#license)

```bash
git clone https://github.com/h-arshal/Image-Utils.git && cd Image-Utils && npm install && npm run dev
```

</div>

> [!IMPORTANT]
> **100% Local Image Processing Guarantee:**  
> When you drop or select a photo, it is loaded directly into your browser's local memory via `FileReader` and rendered on an HTML5 `Canvas`. **Your images, file names, and metadata are never uploaded to any remote server or external cloud.** All processing happens locally on your machine.

---

## ⚡ Why Image Utility?

Most online converters and image editors force you to upload your sensitive photos, contracts, and avatars to their remote servers, wait in processing queues, and accept tracking cookies or subscription paywalls.

**Image Utility changes that:**

| Feature | Typical Online Converters | Image Utility |
| :--- | :--- | :--- |
| **Data Privacy** | Uploads photos to remote third-party servers | **100% Local in-browser sandbox (0 network bytes sent)** |
| **Speed & Latency** | Network upload & download bottlenecks | **Instant real-time manipulation via HTML5 Canvas 2D** |
| **Cost & Limits** | Subscriptions, paywalls, and daily limits | **Free, open source, no accounts, no watermarks** |
| **Security & EXIF** | Metadata frequently retained or logged | **Built-in EXIF scrubber to protect GPS coordinates** |
| **Reliability** | Requires high-speed internet connection | **Runs client-side; works entirely offline once loaded** |

---

## 🛠️ 13 Everyday Utilities

A complete, purpose-built creative suite tailored for designers, engineers, students, and content creators:

| Tool | Route | Primary Capabilities | Output Options |
| :--- | :--- | :--- | :--- |
| **Resize** | `/resize` | Pixel-perfect width/height scaling with aspect-ratio lock, custom dimensions, and dimension presets. | `PNG`, `JPEG`, `WebP` |
| **Compress** | `/compress` | Smart lossy/lossless compression via target file size (e.g., 200 KB) or interactive quality slider. | `JPEG`, `WebP` |
| **Convert Format** | `/convert` | High-fidelity cross-format conversion without server roundtrips. | `PNG`, `JPEG`, `WebP`, `BMP`, `AVIF`, `TIFF`, `ICO` |
| **Crop** | `/crop` | Freeform and preset aspect-ratio rectangular cropping (`1:1`, `16:9`, `4:3`, `3:2`). | `PNG`, `JPEG`, `WebP` |
| **Favicon Generator** | `/favicon` | Generates cross-platform multi-resolution favicon packages with standard Web Manifest configurations. | `.ICO`, `.PNG`, `ZIP` archive (7 sizes) |
| **Circle Crop** | `/circle` | Creates circular profile avatars and headshots with transparent backgrounds. | `PNG` (Transparent) |
| **Corner Radius** | `/radius` | Adds rounded corners with customizable pixel curvature radius. | `PNG`, `JPEG` |
| **Add Border** | `/border` | Outer photo framing with customizable border width, hex colors, and silhouette contour detection. | `PNG`, `JPEG`, `WebP` |
| **Rotate & Flip** | `/rotate` | Lossless 90°, 180°, 270° canvas rotation and horizontal / vertical mirror reflection. | `PNG`, `JPEG`, `WebP` |
| **Watermark** | `/watermark` | Embeds custom copyright text, typography size, opacity levels, and position alignments. | `PNG`, `JPEG`, `WebP` |
| **Adjust & Filters** | `/adjust` | Real-time exposure, contrast, saturation, warmth, blur, sepia, invert, and 9 color filter presets. | `PNG`, `JPEG`, `WebP` |
| **Image to PDF** | `/pdf` | Converts photos into clean, printable PDF documents with A4, Letter, and Fit-to-Page formatting. | `.PDF` (via jsPDF) |
| **Metadata Stripper** | `/metadata` | Inspects and strips sensitive camera serials, EXIF tags, software signatures, and GPS coordinates. | Clean `JPEG`, `PNG`, `WebP` |

---

## 🧠 How It Works

Image Utility leverages modern HTML5 browser capabilities to replace bulky server-side image processing engines (like ImageMagick or Sharp) with zero-latency client-side APIs:

```mermaid
flowchart LR
    A[User Selects File] --> B[FileReader API]
    B --> C[Local RAM Buffer]
    C --> D[HTML5 2D Canvas]
    D --> E[Real-Time Sliders & Filters]
    E --> F[Client-Side Blob / ArrayBuffer]
    F --> G[Direct Browser Download]

    style A fill:#f1f5f9,stroke:#cbd5e1,stroke-width:1px
    style C fill:#fff4eb,stroke:#f3c7a8,stroke-width:1px
    style D fill:#fff4eb,stroke:#c65d21,stroke-width:2px
    style G fill:#ecfdf5,stroke:#10b981,stroke-width:2px
```

1. **FileReader & Object URLs**: Files are read into client RAM as non-persistent buffers (`blob:` or `data:`).
2. **Hardware-Accelerated Canvas**: Pixel manipulations execute through 2D Canvas rendering contexts.
3. **ArrayBuffer Scrubbing**: Binary EXIF markers (APP1 0xFFE1 blocks) are stripped directly in byte streams.
4. **Local Stream Export**: Files are generated as `Blob` objects and triggered via synthetic download anchors.

---

## 🔒 Privacy & Security Guarantee

As a project engineered by a cybersecurity researcher, Image Utility implements defense-in-depth client-side sandboxing:

- **Zero Network Egress:** Your image data is never packaged into `POST` or `PUT` payloads. You can inspect your browser's Network DevTools tab to verify that zero bytes leave your machine.
- **50 MB File Size Ceiling:** Protects client-side RAM from out-of-memory browser tab crashes on mobile devices.
- **12,000 px Dimension Boundary:** Restricts hardware canvas allocation to safe GPU surface limits.
- **Vector Code Sanitization:** SVG vector uploads are intentionally excluded to prevent cross-site scripting (XSS) payload injection via embedded SVG `<script>` tags.
- **Zero Cookies & Zero Tracking:** No third-party analytics (Google Analytics, Mixpanel, Segment), no tracking beacons, and no marketing cookies.
- **Automatic Buffer Deallocation:** Closing your browser tab or clicking the logo resets all allocated Object URLs and Canvas buffers immediately.

---

## 📦 Supported Formats

### Input Formats
- `JPEG` (`.jpg`, `.jpeg`)
- `PNG` (`.png`)
- `WebP` (`.webp`)
- `BMP` (`.bmp`)
- `GIF` (`.gif` - first frame)

### Output Formats
- **Raster Formats:** `PNG` (with Alpha transparency), `JPEG` (custom quality), `WebP`, `BMP`, `AVIF`, `TIFF`, `ICO`
- **Document Formats:** `PDF` (via `jsPDF`)
- **Multi-Asset Archives:** `.ZIP` Favicon Package containing 16x16, 32x32, 48x48, 180x180, 192x192, 512x512 icons and web manifest (via `JSZip`)

---

## 🚀 Quick Start

> **Prefer not to run code locally?** Use the live, production-grade web application directly at **[https://www.image-utils.site/](https://www.image-utils.site/)** — zero installation required.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` (bundled with Node.js)

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/h-arshal/Image-Utils.git

# 2. Enter the repository
cd Image-Utils

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles optimized production bundle into `dist/`. |
| `npm run preview` | Previews the compiled production bundle locally. |
| `npm run lint` | Runs `oxlint` for high-speed JavaScript and React lint checks. |

---

## 🚢 Deployment

Image Utility builds into a static Single Page Application (SPA). It can be hosted on any static edge network:

- **Vercel (Recommended):** Pre-configured with [`vercel.json`](vercel.json) for SPA client-side routing rewrites and strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Permissions-Policy`).
- **Netlify & Cloudflare Pages:** Pre-configured with [`public/_redirects`](public/_redirects) for client-side route fallback.
- **GitHub Pages:** Serve from the `dist/` branch or configure a GitHub Actions deployment.

---

## ❓ FAQ

<details>
<summary><strong>Do my images ever touch an external server or AI API?</strong></summary>

**No, never.** All pixel computations, filters, crops, and conversions happen directly in your browser's local memory using HTML5 Canvas. No data is ever transmitted over the network.
</details>

<details>
<summary><strong>Can I use Image Utility without an internet connection?</strong></summary>

**Yes.** Once the web application is loaded in your browser tab, all tools execute 100% offline. You can disconnect your Wi-Fi and continue resizing, cropping, and converting images without interruption.
</details>

<details>
<summary><strong>Are there file size or upload limits?</strong></summary>

To prevent your browser tab from exhausting device RAM (especially on smartphones or older laptops), file imports are capped at **50 MB** and dimensions at **12,000 px**.
</details>

<details>
<summary><strong>Why are SVG files not supported for conversion?</strong></summary>

SVGs are XML vector code that can contain executable `<script>` tags, presenting cross-site scripting (XSS) risks. Because Image Utility is designed with strict security standards, untrusted vector code is intentionally excluded.
</details>

<details>
<summary><strong>Is Image Utility free and open source?</strong></summary>

**Yes.** Image Utility is open source under the permissive [MIT License](LICENSE). There are no subscriptions, paywalls, watermark stamps, or account sign-ups.
</details>

---

## 👤 Author & Connect

**Harshal Moon**  
*Software Engineer & Cybersecurity Researcher*

<div align="left">

[![Portfolio](https://img.shields.io/badge/Portfolio-h--arshal.github.io-c65d21?style=flat-square&logo=google-chrome&logoColor=white)](https://h-arshal.github.io/Portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-@h--arshal-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/h-arshal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshal_Moon-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/harshal-moon-064956174/)
[![LeetCode](https://img.shields.io/badge/LeetCode-harshal__jaipal-FFA116?style=flat-square&logo=leetcode&logoColor=white)](https://leetcode.com/u/harshal_jaipal/)
[![Instagram](https://img.shields.io/badge/Instagram-@harshal.moon-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/harshal.moon)

</div>

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are very welcome!  
Feel free to open an issue or submit a pull request:

1. Fork the Project (`https://github.com/h-arshal/Image-Utils/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingUtility`)
3. Commit your Changes (`git commit -m 'feat: add AmazingUtility'`)
4. Push to the Branch (`git push origin feature/AmazingUtility`)
5. Open a Pull Request on [GitHub Pull Requests](https://github.com/h-arshal/Image-Utils/pulls)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

```text
Copyright (c) 2026 Harshal Moon
Licensed under the MIT License.
```
