/**
 * toolsSeoContent.js
 *
 * Comprehensive SEO, How-To steps, and FAQ data for each tool.
 * Shared between runtime React components and build-time HTML injection (vite-plugin-seo-inject.js).
 */

export const TOOLS_SEO_DATA = {
  resize: {
    id: 'resize',
    name: 'Resize Image',
    title: 'Resize Image Online | Image Utils – Free In-Browser Tool',
    h1: 'Free Online Image Resizer (100% Private & In-Browser)',
    desc: 'Resize image dimensions with aspect ratio lock or custom width and height. 100% private in-browser resizing with Image Utils.',
    keywords: 'resize image online, resize picture, image resizer, change image dimensions, scale photo free, resize image for instagram, photo resolution changer',
    steps: [
      {
        name: 'Upload or Select Image',
        text: 'Drag and drop your image into the workspace or click to select from your device. Supported formats include PNG, JPEG, WebP, AVIF, and BMP.'
      },
      {
        name: 'Adjust Dimensions or Percentage',
        text: 'Enter your desired width and height in pixels or scale by percentage. Toggle the aspect ratio lock to preserve original image proportions.'
      },
      {
        name: 'Download Resized Image',
        text: 'Preview the instant live result, inspect dimensions and file size, and click Download Image to save it locally to your device.'
      }
    ],
    features: [
      'Aspect ratio lock preserves image proportions without stretching or distortion.',
      'One-click preset dimension scaling (25%, 50%, 75%, 100%, 200%).',
      'High-fidelity bicubic resampling computed via HTML5 Canvas 2D.',
      '100% client-side: Zero bytes transferred across the network.'
    ],
    faqs: [
      {
        q: 'Does resizing an image reduce its quality?',
        a: 'Downscaling (making an image smaller) preserves edge sharpness and actually increases pixel density. Upscaling (enlarging beyond native resolution) can introduce soft edges, but our smooth bicubic interpolation algorithm minimizes artifacts.'
      },
      {
        q: 'How do I keep the image from distorting or stretching?',
        a: 'Keep the Aspect Ratio Lock enabled (the link icon). When locked, altering width automatically calculates the proportionate height, preventing distortion.'
      },
      {
        q: 'What are the best image dimensions for social media?',
        a: 'Common dimensions include 1080×1080 px (Instagram square post), 1080×1920 px (Instagram/TikTok stories), 1280×720 px (YouTube thumbnails), and 1200×675 px (Twitter / X posts).'
      },
      {
        q: 'Is it safe to resize confidential or personal photos here?',
        a: 'Yes, 100%. Image Utils operates entirely in your local browser sandbox. No photo is ever uploaded to any cloud server or third-party API.'
      }
    ],
    related: ['compress', 'crop', 'convert', 'circle']
  },

  compress: {
    id: 'compress',
    name: 'Compress Image',
    title: 'Compress Image Online (Reduce KB) | Image Utils – Free Tool',
    h1: 'Compress Images Online to Target Size (KB & MB)',
    desc: 'Compress images to a target file size or custom quality slider directly in your browser without quality loss using Image Utils.',
    keywords: 'compress image, reduce image size, compress jpeg, compress png to kb, shrink image size online, compress image to 200kb, photo size reducer',
    steps: [
      {
        name: 'Load Your Photo',
        text: 'Select or drag your photo into the workspace. Image Utils immediately reads the file into local memory.'
      },
      {
        name: 'Choose Target KB or Quality Slider',
        text: 'Specify an exact target file size (e.g. 100 KB, 200 KB) or drag the visual quality slider to find the optimal size-to-quality balance.'
      },
      {
        name: 'Export Compressed File',
        text: 'Check the real-time preview and exact byte reduction percentage, then click Download to save your optimized image.'
      }
    ],
    features: [
      'Dual compression modes: visual quality slider (1-100%) and binary search target KB mode.',
      'Reduces file sizes by up to 80% while preserving perceptual visual fidelity.',
      'Real-time file size and savings percentage preview before downloading.',
      'Zero server queues or upload limits-process high-resolution photos instantly.'
    ],
    faqs: [
      {
        q: 'Can I compress an image to a specific size like 200 KB or 50 KB?',
        a: 'Yes. Switch to Target Size mode in the tool panel and enter your desired size in kilobytes. The engine uses binary search compression to reach your target.'
      },
      {
        q: 'Will compression make my image look blurry?',
        a: 'Our smart compression removes invisible high-frequency noise and redundant color data. At quality settings between 75% and 85%, file size drops significantly with virtually no perceptible difference.'
      },
      {
        q: 'Is there a limit on how many images I can compress?',
        a: 'No daily limits or subscription paywalls. Because compression runs on your own device hardware, you can compress as many photos as you want for free.'
      }
    ],
    related: ['resize', 'convert', 'crop', 'metadata']
  },

  crop: {
    id: 'crop',
    name: 'Crop Image',
    title: 'Crop Image Online (Freeform & Presets) | Image Utils',
    h1: 'Crop Images Online with Presets & Freeform Rectangles',
    desc: 'Crop rectangular regions with 1:1, 16:9, 4:3, or custom freeform crop boxes. Free, private, in-browser with Image Utils.',
    keywords: 'crop image online, photo cropper, crop picture freeform, image aspect ratio crop, 1:1 square crop, 16:9 wallpaper crop',
    steps: [
      {
        name: 'Upload Photo',
        text: 'Drop your image into the workspace to initialize the interactive crop grid.'
      },
      {
        name: 'Adjust Crop Box & Ratio',
        text: 'Drag the corner handles or select a ratio preset: 1:1 (Square), 4:3 (Standard), 16:9 (Widescreen), or Freeform.'
      },
      {
        name: 'Crop & Save',
        text: 'Preview the highlighted selection and click Download Image to save your cropped composition.'
      }
    ],
    features: [
      'Interactive crop overlay with 8 draggable handles and rule-of-thirds grid lines.',
      'Instant ratio lock presets: 1:1, 4:3, 16:9, and unrestricted freeform.',
      'Real-time pixel coordinates (X, Y, Width, Height) readout.',
      'Preserves original color profile and alpha channel transparency.'
    ],
    faqs: [
      {
        q: 'Does cropping reduce the resolution of the remaining area?',
        a: 'No. Cropping extracts the exact native pixels from within your selection box without resampling or downscaling.'
      },
      {
        q: 'Can I undo or readjust my crop boundaries?',
        a: 'Yes. You can drag and reposition the crop handles or click Reset Crop at any time before downloading.'
      }
    ],
    related: ['circle', 'resize', 'radius', 'border']
  },

  circle: {
    id: 'circle',
    name: 'Circle Crop',
    title: 'Circle Crop Image (Round Avatar Maker) | Image Utils',
    h1: 'Circle Crop Photos & Make Round Avatars with Transparent PNG',
    desc: 'Create circular profile pictures and avatars with transparent PNG output. Free circle crop tool by Image Utils.',
    keywords: 'circle crop, round avatar maker, circular profile picture, crop photo into circle, round pfp, transparent circle image',
    steps: [
      {
        name: 'Upload Portrait or Photo',
        text: 'Load any photo or avatar into the circle cropping canvas.'
      },
      {
        name: 'Position the Circle',
        text: 'Drag the circular crop boundary over your subject and resize the circle diameter to center your portrait.'
      },
      {
        name: 'Export Transparent PNG',
        text: 'Download the circular result with an automatically transparent alpha background, ready for social media or Slack.'
      }
    ],
    features: [
      'Clean circular clipping mask with subpixel anti-aliased edge smoothing.',
      'Automatic alpha transparency outside the circular boundary.',
      'Center-lock and drag-to-reposition handles.',
      'Ideal for LinkedIn, Twitter, Discord, GitHub, and Slack avatars.'
    ],
    faqs: [
      {
        q: 'Will the corners outside the circle be transparent?',
        a: 'Yes! The exported image is saved as a 32-bit transparent PNG, so the corners outside the circular border are completely clear.'
      },
      {
        q: 'Can I use this circle crop for resumes and badges?',
        a: 'Yes. Circular headshots are ideal for modern CVs, portfolio websites, ID cards, and conference badges.'
      }
    ],
    related: ['crop', 'radius', 'border', 'favicon']
  },

  radius: {
    id: 'radius',
    name: 'Corner Radius',
    title: 'Round Image Corners (Corner Radius) | Image Utils',
    h1: 'Round Image Corners with Custom Border Radius',
    desc: 'Add clean rounded corners to photos with transparent PNG or custom background fill. Free corner radius tool by Image Utils.',
    keywords: 'round image corners, corner radius image, rounded photo online, curved corners png, smooth rounded rectangle image',
    steps: [
      {
        name: 'Select Image',
        text: 'Open the image you want to soften with rounded corners.'
      },
      {
        name: 'Set Corner Radius Slider',
        text: 'Drag the radius slider in pixels or percentage until the curved corners look perfect.'
      },
      {
        name: 'Choose Background Fill',
        text: 'Leave background as transparent PNG or pick a custom solid background color fill.'
      }
    ],
    features: [
      'Smooth quadratic bezier curve corner smoothing.',
      'Supports transparent PNG output or custom hex background fill.',
      'Live slider adjustment from subtle 4px softening to full pill curvature.',
      'Great for website UI mockups, cards, and presentation slides.'
    ],
    faqs: [
      {
        q: 'How do I ensure the rounded corners stay transparent?',
        a: 'Keep the background mode set to Transparent and export as PNG or WebP, both of which support alpha channel transparency.'
      }
    ],
    related: ['border', 'circle', 'crop', 'resize']
  },

  border: {
    id: 'border',
    name: 'Add Border',
    title: 'Add Border to Image Online | Image Utils – Free Tool',
    h1: 'Add Custom Frame Borders & Margins to Photos',
    desc: 'Add custom border frames with adjustable widths, colors, and corner radius directly in your browser with Image Utils.',
    keywords: 'add border to image, photo frame online, image border generator, picture frame online, white border around photo',
    steps: [
      {
        name: 'Upload Photo',
        text: 'Open your photo in the Add Border tool.'
      },
      {
        name: 'Customize Border Width & Color',
        text: 'Select border thickness in pixels and pick any color using the color picker or hex input.'
      },
      {
        name: 'Download Framed Photo',
        text: 'Preview the framed composition and download your styled image.'
      }
    ],
    features: [
      'Outer border and inner border framing styles.',
      'Full RGB/HEX color picker with preset colors (white, black, cream, charcoal).',
      'Optional corner radius combination for stylish card presentations.',
      'Maintains original photo resolution inside the frame.'
    ],
    faqs: [
      {
        q: 'Does adding a border increase the total image dimensions?',
        a: 'Yes, an outer border adds the specified pixel width around all four edges of the image, keeping your original photo uncropped.'
      }
    ],
    related: ['radius', 'adjust', 'watermark', 'resize']
  },

  adjust: {
    id: 'adjust',
    name: 'Adjust & Filters',
    title: 'Photo Adjustments & Filters Online | Image Utils',
    h1: 'Photo Adjustments & Creative Color Filters',
    desc: 'Fine-tune exposure, contrast, saturation, warmth, vignette, blur, and 9 creative photo filters. Free tool by Image Utils.',
    keywords: 'photo adjustments, photo filters online, image brightness contrast, edit photo in browser, vignette blur photo, black and white filter',
    steps: [
      {
        name: 'Upload Image',
        text: 'Drop any photo into the Adjustments canvas.'
      },
      {
        name: 'Tune Lighting & Color',
        text: 'Adjust sliders for brightness, contrast, saturation, warmth, vignette, and blur.'
      },
      {
        name: 'Apply Creative Filters',
        text: 'Choose from 9 one-click filters (Vintage, Vivid, Mono, Sepia, Cool, Warm) or download your tuned photo.'
      }
    ],
    features: [
      'Hardware-accelerated pixel canvas adjustments: brightness, contrast, saturation, temperature.',
      'Vignette radial shading and gaussian blur depth effects.',
      '9 artistic filter presets with live real-time split preview.',
      'One-click reset button to revert any adjustment instantly.'
    ],
    faqs: [
      {
        q: 'Can I compare my edited photo with the original?',
        a: 'Yes! Toggle the Split View or Hold to Compare button to instantly see your adjustments side-by-side with the original photo.'
      }
    ],
    related: ['rotate', 'resize', 'compress', 'watermark']
  },

  rotate: {
    id: 'rotate',
    name: 'Rotate & Flip',
    title: 'Rotate & Flip Image Online | Image Utils – Free Tool',
    h1: 'Rotate and Flip Images Instantly (90°, 180°, Mirror)',
    desc: 'Rotate photos 90°, 180°, 270° or mirror flip horizontally and vertically in-browser with Image Utils.',
    keywords: 'rotate image online, flip photo horizontally, rotate picture 90 degrees, mirror image, upside down photo fixer',
    steps: [
      {
        name: 'Load Photo',
        text: 'Select your photo that needs orientation correction.'
      },
      {
        name: 'Rotate or Mirror',
        text: 'Click 90° Clockwise, 90° Counter-Clockwise, Flip Horizontal, or Flip Vertical.'
      },
      {
        name: 'Download Corrected Photo',
        text: 'Download the properly oriented image with updated dimension metadata.'
      }
    ],
    features: [
      'Lossless 90°, 180°, and 270° rotation.',
      'Horizontal mirror flip (ideal for selfies) and vertical flip.',
      'Automatically recalculates canvas width and height for vertical orientations.',
      'Zero quality degradation.'
    ],
    faqs: [
      {
        q: 'Why do my phone photos open sideways?',
        a: 'Smartphones store camera orientation in EXIF tags. If an app ignores EXIF data, photos appear rotated. Our Rotate tool physically rewrites pixel orientation so it displays correctly everywhere.'
      }
    ],
    related: ['crop', 'convert', 'resize', 'metadata']
  },

  convert: {
    id: 'convert',
    name: 'Convert Format',
    title: 'Convert Image Format Online | Image Utils – Free Tool',
    h1: 'Convert Image Formats Locally in Browser (WebP, PNG, JPG, AVIF)',
    desc: 'Convert seamlessly between PNG, JPEG, WebP, BMP, AVIF, TIFF, and ICO formats. Free format converter by Image Utils.',
    keywords: 'convert image format, png to jpg, webp to png, avif to jpeg, convert photo format online, heic webp converter, bmp to png',
    steps: [
      {
        name: 'Select Input File',
        text: 'Upload any image in PNG, JPEG, WebP, AVIF, BMP, or TIFF format.'
      },
      {
        name: 'Choose Target Format',
        text: 'Pick your desired destination format and set quality options.'
      },
      {
        name: 'Download Converted Image',
        text: 'Save your freshly transcoded file instantly.'
      }
    ],
    features: [
      'Supports bidirectional conversion between PNG, JPEG, WebP, AVIF, BMP, TIFF, and ICO.',
      'Custom quality setting for lossy formats (JPEG, WebP, AVIF).',
      'Configurable background color fill when converting transparent PNGs to opaque JPEG.',
      'Zero server roundtrip: file transcoding happens right in your device RAM.'
    ],
    faqs: [
      {
        q: 'How do I convert a WebP file to JPG or PNG?',
        a: 'Simply drag the WebP file into this tool, select PNG or JPEG from the format dropdown, and click Download. It takes less than 1 second.'
      },
      {
        q: 'What happens to transparency when converting PNG to JPG?',
        a: 'Since JPEG does not support transparency, our converter lets you choose a background fill color (defaulting to clean white) so your subjects look crisp.'
      }
    ],
    related: ['compress', 'resize', 'favicon', 'pdf']
  },

  favicon: {
    id: 'favicon',
    name: 'Favicon Generator',
    title: 'Favicon Generator (.ICO & App Icons) | Image Utils',
    h1: 'Favicon Generator (.ICO, Apple Touch & Android App Icons)',
    desc: 'Generate multi-resolution .ico favicons, Apple Touch icons, Android PWA icons, and copy HTML embed snippet. Free tool by Image Utils.',
    keywords: 'favicon generator, make favicon ico, generate app icons, convert image to favicon, pwa icon maker, 32x32 favicon, apple touch icon generator',
    steps: [
      {
        name: 'Upload Logo or Graphic',
        text: 'Provide a square logo or image (at least 512×512 px recommended).'
      },
      {
        name: 'Select Icon Package',
        text: 'Choose standard multi-resolution .ico, Apple Touch Icon (180×180), or Android PWA icon pack (192×192 & 512×512).'
      },
      {
        name: 'Download & Copy HTML Tag',
        text: 'Download your icon bundle and copy the ready-to-paste `<link rel="icon">` code snippet.'
      }
    ],
    features: [
      'Multi-resolution Windows .ico container embedding 16×16, 32×32, and 48×48 px bitmaps.',
      'Apple Touch Icon (180×180 px) with clean padding options.',
      'Android PWA web manifest icons (192×192 & 512×512 px).',
      'One-click HTML snippet copy for your `<head>` tag.'
    ],
    faqs: [
      {
        q: 'What is the standard size for a website favicon?',
        a: 'Modern browsers recommend a multi-size `.ico` file containing 16×16, 32×32, and 48×48 px images, accompanied by a 180×180 px PNG for Apple devices.'
      }
    ],
    related: ['convert', 'circle', 'resize', 'crop']
  },

  watermark: {
    id: 'watermark',
    name: 'Add Watermark',
    title: 'Add Watermark to Photo Online | Image Utils – Free Tool',
    h1: 'Add Custom Text Watermarks to Protect Your Photos',
    desc: 'Protect photos with customizable text watermarks, opacity, positions, and styling. 100% client-side with Image Utils.',
    keywords: 'watermark photo online, add text watermark, protect images watermark, photo watermark maker, copyright stamp on photo',
    steps: [
      {
        name: 'Upload Photo',
        text: 'Load the image you wish to protect with a watermark.'
      },
      {
        name: 'Type Text & Style',
        text: 'Enter your copyright text or brand name. Adjust font size, color, opacity, and positioning (corners, center, or tiled).'
      },
      {
        name: 'Download Watermarked Photo',
        text: 'Download your stamped image with copyright protection embedded in pixels.'
      }
    ],
    features: [
      'Custom watermark text with font size, opacity, and color controls.',
      '9 anchor positions: top-left, top-center, top-right, center, bottom-right, etc.',
      'Optional subtle text drop shadow for legibility over bright or dark backgrounds.',
      '100% private: your intellectual property stays on your device.'
    ],
    faqs: [
      {
        q: 'Can people easily remove a text watermark?',
        a: 'A properly placed semi-transparent watermark covering key visual elements makes unauthorized removal difficult without damaging the underlying image.'
      }
    ],
    related: ['border', 'adjust', 'metadata', 'compress']
  },

  pdf: {
    id: 'pdf',
    name: 'Image to PDF',
    title: 'Convert Image to PDF Online | Image Utils – Free Tool',
    h1: 'Convert Images to Printable PDF Documents (A4 & Letter)',
    desc: 'Convert images to single-page A4, Letter, or fit-to-image printable PDF documents locally with Image Utils.',
    keywords: 'image to pdf, convert jpg to pdf, picture to pdf online, photo to pdf maker, png to pdf document, scanned document to pdf',
    steps: [
      {
        name: 'Upload Scanned Photo or Document',
        text: 'Select your photo, invoice, certificate, or receipt.'
      },
      {
        name: 'Choose Page Format',
        text: 'Pick A4, US Letter, or Fit to Image dimensions with Portrait or Landscape orientation.'
      },
      {
        name: 'Generate PDF',
        text: 'Click Download PDF to receive a vector-wrapped, high-resolution document ready for printing or emailing.'
      }
    ],
    features: [
      'Standard document formats: International A4, US Letter, and exact fit.',
      'Portrait and Landscape orientation toggle.',
      'Margin padding controls to prevent edge clipping during home printing.',
      'High-DPI vector PDF rendering powered by jsPDF client-side.'
    ],
    faqs: [
      {
        q: 'Is it safe to convert bank receipts or IDs to PDF here?',
        a: 'Absolutely. Because the conversion is performed by jsPDF inside your browser memory, your confidential documents are never uploaded to any remote server.'
      }
    ],
    related: ['convert', 'compress', 'rotate', 'metadata']
  },

  metadata: {
    id: 'metadata',
    name: 'Remove Metadata',
    title: 'EXIF Metadata Stripper (Scrub GPS) | Image Utils',
    h1: 'Remove EXIF Metadata & Scrub GPS Location from Photos',
    desc: 'Inspect and remove EXIF tags, GPS location coordinates, and camera serial numbers. Free metadata removal by Image Utils.',
    keywords: 'remove exif data, scrub gps from photo, delete photo metadata, strip exif tags online, protect photo privacy, inspect exif tags',
    steps: [
      {
        name: 'Inspect Photo Metadata',
        text: 'Upload any JPEG or TIFF photo. The tool immediately reads and displays embedded EXIF tags, camera model, and GPS coordinates.'
      },
      {
        name: 'Scrub Sensitive Tags',
        text: 'Review the metadata and click "Strip Metadata" to strip all non-pixel chunks.'
      },
      {
        name: 'Download Privacy-Clean Image',
        text: 'Download the pristine image file with zero tracking or GPS location data attached.'
      }
    ],
    features: [
      'Interactive EXIF tag inspector (camera model, shutter speed, aperture, timestamp, GPS coords).',
      'Total GPS coordinate scrubbing to protect home/work locations before posting online.',
      'Re-encodes pristine pixel data into a fresh container free of hidden tags.',
      'Essential privacy tool for journalists, creators, and parents sharing photos online.'
    ],
    faqs: [
      {
        q: 'What sensitive data is stored inside my smartphone photos?',
        a: 'Smartphone photos frequently contain exact GPS latitude/longitude coordinates of where the photo was taken, exact timestamps, device serial numbers, and camera settings.'
      },
      {
        q: 'Does removing metadata affect the visual image quality?',
        a: 'No. The visual pixel data remains identical; only the hidden text tags (EXIF, IPTC, XMP) are permanently removed.'
      }
    ],
    related: ['compress', 'rotate', 'resize', 'convert']
  },

  privacy: {
    id: 'privacy',
    name: 'Privacy Policy',
    title: 'Privacy Policy | Image Utils (100% Private)',
    h1: 'Zero-Upload Privacy Policy & Data Protection',
    desc: 'Read our zero-upload privacy policy. All image editing runs 100% client-side in your browser RAM. Image Utils never uploads your files.',
    keywords: 'image utils privacy policy, zero upload editor privacy, private photo processing',
    steps: [
      { name: 'Zero Server Uploads', text: 'All operations execute locally in your browser memory.' },
      { name: 'No Tracking Cookies', text: 'We do not sell data, profile users, or retain photos.' },
      { name: 'Open Source Transparency', text: 'Full MIT licensed codebase publicly inspectable on GitHub.' }
    ],
    features: ['100% local RAM execution', 'No cookies or trackers', 'Zero data retention', 'MIT License'],
    faqs: [
      {
        q: 'Are any photos sent to your servers?',
        a: 'Never. Image Utils has no backend server or cloud storage for photos. Your files never leave your device.'
      }
    ],
    related: ['terms', 'resize', 'compress']
  },

  terms: {
    id: 'terms',
    name: 'Terms of Service',
    title: 'Terms of Service | Image Utils',
    h1: 'Terms of Service & Open Source License',
    desc: 'Free, open-source image utility terms under the MIT License. No subscriptions, no hidden limits, and full copyright ownership of your media.',
    keywords: 'image utils terms, open source image editor terms, mit license image tools',
    steps: [
      { name: 'Free Forever', text: 'Use all tools freely for personal, educational, or commercial projects.' },
      { name: 'You Own Your Media', text: 'You retain 100% of all intellectual property and copyright.' },
      { name: 'Provided As-Is', text: 'Licensed under standard MIT Open Source terms.' }
    ],
    features: ['Free for personal & commercial use', 'No account required', 'Full user copyright ownership', 'MIT License'],
    faqs: [
      {
        q: 'Can I use Image Utils for commercial work?',
        a: 'Yes, absolutely. You can use Image Utils for any client, business, or commercial workflow without fees.'
      }
    ],
    related: ['privacy', 'resize', 'convert']
  }
};
