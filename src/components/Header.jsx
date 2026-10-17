import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Header({ onReset }) {
  return (
    <header className="app-header">
      <div className="logo-group" onClick={onReset} role="button" tabIndex={0} title="Image Utility Home">
        <div className="logo-icon">
          <Sparkles size={16} />
        </div>
        <span className="logo-text">
          Image <span>Utility</span>
        </span>
      </div>

      <div className="privacy-badge">
        <span className="status-dot"></span>
        <ShieldCheck size={14} color="var(--color-success)" />
        <span>Processed in your browser</span>
      </div>
    </header>
  );
}
