/**
 * Generates sample images on an in-memory canvas and returns DataURLs
 * Allows instant testing of all 9 tools without needing to upload a file first.
 */

export function createSampleLandscape() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 500);
  skyGrad.addColorStop(0, '#0f172a');
  skyGrad.addColorStop(0.5, '#4338ca');
  skyGrad.addColorStop(0.8, '#ec4899');
  skyGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Glowing Sun
  const sunGrad = ctx.createRadialGradient(600, 420, 20, 600, 420, 140);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.5, '#f59e0b');
  sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(600, 420, 140, 0, Math.PI * 2);
  ctx.fill();

  // Mountain Layer 1 (Distant)
  ctx.fillStyle = '#311042';
  ctx.beginPath();
  ctx.moveTo(0, 800);
  ctx.lineTo(0, 520);
  ctx.lineTo(250, 430);
  ctx.lineTo(480, 510);
  ctx.lineTo(750, 390);
  ctx.lineTo(1050, 530);
  ctx.lineTo(1200, 480);
  ctx.lineTo(1200, 800);
  ctx.closePath();
  ctx.fill();

  // Mountain Layer 2 (Foreground)
  ctx.fillStyle = '#180826';
  ctx.beginPath();
  ctx.moveTo(0, 800);
  ctx.lineTo(0, 620);
  ctx.lineTo(180, 560);
  ctx.lineTo(390, 660);
  ctx.lineTo(600, 510);
  ctx.lineTo(840, 640);
  ctx.lineTo(1080, 550);
  ctx.lineTo(1200, 610);
  ctx.lineTo(1200, 800);
  ctx.closePath();
  ctx.fill();

  // Modern caption
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('Sample Landscape (1200 × 800)', 50, 740);

  return canvas.toDataURL('image/jpeg', 0.95);
}

export function createSampleAvatar() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Vibrant gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
  bgGrad.addColorStop(0, '#6366f1');
  bgGrad.addColorStop(0.5, '#a855f7');
  bgGrad.addColorStop(1, '#ec4899');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 600);

  // Stylized head & shoulders avatar
  // Head
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(300, 240, 110, 0, Math.PI * 2);
  ctx.fill();

  // Torso
  ctx.beginPath();
  ctx.arc(300, 560, 220, Math.PI, 0, false);
  ctx.fill();

  // Accent glasses / visor
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(220, 210, 160, 45, 12) : ctx.rect(220, 210, 160, 45);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(230, 220, 60, 25, 6) : ctx.rect(230, 220, 60, 25);
  ctx.roundRect ? ctx.roundRect(310, 220, 60, 25, 6) : ctx.rect(310, 220, 60, 25);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
