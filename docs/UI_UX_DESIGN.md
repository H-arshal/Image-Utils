# Image Utility --- Design System

> A lightweight, professional image utility with a warm burnt-orange
> accent. The interface should feel like a dependable desktop tool:
> clear, restrained, and focused on the image---not like a flashy SaaS
> dashboard.

## 1. Design principles

1.  **Clarity first:** make the primary action and current tool obvious.
2.  **Keep it simple:** prefer familiar controls and direct workflows
    over extra panels, onboarding, or configuration.
3.  **Image-first workspace:** the uploaded image is the main focus; UI
    chrome should remain quiet.
4.  **Consistent interactions:** use the same patterns for tool
    selection, fields, presets, status, and downloads.
5.  **Privacy without exaggeration:** show client-side processing status
    only when the implementation actually processes files locally.
6.  **Accessible by default:** readable contrast, visible keyboard
    focus, labels for controls, and usable layouts at smaller widths.

## 2. Visual direction

- **Theme:** light.
- **Brand accent:** burnt orange.
- **Mood:** creative, confident, practical, professional.
- **Layout:** clean desktop workspace with a tool navigation area,
  central preview, and contextual settings panel.
- **Surfaces:** white and warm-neutral backgrounds, thin borders,
  restrained shadows.
- **Avoid:** purple accents, neon glow, decorative gradients, heavy
  glassmorphism, excessive rounded cards, unnecessary animation, and
  decorative UI that does not help users complete a task.

## 3. Color tokens

Use these tokens consistently. Avoid introducing extra accent colors
without a clear functional reason.

---

Token Value Usage

---

`--color-accent` `#C65D21` Primary buttons, active
tool indicator,
selected controls, key
links

`--color-accent-hover` `#A94B18` Hover state for primary
actions

`--color-accent-pressed` `#873B13` Pressed state

`--color-accent-tint` `#FFF4EB` Selected tool
background and subtle
accent surfaces

`--color-accent-border` `#F3C7A8` Borders around selected
or highlighted controls

`--color-page` `#FAFAF9` Main application
background

`--color-surface` `#FFFFFF` Panels, inputs, menus,
and cards

`--color-surface-subtle` `#F5F5F4` Secondary surfaces and
hover backgrounds

`--color-text` `#111827` Headings and primary
content

`--color-text-secondary` `#64748B` Descriptions, metadata,
supporting labels

`--color-text-muted` `#78716C` Low-emphasis text; do
not use for essential
information without
checking contrast

`--color-border` `#E7E5E4` Standard borders and
dividers

`--color-border-strong` `#D6D3D1` Emphasized borders and
input outlines

`--color-focus` `#2563EB` Visible keyboard focus
ring

`--color-success` `#15803D` Successful operations
and confirmation

`--color-warning` `#B45309` Warnings and
recoverable issues

`--color-danger` `#B91C1C` Errors and destructive
actions

`--color-info` `#0369A1` Informational status

---

### Color usage rules

- Keep most of the interface neutral. Orange should identify important
  actions and the current selection, not color every icon.
- Use solid orange for primary buttons; do not use an orange gradient.
- Use `--color-accent-tint` behind selected tools and presets, with
  orange text or an orange indicator.
- Keep ordinary tool icons slate gray. Use orange for the active tool
  or a meaningful action.
- Do not use color alone to communicate state; pair it with text, an
  icon, or another visible cue.
- Reserve green for genuine success or verified local-processing
  status, not decoration.
- Check contrast for all text and interactive states before release.

## 4. Typography

Use a system sans-serif stack to keep the UI fast and familiar. Use a
bundled font only if the project already includes one.

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

---

Element Suggested size Weight Notes

---

Page title 28--32 px 650--700 Use sparingly;
the workspace
should not feel
like a
marketing
landing page

Panel heading 16--18 px 600 Clear and
compact

Tool name 14--15 px 550--600 Keep labels
easy to scan

Body text 14 px 400 Default UI text

Supporting text 12--13 px 400 Metadata and
short
descriptions

Numeric values 14 px 500 Use tabular
numerals for
dimensions and
file sizes

---

Use sentence case for headings and controls. Avoid excessive uppercase
labels and letter spacing. Keep line-height around `1.45–1.6` for body
text.

## 5. Shape, spacing, borders, and elevation

Prefer modest radii and clean edges over pill-shaped controls
everywhere.

