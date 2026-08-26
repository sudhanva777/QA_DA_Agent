import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) {
  const variantClasses = {
    neutral: 'badge-neutral',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[0.625rem]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-0.5 text-sm',
  };

  return (
    <span
      className={`badge inline-flex items-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}