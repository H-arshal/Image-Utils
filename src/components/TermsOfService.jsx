import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | Image Utility';
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="legal-page-container">
      <div className="legal-page-header">
        <Link to="/" className="legal-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Tools</span>
        </Link>
        <div className="legal-badge">
          <FileText size={16} color="var(--color-accent)" />
          <span>Transparent Terms</span>
        </div>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: October 23, 2026</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Image Utility (available at <code>https://www.image-utils.site</code>), you agree to be bound
            by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using the application.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. License and Free Use</h2>
          <p>
            Image Utility is provided as a free, open-source software project under the <strong>MIT License</strong>. You are free to
            use it for personal, educational, non-profit, or commercial purposes without licensing fees, subscriptions, or account requirements.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Intellectual Property Rights Over Your Images</h2>
          <p>
            You retain <strong>100% full, exclusive ownership and copyright</strong> of any images you load or process through
            Image Utility. Because processing is executed exclusively client-side in your web browser, Image Utility never claims,
            licenses, or acquires any rights to your content.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Disclaimer of Warranty</h2>
          <p>
            Image Utility is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied,
            including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            While our tools use mathematically sound canvas transformations and lossless encoding standards, we encourage keeping
            original backups of critical media files.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use
            or inability to use the software.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Source Code &amp; Contributions</h2>
          <p>
            The complete source code is publicly accessible on{' '}
            <a href="https://github.com/H-arshal/Image-Utils" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>. Contributions, bug reports, and pull requests are welcomed.
          </p>
        </section>
      </div>
    </article>
  );
}
