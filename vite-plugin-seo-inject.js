/**
 * vite-plugin-seo-inject.js
 *
 * At build time, generates a separate HTML file for each route defined in ROUTE_SEO.
 * Both /dist/<route>.html and /dist/<route>/index.html are generated.
 * Each file has:
 *  - Route-specific <title>
 *  - Route-specific <meta name="title"> and <meta name="description">
 *  - Correct <link rel="canonical" href="https://www.image-utils.site/<route>">
 *  - Route-specific OpenGraph (og:title, og:description, og:url)
 *  - Route-specific Twitter Card metadata
 *  - Pre-rendered H1 and hero description in #root
 *  - Schema.org BreadcrumbList structured data for rich snippets in Google Search
 *
 * This completely resolves the SPA indexing issue on Googlebot, Bingbot, and AI crawlers.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ORIGIN = 'https://www.image-utils.site';

/**
 * Route SEO configuration (mirrors and enhances ROUTE_SEO in src/App.jsx)
 */
const ROUTE_SEO = {
  resize: {
    title: 'Resize Image Online | Image Utils – Free In-Browser Tool',
    h1: 'Resize Image Dimensions Online',
    desc: 'Resize image dimensions with aspect ratio lock or custom width and height. 100% private in-browser resizing with Image Utils.',
    keywords: 'resize image online, resize picture, image resizer, change image dimensions, scale photo free',
  },
  compress: {
    title: 'Compress Image Online (Reduce KB) | Image Utils – Free Tool',
    h1: 'Compress Images Online to Target Size',
    desc: 'Compress images to a target file size or custom quality slider directly in your browser without quality loss using Image Utils.',
    keywords: 'compress image, reduce image size, compress jpeg, compress png to kb, shrink image size online',
  },
  crop: {
    title: 'Crop Image Online (Freeform & Presets) | Image Utils',
    h1: 'Crop Images Online with Presets & Freeform',
    desc: 'Crop rectangular regions with 1:1, 16:9, 4:3, or custom freeform crop boxes. Free, private, in-browser with Image Utils.',
    keywords: 'crop image online, photo cropper, crop picture freeform, image aspect ratio crop',
  },
  circle: {
    title: 'Circle Crop Image (Round Avatar Maker) | Image Utils',
    h1: 'Circle Crop Photos & Make Round Avatars',
    desc: 'Create circular profile pictures and avatars with transparent PNG output. Free circle crop tool by Image Utils.',
    keywords: 'circle crop, round avatar maker, circular profile picture, crop photo into circle, round pfp',
  },
  radius: {
    title: 'Round Image Corners (Corner Radius) | Image Utils',
    h1: 'Round Image Corners with Custom Radius',
    desc: 'Add clean rounded corners to photos with transparent PNG or custom background fill. Free corner radius tool by Image Utils.',
    keywords: 'round image corners, corner radius image, rounded photo online, curved corners png',
  },
  border: {
    title: 'Add Border to Image Online | Image Utils – Free Tool',
    h1: 'Add Custom Frame Borders to Images',
    desc: 'Add custom border frames with adjustable widths, colors, and corner radius directly in your browser with Image Utils.',
    keywords: 'add border to image, photo frame online, image border generator, picture frame online',
  },
  adjust: {
    title: 'Photo Adjustments & Filters Online | Image Utils',
    h1: 'Fine-Tune Photo Adjustments & Visual Filters',
    desc: 'Fine-tune exposure, contrast, saturation, warmth, vignette, blur, and 9 creative photo filters. Free tool by Image Utils.',
    keywords: 'photo adjustments, photo filters online, image brightness contrast, edit photo in browser',
  },
  rotate: {
    title: 'Rotate & Flip Image Online | Image Utils – Free Tool',
    h1: 'Rotate and Flip Images Instantly',
    desc: 'Rotate photos 90°, 180°, 270° or mirror flip horizontally and vertically in-browser with Image Utils.',
    keywords: 'rotate image online, flip photo horizontally, rotate picture 90 degrees, mirror image',
  },
  convert: {
    title: 'Convert Image Format Online | Image Utils – Free Tool',
    h1: 'Convert Image Formats Locally in Browser',
    desc: 'Convert seamlessly between PNG, JPEG, WebP, BMP, AVIF, TIFF, and ICO formats. Free format converter by Image Utils.',
    keywords: 'convert image format, png to jpg, webp to png, avif to jpeg, convert photo format online',
  },
  favicon: {
    title: 'Favicon Generator (.ICO & App Icons) | Image Utils',
    h1: 'Generate Favicons & Multi-Resolution App Icons',
    desc: 'Generate multi-resolution .ico favicons, Apple Touch icons, Android PWA icons, and copy HTML embed snippet. Free tool by Image Utils.',
    keywords: 'favicon generator, make favicon ico, generate app icons, convert image to favicon, pwa icon maker',
  },
  watermark: {
    title: 'Add Watermark to Photo Online | Image Utils – Free Tool',
    h1: 'Add Custom Text Watermarks to Photos',
    desc: 'Protect photos with customizable text watermarks, opacity, positions, and styling. 100% client-side with Image Utils.',
    keywords: 'watermark photo online, add text watermark, protect images watermark, photo watermark maker',
  },
  pdf: {
    title: 'Convert Image to PDF Online | Image Utils – Free Tool',
    h1: 'Convert Images to Printable PDF Documents',
    desc: 'Convert images to single-page A4, Letter, or fit-to-image printable PDF documents locally with Image Utils.',
    keywords: 'image to pdf, convert jpg to pdf, picture to pdf online, photo to pdf maker',
  },
  metadata: {
    title: 'EXIF Metadata Stripper (Scrub GPS) | Image Utils',
    h1: 'Remove EXIF Metadata & Scrub GPS Coordinates',
    desc: 'Inspect and remove EXIF tags, GPS location coordinates, and camera serial numbers. Free metadata removal by Image Utils.',
    keywords: 'remove exif data, scrub gps from photo, delete photo metadata, strip exif tags online',
  },
  privacy: {
    title: 'Privacy Policy | Image Utils (100% Private)',
    h1: 'Zero-Upload Privacy Policy',
    desc: 'Read our zero-upload privacy policy. All image editing runs 100% client-side in your browser RAM. Image Utils never uploads your files.',
    keywords: 'image utils privacy policy, private image processing, zero upload editor',
  },
  terms: {
    title: 'Terms of Service | Image Utils',
    h1: 'Terms of Service & Licensing',
    desc: 'Free, open-source image utility terms under the MIT License. No subscriptions, no hidden limits, and full copyright ownership of your media.',
    keywords: 'image utils terms, open source image editor terms, mit license image tools',
  },
};