```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --shadow-panel: 0 1px 3px rgb(17 24 39 / 5%);
  --shadow-popover: 0 8px 24px rgb(17 24 39 / 10%);
  --focus-ring: 0 0 0 3px rgb(37 99 235 / 22%);
}
```

- Use borders to define panels; do not rely on shadows for every
  separation.
- Apply shadows mainly to menus, dialogs, and floating elements.
- Use consistent spacing increments. Prefer whitespace over extra
  decorative dividers.
- Buttons, fields, and tool items should share a consistent height and
  alignment.
- Do not make every section a separate floating card.

## 6. Application layout

### Header

Include: - Brand mark and **Image Utility** wordmark. - A compact
privacy/status indicator. - GitHub and About links, if these
destinations exist. - Theme control only if light/dark themes are
actually supported.

Keep the header short, with a subtle bottom border. Use the orange
accent on the brand mark or the word "Utility"; keep the rest of the
wordmark dark.

Suggested privacy copy: **"Processed in your browser"** or
**"Client-side processing"**---only if accurate. Avoid absolute claims
such as "100% private" unless every relevant processing path supports
that claim.

### Empty state

The initial screen should quickly communicate what the tool does and how
to begin.

- Heading: **"Everyday image tools. Simple, private, in-browser."**
- One short supporting sentence.
- A clear upload/drop area with a browse action and clipboard-paste
  hint.
- A compact grid of available tools with icons, names, and one-line
  descriptions.
- Avoid lengthy onboarding or large marketing sections.

Support drag and drop, file browsing, and clipboard paste where
implemented. Clearly list accepted formats: JPG/JPEG, PNG, WebP, BMP,
and GIF. If a format or animated image is not fully supported by a
particular operation, explain that before processing.

### Active workspace

Use a three-part desktop layout:

1.  **Tool navigation:** a narrow sidebar listing the available tools.
2.  **Preview area:** the largest region, showing the current image and
    preview controls.
3.  **Settings panel:** contextual controls for the selected tool,
    result information, and the primary download action.

The active workspace should prioritize the preview. Keep the filename,
original dimensions, and original file size visible but secondary.

On narrower screens, stack or collapse navigation and settings rather
than forcing the desktop layout into a cramped view.

## 7. Tool navigation

Initial tool set:

1.  Resize
2.  Compress
3.  Crop
4.  Rotate
5.  Convert
6.  Circle Crop
7.  Add Border
8.  Watermark
9.  Adjust

Each item should contain a recognizable icon, a short name, and an
optional brief description. Keep icons consistent in size and stroke
weight.

### Active tool state

- Background: `--color-accent-tint`
- Text and icon: `--color-accent`
- Add a slim orange edge or another clear non-color indicator.
- Avoid glowing borders, gradients, and large saturated blocks.

Inactive tools use neutral text and icons. Hover states should be subtle
and consistent.

## 8. Image preview

- Use a neutral canvas with enough space around the image.
- Show a subtle checkerboard behind images that may contain
  transparency.
- Preserve the image aspect ratio unless the selected operation
  explicitly changes it.
- Provide zoom in/out and a fit-to-view action where appropriate.
- Keep compare/before-after controls near the preview and make their
  current state clear.
- Do not distort the image to fill the preview area.
- For crop tools, make the crop boundary and handles visible against
  both light and dark image content.
- Keep preview controls compact so they do not compete with the image.

## 9. Settings panel and controls

The settings panel changes based on the active tool. Keep controls
grouped by task, with labels above fields and units shown explicitly.

### Resize example

- Aspect-ratio lock toggle.
- Width and height inputs, with `px` units.
- Preset buttons: 25%, 50%, 75%, 100%.
- Result dimensions and estimated output size, when available.
- Primary **Download Image** button.

Use clear labels and sensible validation. Keep numeric fields and
sliders synchronized only where a slider is useful; do not add sliders
to every numeric control.

### General control rules

- Inputs must have visible labels; do not rely on placeholder text as
  the label.
- Use a clear disabled state when an action cannot be performed.
- Show validation next to the relevant control.
- Preserve user settings when switching tools where doing so is
  predictable and useful.
- Keep destructive or irreversible actions clearly distinguished.
- Provide keyboard access for all controls.

## 10. Buttons and interaction states

### Primary button

Use for the main action in the current workflow, such as **Download
Image**.

