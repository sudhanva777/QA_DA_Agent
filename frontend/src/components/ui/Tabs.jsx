import React from 'react';

export default function Tabs({
  tabs,
  activeTab,
  onChangeTab,
  variant = 'default',
  className = '',
}) {
  const variantClasses = {
    default: 'border-b border-border bg-surface',
    pills: 'bg-surface-secondary p-1 rounded-lg',
    underline: 'border-b border-border',
  };

  const getTabClasses = (tabId) => ({
    default: `
      py-2.5 px-3.5 rounded-t-lg text-sm font-medium transition-all duration-150
      border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      ${
        activeTab === tabId
          ? 'border-primary text-primary bg-primary-light'
          : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
      }
    `,
    pills: `
      py-2 px-3.5 rounded-md text-sm font-medium transition-all duration-150
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      ${
        activeTab === tabId
          ? 'bg-surface text-primary shadow-sm'
          : 'text-text-secondary hover:text-text-primary'
      }
    `,
    underline: `
      py-2.5 px-1 text-sm font-medium transition-all duration-150
      border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      ${
        activeTab === tabId
          ? 'border-primary text-primary'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }
    `,
  });

  return (
    <div className={`${variantClasses[variant]} ${className}`} role="tablist" aria-label="Tabs">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`${getTabClasses(tab.id)[variant]} flex items-center space-x-1.5 whitespace-nowrap`}
            >
              {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} aria-hidden="true" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[0.625rem] font-mono font-semibold ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-surface-secondary text-text-muted border border-border'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function TabPanel({ id, activeTab, children, className = '' }) {
  if (activeTab !== id) return null;
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
}