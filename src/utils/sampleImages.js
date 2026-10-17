/**
 * Generates high-resolution sample image (mountains.jpg) matching the design mockup:
 * Jagged snow-capped peaks, evergreen pine trees, calm lake with reflection.
 */

export function createSampleLandscape() {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // 1. Sky Gradient: Soft morning light to warm horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 600);
  skyGrad.addColorStop(0, '#a5b4fc');
  skyGrad.addColorStop(0.35, '#c7d2fe');
  skyGrad.addColorStop(0.7, '#fed7aa');
  skyGrad.addColorStop(1, '#ffedd5');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Soft clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 8; i++) {
    const cx = (i * 280) % 2000;
    const cy = 120 + (i % 3) * 60;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 180, 45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Distant Soft Mountain Range
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(0, 650);
  ctx.lineTo(0, 460);
  ctx.lineTo(240, 360);
  ctx.lineTo(480, 430);
  ctx.lineTo(780, 310);
  ctx.lineTo(1100, 420);
  ctx.lineTo(1420, 330);
  ctx.lineTo(1750, 450);
  ctx.lineTo(1920, 380);
  ctx.lineTo(1920, 650);
  ctx.closePath();
  ctx.fill();

  // 3. Central Majestic Snow-Capped Mountain Range
  // Base rock
  const rockGrad = ctx.createLinearGradient(0, 200, 0, 680);
  rockGrad.addColorStop(0, '#334155');
  rockGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = rockGrad;
  ctx.beginPath();
  ctx.moveTo(0, 680);
  ctx.lineTo(0, 520);
  ctx.lineTo(320, 380);
  ctx.lineTo(540, 450);
  ctx.lineTo(840, 260); // Peak 1
  ctx.lineTo(1020, 370);
  ctx.lineTo(1180, 220); // Highest Peak 2
  ctx.lineTo(1380, 360);
  ctx.lineTo(1580, 290); // Peak 3
  ctx.lineTo(1820, 460);
  ctx.lineTo(1920, 410);
  ctx.lineTo(1920, 680);
  ctx.closePath();
  ctx.fill();

  // Snow facets on peaks
  ctx.fillStyle = '#f8fafc';
  // Snow Peak 1 (840, 260)
  ctx.beginPath();
  ctx.moveTo(840, 260);
  ctx.lineTo(890, 340);
  ctx.lineTo(830, 360);
  ctx.lineTo(800, 320);
  ctx.closePath();
  ctx.fill();

  // Snow Highest Peak 2 (1180, 220)
  ctx.beginPath();
  ctx.moveTo(1180, 220);
  ctx.lineTo(1250, 320);
  ctx.lineTo(1190, 350);
  ctx.lineTo(1130, 310);
  ctx.closePath();
  ctx.fill();

  // Snow Peak 3 (1580, 290)
  ctx.beginPath();
  ctx.moveTo(1580, 290);
  ctx.lineTo(1630, 360);
  ctx.lineTo(1560, 380);
  ctx.lineTo(1530, 340);
  ctx.closePath();
  ctx.fill();

  // 4. Lake Water & Reflection
  const lakeGrad = ctx.createLinearGradient(0, 620, 0, 1080);
  lakeGrad.addColorStop(0, '#1e3a5f');
  lakeGrad.addColorStop(0.3, '#134e4a');
  lakeGrad.addColorStop(0.65, '#0f766e');
  lakeGrad.addColorStop(1, '#042f2e');
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, 620, 1920, 460);

  // Soft Mountain Reflection in Lake
  ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
  ctx.beginPath();
  ctx.moveTo(0, 620);
  ctx.lineTo(320, 720);
  ctx.lineTo(840, 780);
  ctx.lineTo(1180, 830);
  ctx.lineTo(1580, 760);
  ctx.lineTo(1920, 700);
  ctx.lineTo(1920, 620);
  ctx.closePath();
  ctx.fill();

  // Lake Ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  for (let y = 640; y < 1050; y += 18) {
    ctx.beginPath();
    ctx.moveTo(100 + (y % 40), y);
    ctx.lineTo(1820 - (y % 60), y);
    ctx.stroke();
  }

  // 5. Pine Tree Forests (Left and Right Shores)
  const drawPineTree = (x, y, h, w) => {
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fill();
  };

  // Left forest shore
  ctx.fillStyle = '#022c22';
  ctx.beginPath();
  ctx.moveTo(0, 620);
  ctx.lineTo(460, 660);
  ctx.lineTo(380, 760);
  ctx.lineTo(0, 740);
  ctx.closePath();
  ctx.fill();

  for (let x = 0; x < 440; x += 22) {
    const h = 80 + Math.sin(x) * 35;
    drawPineTree(x, 650, h, 20);
  }

  // Right forest shore
  ctx.fillStyle = '#022c22';
  ctx.beginPath();
  ctx.moveTo(1480, 660);
  ctx.lineTo(1920, 610);
  ctx.lineTo(1920, 780);
  ctx.lineTo(1520, 740);
  ctx.closePath();
  ctx.fill();

  for (let x = 1500; x < 1920; x += 20) {
    const h = 90 + Math.cos(x) * 35;
    drawPineTree(x, 650, h, 22);
  }

  // Foreground Rocky Shore Shoreline
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.moveTo(150, 1080);
  ctx.quadraticCurveTo(450, 920, 850, 1080);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#44403c';
  ctx.beginPath();
  ctx.ellipse(480, 1000, 120, 65, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#57534e';
  ctx.beginPath();
  ctx.ellipse(380, 1030, 80, 45, 0.1, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.95);
}

export function createSampleAvatar() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
  bgGrad.addColorStop(0, '#c65d21');
  bgGrad.addColorStop(0.5, '#ea580c');
  bgGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 600);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(300, 240, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(300, 560, 220, Math.PI, 0, false);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
