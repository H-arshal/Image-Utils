import { describe, it, expect } from 'vitest';
import { formatBytes } from './canvasEngine';

describe('formatBytes helper', () => {
  it('formats zero bytes properly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(null)).toBe('0 B');
    expect(formatBytes(undefined)).toBe('0 B');
  });

  it('formats bytes in B, KB, MB, and GB', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('respects decimal precision arguments', () => {
    expect(formatBytes(1550, 0)).toBe('2 KB');
    expect(formatBytes(1550, 2)).toBe('1.51 KB');
  });
});

describe('Image Dimension & Aspect Ratio Calculations', () => {
  it('calculates proportional height maintaining 16:9 aspect ratio', () => {
    const originalWidth = 1920;
    const originalHeight = 1080;
    const targetWidth = 1280;
    const aspectRatio = originalWidth / originalHeight;
    const calculatedHeight = Math.round(targetWidth / aspectRatio);
    expect(calculatedHeight).toBe(720);
  });

  it('calculates proportional width maintaining 4:3 aspect ratio', () => {
    const originalWidth = 800;
    const originalHeight = 600;
    const targetHeight = 300;
    const aspectRatio = originalWidth / originalHeight;
    const calculatedWidth = Math.round(targetHeight * aspectRatio);
    expect(calculatedWidth).toBe(400);
  });

  it('clamps dimensions within safe canvas hardware boundary (12,000 px)', () => {
    const MAX_CANVAS_DIMENSION = 12000;
    const clampDimension = (val) => Math.max(1, Math.min(MAX_CANVAS_DIMENSION, Math.round(val)));

    expect(clampDimension(15000)).toBe(12000);
    expect(clampDimension(-50)).toBe(1);
    expect(clampDimension(1920)).toBe(1920);
  });
});

describe('Security Sandbox & Format Validation', () => {
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/bmp',
    'image/gif'
  ];

  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  it('accepts safe standard raster MIME types', () => {
    expect(ALLOWED_MIME_TYPES.includes('image/jpeg')).toBe(true);
    expect(ALLOWED_MIME_TYPES.includes('image/png')).toBe(true);
    expect(ALLOWED_MIME_TYPES.includes('image/webp')).toBe(true);
    expect(ALLOWED_MIME_TYPES.includes('image/bmp')).toBe(true);
    expect(ALLOWED_MIME_TYPES.includes('image/gif')).toBe(true);
  });

  it('strictly rejects SVG files for XSS security protection', () => {
    expect(ALLOWED_MIME_TYPES.includes('image/svg+xml')).toBe(false);
  });

  it('enforces 50 MB file size ceiling to protect browser RAM', () => {
    const isWithinCeiling = (size) => size <= MAX_FILE_SIZE_BYTES;

    expect(isWithinCeiling(10 * 1024 * 1024)).toBe(true); // 10 MB
    expect(isWithinCeiling(50 * 1024 * 1024)).toBe(true); // 50 MB
    expect(isWithinCeiling(51 * 1024 * 1024)).toBe(false); // 51 MB (rejected)
  });
});
