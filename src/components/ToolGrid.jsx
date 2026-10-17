import React from 'react';
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
  Wrench
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
    id: 'crop',
    name: 'Crop',
    desc: 'Crop rectangular regions with 1:1, 16:9, 4:3, or freeform presets.',
    icon: Crop
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
    id: 'convert',
    name: 'Convert',
    desc: 'Convert seamlessly between PNG, JPEG, and WebP formats.',
    icon: Repeat
  },
  {
    id: 'rotate',
    name: 'Rotate & Flip',
    desc: 'Rotate 90°, 180° or mirror flip horizontally and vertically.',
    icon: RotateCw
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
            <div
              key={tool.id}
              className="tool-card"
              onClick={() => onSelectTool(tool.id)}
              role="button"
              tabIndex={0}
            >
              <div className="tool-card-icon">
                <Icon size={18} />
              </div>
              <h4 className="tool-card-title">{tool.name}</h4>
              <p className="tool-card-desc">{tool.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
