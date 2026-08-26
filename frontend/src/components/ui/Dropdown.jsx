import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Dropdown({
  trigger,
  items,
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && createPortal(
        <div
          className={`absolute z-50 mt-2 w-48 ${alignClasses[align]} animate-in fade-in-0 zoom-in-95 duration-150`}
          role="menu"
        >
          <div className="bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
            {items.map((item, index) => (
              <button
                key={index}
                role="menuitem"
                onClick={() => { item.onClick?.(); setIsOpen(false); }}
                disabled={item.disabled}
                className={`w-full px-3 py-2 text-sm text-left flex items-center space-x-2 transition-colors ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
                {item.shortcut && <span className="ml-auto text-xs text-text-muted">{item.shortcut}</span>}
              </button>
            ))}
            {items.some(item => item.divider) && items.map((item, index) => 
              item.divider && <div key={`divider-${index}`} className="border-t border-border my-1" />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}