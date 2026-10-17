import { jsPDF } from 'jspdf';

/**
 * Format bytes into human-readable string (e.g. 1.2 MB, 450 KB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Helper to download a Blob or DataURL to the user's filesystem
 */
export function downloadBlob(blobOrUrl, filename) {
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blobOrUrl !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Load an Image element from a File or ObjectURL
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

/**
 * 1. RESIZE IMAGE
 */
export async function resizeImage(img, targetWidth, targetHeight, mimeType = 'image/jpeg', quality = 0.92) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, mimeType, quality);
  });
}

/**
 * 2. COMPRESS IMAGE
 */
export async function compressImage(img, mimeType = 'image/jpeg', quality = 0.8) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0,
        quality
      });
    }, mimeType, quality);
  });
}

export async function compressToTargetSize(img, mimeType = 'image/jpeg', targetBytes = 380 * 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  let low = 0.05;
  let high = 0.98;
  let bestBlob = null;
  let bestQuality = 0.8;

  for (let i = 0; i < 6; i++) {
    const mid = (low + high) / 2;
    const blob = await new Promise((r) => canvas.toBlob(r, mimeType, mid));
    if (!blob) break;
    bestBlob = blob;
    bestQuality = mid;

    if (Math.abs(blob.size - targetBytes) < targetBytes * 0.05) break;
    if (blob.size > targetBytes) high = mid;
    else low = mid;
  }

  return {
    blob: bestBlob,
    url: bestBlob ? URL.createObjectURL(bestBlob) : null,
    width: canvas.width,
    height: canvas.height,
    size: bestBlob ? bestBlob.size : 0,
    quality: bestQuality
  };
}

/**
 * 3. CROP IMAGE
 */
export async function cropImage(img, cropBox, mimeType = 'image/png', quality = 0.95) {
  const { x, y, width, height } = cropBox;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    img,
    Math.round(x),
    Math.round(y),
    Math.round(width),
    Math.round(height),
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, mimeType, quality);
  });
}

/**
 * 4. ROTATE & FLIP
 */
export async function rotateFlipImage(img, rotationDeg = 0, flipH = false, flipV = false, mimeType = 'image/png') {
  const normalizedDeg = ((rotationDeg % 360) + 360) % 360;
  const isPerpendicular = normalizedDeg === 90 || normalizedDeg === 270;
  const originalW = img.naturalWidth || img.width;
  const originalH = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = isPerpendicular ? originalH : originalW;
  canvas.height = isPerpendicular ? originalW : originalH;
  const ctx = canvas.getContext('2d');

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((normalizedDeg * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -originalW / 2, -originalH / 2);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, mimeType, 0.95);
  });
}

/**
 * 5. FORMAT CONVERSION
 */
export async function convertFormat(img, targetFormat = 'image/png', quality = 0.92, bgColor = '#ffffff') {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width,
        height,
        size: blob ? blob.size : 0,
        format: targetFormat
      });
    }, targetFormat, quality);
  });
}

/**
 * 6. CIRCLE CROP
 */
export async function circleCropImage(img, centerX, centerY, radius, zoom = 1) {
  const diameter = Math.max(1, Math.round(radius * 2));
  const canvas = document.createElement('canvas');
  canvas.width = diameter;
  canvas.height = diameter;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const sourceW = (radius * 2) / zoom;
  const sourceH = (radius * 2) / zoom;
  const sourceX = centerX - sourceW / 2;
  const sourceY = centerY - sourceH / 2;

  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, diameter, diameter);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: diameter,
        height: diameter,
        size: blob ? blob.size : 0
      });
    }, 'image/png');
  });
}

/**
 * 7. ADD BORDER & CORNER RADIUS
 */
export async function addBorderImage(img, { borderWidth = 16, borderColor = '#c65d21', radius = 12 }) {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const b = Math.max(0, parseInt(borderWidth, 10) || 0);

  const canvas = document.createElement('canvas');
  canvas.width = origW + b * 2;
  canvas.height = origH + b * 2;
  const ctx = canvas.getContext('2d');

  if (b > 0) {
    ctx.fillStyle = borderColor;
    if (ctx.roundRect && radius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, canvas.width, canvas.height, radius + b);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Draw image inside border with inner radius
  ctx.save();
  if (ctx.roundRect && radius > 0) {
    ctx.beginPath();
    ctx.roundRect(b, b, origW, origH, radius);
    ctx.clip();
  }
  ctx.drawImage(img, b, b);
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, 'image/png');
  });
}

export async function cornerRadiusImage(img, radiusInPx) {
  return addBorderImage(img, { borderWidth: 0, radius: radiusInPx });
}

/**
 * 8. WATERMARK
 */
