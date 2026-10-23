import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

const sizes = [16, 32, 48];
const images = sizes.map(size => {
  const file = path.join(publicDir, `favicon-${size}x${size}.png`);
  const data = fs.readFileSync(file);
  return { width: size, height: size, data, size: data.length };
});

const headerSize = 6;
const dirEntrySize = 16;
const numImages = images.length;
const dirSize = numImages * dirEntrySize;
let totalSize = headerSize + dirSize;
for (const img of images) {
  totalSize += img.size;
}

const buffer = Buffer.alloc(totalSize);

// ICONDIR Header
buffer.writeUInt16LE(0, 0); // reserved
buffer.writeUInt16LE(1, 2); // type 1 = ICO
buffer.writeUInt16LE(numImages, 4); // count

let currentOffset = headerSize + dirSize;

for (let i = 0; i < numImages; i++) {
  const img = images[i];
  const entryOffset = headerSize + i * dirEntrySize;

  buffer.writeUInt8(img.width >= 256 ? 0 : img.width, entryOffset);
  buffer.writeUInt8(img.height >= 256 ? 0 : img.height, entryOffset + 1);
  buffer.writeUInt8(0, entryOffset + 2); // color count
  buffer.writeUInt8(0, entryOffset + 3); // reserved
  buffer.writeUInt16LE(1, entryOffset + 4); // color planes
  buffer.writeUInt16LE(32, entryOffset + 6); // bits per pixel
  buffer.writeUInt32LE(img.size, entryOffset + 8); // image byte size
  buffer.writeUInt32LE(currentOffset, entryOffset + 12); // image byte offset

  img.data.copy(buffer, currentOffset);
  currentOffset += img.size;
}

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
console.log('Successfully created public/favicon.ico with sizes 16x16, 32x32, 48x48! Total bytes:', buffer.length);
