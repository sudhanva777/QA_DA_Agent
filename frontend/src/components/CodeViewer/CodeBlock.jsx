import React, { useState } from 'react';
import { Copy, Check, Code, Terminal } from 'lucide-react';

export default function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="p-4 text-xs md:text-sm text-text-muted italic bg-[#12121A] border border-white/[0.06] rounded-xl">
        No code available for this step.
      </div>
    );
  }

  return (
    <div className="bg-[#08080E] text-text-primary rounded-xl overflow-hidden shadow-dark-card border border-white/10 font-mono text-xs md:text-sm">
      {/* Header Bar */}
      <div className="bg-[#12121A] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center space-x-2">
          <Code className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
          <span className="font-semibold text-text-primary uppercase tracking-wider">{language}</span>
          <span className="text-white/20">|</span>
          <span className="text-text-dim hidden sm:inline">AST Sandboxed Execution</span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy python code to clipboard"
          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary bg-[#181824] hover:bg-[#202030] border border-white/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-accent-emerald mr-1" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1 text-text-dim" aria-hidden="true" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto leading-relaxed bg-[#050508]">
        <pre className="text-brand-200/90 font-mono text-xs md:text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
