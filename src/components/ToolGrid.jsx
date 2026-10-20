import React from 'react';
import { Link } from 'react-router-dom';
import {
  Maximize2,
  FileDown,
  Crop,
  Circle,
  Square,
  Repeat,
  RotateCw,
  FileText,
  ShieldAlert,
  Wrench,
  Sliders,
  Type,
  Globe
} from 'lucide-react';

export const TOOLS = [
  {
    id: 'resize',
    name: 'Resize',
    desc: 'Change width and height dimensions with aspect ratio lock.',
    icon: Maximize2
  },
  {
    id: 'compress',
    name: 'Compress',
    desc: 'Reduce file size using target KB or quality slider.',
    icon: FileDown
  },
  {
    id: 'convert',
    name: 'Convert',
    desc: 'Convert seamlessly between PNG, JPEG, WebP, BMP, AVIF, TIFF, and ICO.',
    icon: Repeat
  },
  {
    id: 'crop',
    name: 'Crop',
    desc: 'Crop rectangular regions with 1:1, 16:9, 4:3, or freeform presets.',
    icon: Crop
  },
  {
    id: 'favicon',
    name: 'Favicon Generator',
    desc: 'Generate multi-resolution .ico and mobile app icons with live preview.',
    icon: Globe
  },
  {
    id: 'circle',
    name: 'Circle Crop',
    desc: 'Create circular profile pictures and avatars with transparent PNG.',
    icon: Circle
  },
  {
    id: 'radius',
    name: 'Corner Radius',
    desc: 'Add clean rounded corners with transparent outer clipping.',
    icon: Square
  },
  {
    id: 'border',
    name: 'Add Border',
    desc: 'Add stylish border frames with customizable colors and widths.',
    icon: Square
  },
  {
    id: 'rotate',
    name: 'Rotate & Flip',
    desc: 'Rotate 90°, 180° or mirror flip horizontally and vertically.',
    icon: RotateCw
  },
  {
    id: 'watermark',
    name: 'Watermark',
    desc: 'Protect photos with custom copyright text, logos, and opacity.',
    icon: Type
  },
  {
    id: 'adjust',
    name: 'Adjust & Filters',
    desc: 'Fine-tune exposure, contrast, warmth, vignette, and 9 quick filters.',
    icon: Sliders
  },
  {
    id: 'pdf',
    name: 'Image to PDF',
    desc: 'Generate single-page A4, Letter, or fit-to-image printable PDFs.',
    icon: FileText
  },
  {
    id: 'metadata',
    name: 'Remove Metadata',
    desc: 'Inspect and scrub EXIF, camera, and GPS location tags.',
    icon: ShieldAlert
  }
];

export default function ToolGrid({ onSelectTool }) {
  return (
    <section>
      <div className="tools-grid-heading">
        <Wrench size={18} color="var(--color-accent)" />
        <span>Everyday image utilities</span>
      </div>

      <div className="tools-grid">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={`/${tool.id}`}
              className="tool-card"
              onClick={(e) => {
                e.preventDefault();
                onSelectTool(tool.id);
              }}
            >
              <div className="tool-card-icon">
                <Icon size={18} />
              </div>
              <h3 className="tool-card-title">{tool.name}</h3>
              <p className="tool-card-desc">{tool.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