```css
.button-primary {
  color: #ffffff;
  background: #c65d21;
  border: 1px solid #c65d21;
}

.button-primary:hover {
  background: #a94b18;
  border-color: #a94b18;
}

.button-primary:active {
  background: #873b13;
  border-color: #873b13;
}
```

Use a visible focus ring and a disabled state with sufficient contrast.
Avoid gradients, oversized shadows, and decorative ripple effects.

### Secondary button

Use a white background, neutral border, and dark text. On hover, use
`--color-surface-subtle`.

### Dropzone

- Default: neutral surface, subtle dashed border, clear upload icon
  and instruction.
- Drag-over: light orange tint and orange dashed border.
- Invalid file: show a concise explanation of accepted formats.
- Processing: show progress or a clear busy state where practical.

### Feedback

- Success: concise confirmation, such as "Image downloaded."
- Error: explain what happened and what the user can do next.
- Loading: indicate the operation in progress and prevent duplicate
  submissions when needed.
- Use motion only to communicate state changes; honor reduced-motion
  preferences.

## 11. Privacy and file handling

Privacy messaging must match the actual implementation.

- If processing happens entirely locally, state that files are
  processed in the browser.
- Do not upload files to a server unless the product explicitly
  requires it and explains this to the user.
- Do not claim that no data ever leaves the browser if analytics,
  remote processing, or other network requests contradict that claim.
- Avoid retaining image data longer than required for the active task.
- Make unsupported formats and operation limitations clear.

## 12. Responsive behavior

### Desktop

- Show tool navigation, preview, and settings panel together when
  space allows.
- Give the preview the most room.
- Keep the settings panel a readable, stable width.

### Tablet

- Reduce gaps and panel padding.
- Allow tool navigation to collapse into a compact rail or horizontal
  list.
- Keep settings reachable without obscuring the preview.

### Mobile / narrow viewport

- Use a single-column layout.
- Keep upload and primary actions easy to find.
- Put tool selection in a compact horizontal list or accessible menu.
- Avoid horizontal page scrolling.
- Ensure controls have comfortable touch targets; aim for
  approximately 44 × 44 px where practical.

## 13. Accessibility checklist

- [ ] Text and controls meet WCAG AA contrast targets where
      applicable.
- [ ] Every input has a programmatic and visible label.
- [ ] Keyboard focus is always visible.
- [ ] All functionality is available without a mouse.
- [ ] Icon-only controls have accessible names and tooltips where
      useful.
- [ ] Status and errors are communicated in text, not color alone.
- [ ] Drag and drop has a browse alternative.
- [ ] Reduced-motion preferences are respected.
- [ ] Layout remains usable at browser zoom and narrow widths.

## 14. Implementation-ready CSS variables

```css
:root {
  color-scheme: light;

  --color-accent: #c65d21;
  --color-accent-hover: #a94b18;
  --color-accent-pressed: #873b13;
  --color-accent-tint: #fff4eb;
  --color-accent-border: #f3c7a8;

  --color-page: #fafaf9;
  --color-surface: #ffffff;
  --color-surface-subtle: #f5f5f4;

  --color-text: #111827;
  --color-text-secondary: #64748b;
  --color-text-muted: #78716c;

  --color-border: #e7e5e4;
  --color-border-strong: #d6d3d1;
  --color-focus: #2563eb;

  --color-success: #15803d;
  --color-warning: #b45309;
  --color-danger: #b91c1c;
  --color-info: #0369a1;

  --font-sans:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 10px;

  --shadow-panel: 0 1px 3px rgb(17 24 39 / 5%);
  --shadow-popover: 0 8px 24px rgb(17 24 39 / 10%);
  --focus-ring: 0 0 0 3px rgb(37 99 235 / 22%);
}
```

## 15. Definition of done

The design is ready when:

- [ ] The interface uses the burnt-orange palette consistently.
- [ ] The layout is light, restrained, and image-focused.
- [ ] Every tool has a clear active state and a predictable place for
      its controls.
- [ ] Upload, preview, edit, and download states are visually defined.
- [ ] Loading, empty, invalid-file, error, and success states are
      covered.
- [ ] The layout works on desktop, tablet, and mobile.
- [ ] Keyboard focus, labels, and contrast have been checked.
- [ ] Privacy claims accurately describe the implementation.
- [ ] No decorative gradients, neon effects, or unnecessary UI have
      been added.

---

**Design rule of thumb:** if a visual element does not improve clarity,
feedback, or task completion, leave it out.
