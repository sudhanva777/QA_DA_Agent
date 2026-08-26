import React, { useState } from 'react';
import { Copy, Check, Code, Terminal } from 'lucide-react';
import { Button } from '../ui';

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
      <div className="p-4 text-xs md:text-sm text-text-muted italic card">
        No code available for this step.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden shadow-sm font-mono text-xs md:text-sm">
      {/* Header Bar */}
      <div className="bg-surface-secondary px-4 py-2.5 border-b border-border flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center space-x-2">
          <Code className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-text-primary uppercase tracking-wider">{language}</span>
          <span className="text-border">|</span>
          <span className="text-text-muted hidden sm:inline">AST Sandboxed Execution</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy python code to clipboard"
          leftIcon={copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto leading-relaxed bg-[#0B0F1A]">
        <pre className="text-primary/90 font-mono text-xs md:text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}