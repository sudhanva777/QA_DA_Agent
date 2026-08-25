import React, { useState, useEffect } from 'react';

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[450px] lg:h-[580px] flex items-center justify-center pointer-events-auto">
        <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-[var(--accent-primary)]/15 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute w-60 h-60 rounded-full bg-[var(--accent-primary)]/10 blur-[80px] pointer-events-none -z-10" />
        <div className="w-16 h-16 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] lg:h-[580px] flex items-center justify-center pointer-events-auto">
      {/* Hero-specific decorative elements that float near the camera */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[var(--accent-primary)]/30 blur-sm animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]/30 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[var(--accent-tertiary)]/30 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[var(--accent-primary)]/20 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}