/**
 * Replace the <head> and prerendered body tags with route-specific SEO content.
 */
function injectSeoForRoute(html, route, seo) {
  const canonicalUrl = `${ORIGIN}/${route}`;
  const toolName = seo.title.split(' | ')[0];

  // 1. Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${seo.title}</title>`
  );

  // 2. Replace <meta name="title">
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${seo.title}" />`
  );

  // 3. Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${seo.desc}" />`
  );

  // 4. Replace <meta name="keywords">
  if (seo.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${seo.keywords}, image utils, image utility" />`
    );
  }

  // 5. Replace <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // 6. Replace OpenGraph tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${seo.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${seo.desc}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // 7. Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${seo.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${seo.desc}" />`
  );

  // 8. Inject BreadcrumbList JSON-LD before </head>
  const breadcrumbJsonLd = `
    <!-- Schema.org BreadcrumbList for Google Search Rich Snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "${ORIGIN}/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${toolName}",
          "item": "${canonicalUrl}"
        }
      ]
    }
    </script>`;
  html = html.replace('</head>', `${breadcrumbJsonLd}\n  </head>`);

  // 9. Update the pre-rendered H1 and hero subtitle in #root so Googlebot sees unique on-page text
  html = html.replace(
    /<h1 id="hero-title-h1" class="hero-title">[^<]*<\/h1>/,
    `<h1 id="hero-title-h1" class="hero-title">${seo.h1}</h1>`
  );
  html = html.replace(
    /<p class="hero-subtitle">[\s\S]*?<\/p>/,
    `<p class="hero-subtitle">${seo.desc}</p>`
  );

  return html;
}

/**
 * Vite plugin: runs after Vite finishes building dist/
 */
export default function seoInjectPlugin() {
  return {
    name: 'vite-plugin-seo-inject',
    enforce: 'post',
    apply: 'build',

    closeBundle() {
      const distDir = resolve(process.cwd(), 'dist');
      const baseHtmlPath = resolve(distDir, 'index.html');

      if (!existsSync(baseHtmlPath)) {
        console.warn('⚠️ [vite-plugin-seo-inject] dist/index.html not found, skipping SEO injection.');
        return;
      }

      const baseHtml = readFileSync(baseHtmlPath, 'utf-8');
      let count = 0;

      for (const [route, seo] of Object.entries(ROUTE_SEO)) {
        const routeHtml = injectSeoForRoute(baseHtml, route, seo);

        // 1. Output as /dist/<route>.html (for servers configured with cleanUrls)
        const flatHtmlPath = resolve(distDir, `${route}.html`);
        writeFileSync(flatHtmlPath, routeHtml, 'utf-8');

        // 2. Output as /dist/<route>/index.html (for directory-based routing)
        const routeDir = resolve(distDir, route);
        if (!existsSync(routeDir)) {
          mkdirSync(routeDir, { recursive: true });
        }
        writeFileSync(resolve(routeDir, 'index.html'), routeHtml, 'utf-8');

        count++;
      }

      console.log(
        `\n🚀 [vite-plugin-seo-inject] Generated ${count} route-specific HTML pages (both .html & /index.html) with unique metadata, canonicals, H1s, and Breadcrumbs!\n`
      );
    },
  };
}
