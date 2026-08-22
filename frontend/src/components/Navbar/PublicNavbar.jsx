import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Menu, X, Sparkles } from 'lucide-react';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pipeline', label: 'How It Works' },
    { href: '#trust', label: 'Security' },
  ];

  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header role="banner" className="h-[72px] bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Brand Logo */}
      <div className="flex items-center">
        <Link
          to="/"
          className="flex items-center space-x-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-xs">
            <Database className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-[20px] font-bold text-gray-900 tracking-tight hidden sm:block">
            InsightFlow
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links (Desktop) */}
      <nav role="navigation" aria-label="Main Navigation" className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollToSection(link.href)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary px-4 py-2 text-sm font-semibold"
          >
            Get Started
            <Sparkles className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-gray-900">InsightFlow</span>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-3"
                >
                  Get Started
                  <Sparkles className="w-4 h-4 ml-1 inline" aria-hidden="true" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}