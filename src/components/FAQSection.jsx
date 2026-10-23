import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQ_ITEMS = [
  {
    q: 'How does 100% client-side image editing protect my privacy?',
    a: 'Every image operation—including resizing, compression, format conversion, and watermark rendering—is computed strictly in your web browser using HTML5 Canvas and JavaScript. Your image bytes are never uploaded to any server or cloud storage, meaning your sensitive media never leaves your personal device.'
  },
  {
    q: 'Can I resize or compress images without noticeable quality loss?',
    a: 'Yes. Our compression tool employs perceptual quantization algorithms and high-fidelity downscaling routines that preserve edge crispness and color balance while shrinking file size by up to 80%. You can fine-tune quality with a visual preview slider or specify an exact target size in kilobytes.'
  },
  {
    q: 'What image formats are supported for conversion?',
    a: 'Image Utility supports bidirectional conversions between PNG (lossless with alpha transparency), JPEG (compressed photography), WebP (modern high-efficiency web format), AVIF (next-generation compression), BMP (uncompressed Windows raster), TIFF (archival print quality), and ICO (multi-resolution browser favicon format).'
  },
  {
    q: 'Is Image Utility completely free with no usage limits?',
    a: 'Yes. Image Utility is 100% free and open-source under the MIT License. There are no daily conversion quotas, paywalls, watermarks forced on output, or mandatory user accounts. Because computations run on your hardware, you can process as many images as you need.'
  },
  {
    q: 'How do I remove GPS coordinates and EXIF camera tags?',
    a: 'Use the Remove Metadata utility. When you load a photo, our engine decodes the pure pixel bitmap and re-encodes it into a pristine container without the Exif, TIFF, IPTC, or XMP metadata chunks, completely scrubbing GPS coordinates, camera serial numbers, and capture timestamps.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section" aria-labelledby="faq-main-heading">
      <div className="faq-heading-wrapper">
        <HelpCircle size={20} color="var(--color-accent)" />
        <h2 id="faq-main-heading" className="faq-main-title">
          Frequently Asked Questions
        </h2>
      </div>
      <p className="faq-subtitle">
        Everything you need to know about private, in-browser image optimization and conversions.
      </p>

      <div className="faq-accordion-list">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`faq-item-card ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-btn-${idx}`}
              >
                <h3 className="faq-question-title">{item.q}</h3>
                <ChevronDown
                  size={18}
                  className={`faq-chevron-icon ${isOpen ? 'is-rotated' : ''}`}
                />
              </button>
              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                className={`faq-answer-container ${isOpen ? 'is-visible' : ''}`}
              >
                <p className="faq-answer-text">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