export async function watermarkImage(img, { text = '© Image Utility', opacity = 0.7, position = 'bottom-right', color = '#ffffff', fontSize = 28 }) {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = origH;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  ctx.save();
  ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity));
  ctx.fillStyle = color;
  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const textW = metrics.width;
  const padding = 30;

  let x = origW - textW - padding;
  let y = origH - padding - fontSize / 2;

  if (position === 'center') {
    x = (origW - textW) / 2;
    y = origH / 2;
  } else if (position === 'top-left') {
    x = padding;
    y = padding + fontSize / 2;
  } else if (position === 'top-right') {
    x = origW - textW - padding;
    y = padding + fontSize / 2;
  } else if (position === 'bottom-left') {
    x = padding;
    y = origH - padding - fontSize / 2;
  }

  // Drop shadow for legibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(text, x, y);
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, 'image/png');
  });
}

/**
 * 9. ADJUST (Brightness, Contrast, Saturation)
 */
export async function adjustImage(img, { brightness = 100, contrast = 100, saturation = 100, blur = 0 }) {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = origH;
  const ctx = canvas.getContext('2d');

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${blur > 0 ? `blur(${blur}px)` : ''}`.trim();
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob ? blob.size : 0
      });
    }, 'image/jpeg', 0.95);
  });
}

/**
 * 10. IMAGE TO PDF
 */
export async function generatePdf(img, { pageSize = 'a4', orientation = 'auto', margin = 'normal', fitMode = 'contain' }) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgAspect = imgW / imgH;

  let chosenOrientation = orientation;
  if (chosenOrientation === 'auto') {
    chosenOrientation = imgAspect > 1 ? 'landscape' : 'portrait';
  }

  const margins = { none: 0, small: 8, normal: 16 };
  const m = margins[margin] ?? 16;

  let doc;
  if (pageSize === 'fit') {
    const dpi = 150;
    const mmPerInch = 25.4;
    const pW = (imgW / dpi) * mmPerInch;
    const pH = (imgH / dpi) * mmPerInch;
    doc = new jsPDF({
      orientation: imgAspect > 1 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pW, pH]
    });
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imgW;
    tempCanvas.height = imgH;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, imgW, imgH);
    tCtx.drawImage(img, 0, 0);
    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
    doc.addImage(dataUrl, 'JPEG', 0, 0, pW, pH);
  } else {
    doc = new jsPDF({
      orientation: chosenOrientation,
      unit: 'mm',
      format: pageSize
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availW = pageWidth - m * 2;
    const availH = pageHeight - m * 2;

    let targetW, targetH;
    if (fitMode === 'contain') {
      const pageAspect = availW / availH;
      if (imgAspect > pageAspect) {
        targetW = availW;
        targetH = targetW / imgAspect;
      } else {
        targetH = availH;
        targetW = targetH * imgAspect;
      }
    } else {
      targetW = availW;
      targetH = targetW / imgAspect;
    }

    const posX = m + (availW - targetW) / 2;
    const posY = m + (availH - targetH) / 2;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imgW;
    tempCanvas.height = imgH;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, imgW, imgH);
    tCtx.drawImage(img, 0, 0);
    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);

    doc.addImage(dataUrl, 'JPEG', posX, posY, targetW, targetH);
  }

  const pdfBlob = doc.output('blob');
  return {
    blob: pdfBlob,
    url: URL.createObjectURL(pdfBlob),
    size: pdfBlob.size
  };
}

/**
 * 11. REMOVE METADATA
 */
export async function stripMetadata(img, mimeType = 'image/jpeg', quality = 0.95) {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width,
        height,
        size: blob ? blob.size : 0,
        sanitized: true
      });
    }, mimeType, quality);
  });
}

/**
 * Inspect file headers for basic EXIF
 */
export async function inspectFileMetadata(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const view = new DataView(buffer);
      const metadata = {
        hasExif: false,
        cameraModel: null,
        dateTime: null,
        hasGps: false,
        fileType: file.type || 'image/jpeg',
        fileSize: file.size
      };

      if (view.byteLength > 4 && view.getUint16(0, false) === 0xffd8) {
        let offset = 2;
        while (offset < view.byteLength) {
          if (view.getUint8(offset) !== 0xff) break;
          const marker = view.getUint8(offset + 1);
          if (marker === 0xe1) {
            metadata.hasExif = true;
            const strSlice = new TextDecoder('latin1').decode(new Uint8Array(buffer, offset, Math.min(2048, view.byteLength - offset)));
            if (strSlice.includes('GPS')) metadata.hasGps = true;
            break;
          }
          offset += 2 + view.getUint16(offset + 2, false);
        }
      }

      resolve(metadata);
    };
    reader.onerror = () => resolve({ hasExif: false });
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}
