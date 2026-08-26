import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, Settings as SettingsIcon, LayoutDashboard, CheckCircle2, AlertCircle, Menu, Sparkles, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Dropdown } from '../ui';

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

  const userMenuItems = [
    { label: 'Sign Out', icon: <LogOut className="w-4 h-4" />, onClick: handleLogout, disabled: isLoggingOut },
  ];

  return (
    <header role="banner" className="h-14 bg-white/95 backdrop-blur-xl border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface transition-colors rounded-lg md:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <Link
          to="/dashboard"
          className="flex items-center space-x-2.5 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-primary p-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Database className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-text-primary tracking-tight">
              DATA_AGENT
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">
              <Sparkles className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Active Dataset Badge */}
      <div className="hidden sm:flex items-center space-x-2 bg-surface border border-border px-3.5 py-1 rounded-full text-xs flex-1 max-w-md mx-6 justify-center">
        <span className="text-text-secondary font-medium">Dataset:</span>
        {activeDataset ? (
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-text-primary max-w-[180px] truncate font-mono-tight text-[11px]">
              {activeDataset}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              Ready
            </span>
          </div>
        ) : (
          <span className="text-text-muted text-xs italic">No active file</span>
        )}
      </div>

      {/* Right Navigation & System Health */}
      <div className="flex items-center space-x-2">
        <nav role="navigation" aria-label="Main Navigation" className="flex items-center space-x-1">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              location.pathname === '/dashboard'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Workstation</span>
          </Link>

          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              location.pathname === '/settings'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        {/* API Health Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2 py-1" role="status" aria-live="polite">
          {isConnected ? (
            <span className="flex items-center text-success text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
              API Ready
            </span>
          ) : (
            <span className="flex items-center text-warning text-[11px]">
              <AlertCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              Connecting...
            </span>
          )}
        </div>

        {/* User Profile Menu & Logout */}
        {isAuthenticated && user && (
          <div className="flex items-center space-x-1.5">
            <Dropdown
              trigger={
                <button
                  type="button"
                  aria-label="User Profile Menu"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden md:block max-w-[110px] truncate text-text-primary text-xs font-medium">{user.name || user.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </button>
              }
              items={userMenuItems}
              align="right"
            />

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sign Out"
              title="Sign Out"
              className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-error ml-0.5"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-error" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}