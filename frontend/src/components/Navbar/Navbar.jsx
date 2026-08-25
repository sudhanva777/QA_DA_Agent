import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, Settings as SettingsIcon, LayoutDashboard, CheckCircle2, AlertCircle, Menu, Sparkles, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeDataset, isConnected, onToggleMobileSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <header role="banner" className="h-[60px] bg-[var(--bg-base)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[var(--shadow-glass)]">
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] rounded-lg md:hidden focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <Link
          to="/dashboard"
          className="flex items-center space-x-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] p-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-[var(--shadow-glow-sm)]">
            <Database className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-[var(--text-primary)] tracking-tight">
              DATA_AGENT
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-[var(--accent-primary)]/10 text-[var(--accent-primary-glow)] border border-[var(--accent-primary)]/30 rounded-full">
              <Sparkles className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Active Dataset Badge */}
      <div className="hidden sm:flex items-center space-x-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3.5 py-1 rounded-full text-xs flex-1 max-w-md mx-6 justify-center">
        <span className="text-[var(--text-muted)] font-medium">Dataset:</span>
        {activeDataset ? (
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-[var(--text-primary)] max-w-[180px] truncate font-mono-tight text-[11px]">
              {activeDataset}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)] border border-[var(--accent-tertiary)]/30">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              Ready
            </span>
          </div>
        ) : (
          <span className="text-[var(--text-muted)] text-xs italic">No active file</span>
        )}
      </div>

      {/* Right Navigation & System Health */}
      <div className="flex items-center space-x-2">
        <nav role="navigation" aria-label="Main Navigation" className="flex items-center space-x-1">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] ${
              location.pathname === '/dashboard'
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary-glow)] border border-[var(--accent-primary)]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Workstation</span>
          </Link>

          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] ${
              location.pathname === '/settings'
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary-glow)] border border-[var(--accent-primary)]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05]'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* API Health Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2 py-1" role="status" aria-live="polite">
          {isConnected ? (
            <span className="flex items-center text-[var(--accent-tertiary)] text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tertiary)] mr-1.5 animate-pulse" />
              API Ready
            </span>
          ) : (
            <span className="flex items-center text-[var(--accent-warm)] text-[11px]">
              <AlertCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              Connecting...
            </span>
          )}
        </div>

        {/* User Profile Menu */}
        {isAuthenticated && user && (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/30 border border-[var(--accent-primary)]/40 text-[var(--accent-primary-glow)] flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden md:block max-w-[110px] truncate text-[var(--text-primary)] text-xs">{user.name || user.email}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[var(--shadow-glass)] py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3.5 py-2.5 border-b border-[var(--border-subtle)]">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate font-mono-tight">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-[var(--accent-hot)] hover:bg-[var(--accent-hot)]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}