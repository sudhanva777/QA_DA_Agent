import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-primary',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-primary',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-primary',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-primary',
  };

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') hideTooltip();
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  const tooltipContent = isVisible && createPortal(
    <div
      ref={tooltipRef}
      className={`absolute ${positionClasses[position]} z-50 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150`}
      role="tooltip"
    >
      {content}
      <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
    </div>,
    document.body
  );

  return (
    <span
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {tooltipContent}
    </span>
  );
}