import React from 'react';

export default function Tabs({ tabs, activeTab, onChangeTab }) {
  return (
    <div className="border-b border-white/[0.08] bg-[#0E0E16] px-3 pt-2">
      <nav className="flex space-x-1.5 overflow-x-auto" role="tablist" aria-label="Analysis Output Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`py-2 px-3.5 rounded-t-xl text-xs font-semibold transition-all duration-150 flex items-center space-x-2 whitespace-nowrap border-b-2 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                isActive
                  ? 'border-brand-500 text-brand-300 bg-brand-500/10 shadow-glow-sm'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-text-dim'}`} aria-hidden="true" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                  isActive ? 'bg-brand-500/20 text-brand-200 border border-brand-500/30' : 'bg-white/[0.06] text-text-muted border border-white/[0.08]'
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
