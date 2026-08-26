import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#preview', label: 'Product' },
    { href: '#cta', label: 'Security' },
  ];

  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-14">
          {/* Left: Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            aria-label="DATA_AGENT Home"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-200">
              <Database className="w-4.5 h-4.5 md:w-5 md:h-5" aria-hidden="true" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base md:text-lg font-bold text-text-primary tracking-tight">
                DATA_AGENT
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary hidden sm:inline-block">
                AI Analytics
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav role="navigation" aria-label="Main Navigation" className="hidden md:flex items-center space-x-1 bg-surface/80 border border-border rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Auth Actions */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white/95 backdrop-blur-2xl px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-text-primary">DATA_AGENT</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-text-secondary hover:text-text-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 py-6 space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-border space-y-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-text-primary bg-surface border border-border hover:bg-surface-secondary transition-colors block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary w-full text-center py-3 text-sm flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}