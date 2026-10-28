import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { TOOLS_SEO_DATA } from '../data/toolsSeoContent';

export default function ToolGuideSection({ toolId }) {
  const toolData = TOOLS_SEO_DATA[toolId];
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!toolData) return null;

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? -1 : idx);
  };

  return (
    <section className="tool-guide-section" aria-labelledby="tool-guide-heading">
      <div className="tool-guide-container">
        {/* Header with high-intent keywords */}
        <div className="tool-guide-header">
          <div className="tool-guide-badge">
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>100% Private In-Browser Guide</span>
          </div>
          <h2 id="tool-guide-heading" className="tool-guide-title">
            How to Use {toolData.name} Online
          </h2>
          <p className="tool-guide-subtitle">{toolData.desc}</p>
        </div>

        {/* 3 Step-by-Step Cards (HowTo) */}
        <div className="tool-steps-grid">
          {toolData.steps.map((step, idx) => (
            <div key={idx} className="tool-step-card">
              <div className="tool-step-number">{idx + 1}</div>
              <h3 className="tool-step-title">{step.name}</h3>
              <p className="tool-step-text">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Key Features List */}
        <div className="tool-features-card">
          <div className="tool-features-header">
            <Sparkles size={18} color="var(--color-accent)" />
            <h3 className="tool-features-title">Why Use Image Utils for {toolData.name}?</h3>
          </div>
          <ul className="tool-features-list">
            {toolData.features.map((feat, idx) => (
              <li key={idx} className="tool-feature-item">
                <CheckCircle2 size={16} className="tool-feature-icon" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tool FAQs with Expandable Accordion */}
        {toolData.faqs && toolData.faqs.length > 0 && (
          <div className="tool-faqs-wrapper">
            <div className="tool-faqs-header">
              <HelpCircle size={18} color="var(--color-accent)" />
              <h3 className="tool-faqs-title">Frequently Asked Questions</h3>
            </div>
            <div className="tool-faqs-list">
              {toolData.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`tool-faq-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="tool-faq-question-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="tool-faq-question-text">{faq.q}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isOpen && (
                      <div className="tool-faq-answer-content">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Tools Quick Navigation */}
        {toolData.related && toolData.related.length > 0 && (
          <div className="tool-related-section">
            <span className="tool-related-label">Frequently Used Together:</span>
            <div className="tool-related-links">
              {toolData.related.map((relId) => {
                const relTool = TOOLS_SEO_DATA[relId];
                if (!relTool) return null;
                return (
                  <Link key={relId} to={`/${relId}`} className="tool-related-chip">
                    <span>{relTool.name}</span>
                    <ArrowRight size={12} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
