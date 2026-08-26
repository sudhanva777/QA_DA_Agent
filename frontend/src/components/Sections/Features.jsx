import React, { useRef, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const FEATURE_CATEGORIES = [
  {
    category: 'Analysis Engine',
    color: '#2563EB',
    icon: 'Brain',
    features: [
      { title: 'Natural Language Queries', desc: 'Ask questions in plain English. Zero SQL needed.', badge: 'NLP' },
      { title: 'Grounded AST Execution', desc: 'Deterministic pandas code in isolated sandbox.', badge: 'AST' },
      { title: 'Anti-Hallucination', desc: '2-pass validation prevents fabricated results.', badge: 'Verified' },
      { title: 'Multi-turn Conversations', desc: 'Context-aware follow-up questions.', badge: 'Chat' },
    ],
  },
  {
    category: 'Visualization & Data',
    color: '#3B82F6',
    icon: 'BarChart3',
    features: [
      { title: 'Intelligent Auto-Charts', desc: 'Bar, line, area, pie, scatter, heatmap auto-selection.', badge: 'Charts' },
      { title: 'Interactive Data Tables', desc: 'Search, sort, paginate, export CSV.', badge: 'Tables' },
      { title: 'Dataset Profiling', desc: 'Quality scores, null analysis, type inference.', badge: 'Profile' },
      { title: 'Smart Data Cleaning', desc: 'Automated imputation, dedup, normalization.', badge: 'Clean' },
    ],
  },
  {
    category: 'Security & Export',
    color: '#16A34A',
    icon: 'Shield',
    features: [
      { title: 'Hardened Sandbox', desc: 'Blocked imports, syscalls, 10s timeout.', badge: 'Secure' },
      { title: 'Code Auditability', desc: 'Full pandas script visible for every query.', badge: 'Code' },
      { title: 'PDF Reports', desc: 'One-click export with charts, code, insights.', badge: 'PDF' },
      { title: 'History & Replay', desc: 'Full conversation history with dataset context.', badge: 'History' },
    ],
  },
];

export default function Features({ features: legacyFeatures }) {
  const containerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    FEATURE_CATEGORIES.flatMap((cat, ci) => 
      cat.features.map((_, fi) => `${ci}-${fi}`)
    ).forEach((key, i) => {
      const el = containerRef.current?.querySelector(`[data-card="${key}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const IconComponents = {
    Brain: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    BarChart3: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  };

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-success/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Key Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text-primary tracking-tight mt-4 font-display">
            Engineered for Precision & Security
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Built for technical teams, analysts, and operators who require verifiable, deterministic data analysis.
          </p>
        </div>

        {/* Feature Categories */}
        <div ref={containerRef} className="relative z-10">
          {FEATURE_CATEGORIES.map((category, catIndex) => {
            const Icon = IconComponents[category.icon];
            return (
              <div key={category.category} className="mb-24 lg:mb-32 relative">
                {/* Category Header */}
                <div className="mb-10 flex items-center space-x-3 animate-fade-in-up" style={{ transitionDelay: `${catIndex * 100}ms` }}>
                  <div className={`w-12 h-12 rounded-xl bg-[${category.color}]/10 border border-[${category.color}]/30 flex items-center justify-center text-[${category.color}]`}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{category.category}</h3>
                    <p className="text-sm text-text-muted">Core capabilities in this domain</p>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.features.map((feature, featIndex) => {
                    const cardKey = `${catIndex}-${featIndex}`;
                    const numericKey = catIndex * 10 + featIndex;
                    const isVisible = visibleCards.has(numericKey);
                    
                    return (
                      <div
                        key={feature.title}
                        ref={(el) => { if (el) el.dataset.card = cardKey; }}
                        className={`card-interactive relative group overflow-hidden transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        data-card={cardKey}
                        style={{ transitionDelay: `${featIndex * 80}ms` }}
                      >
                        {/* Floating glow background */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-[${category.color}]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        <div className="relative p-6 h-full flex flex-col">
                          {/* Badge */}
                          <div className="mb-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[${category.color}]/10 border border-[${category.color}]/30 text-[${category.color}]`}>
                              {feature.badge}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h4 className="text-base font-bold text-text-primary mb-2 group-hover:text-[${category.color}] transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-text-secondary leading-relaxed flex-1">
                            {feature.desc}
                          </p>

                          {/* Hover indicator */}
                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-text-muted">Explore</span>
                            <CheckCircle2 className={`w-4 h-4 text-[${category.color}]`} />
                          </div>
                        </div>

                        {/* Floating particles on hover */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 rounded-full bg-[${category.color}]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                top: `${20 + i * 20}%`,
                                left: `${10 + i * 25}%`,
                                animationDelay: `${i * 150}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legacy features support */}
          {legacyFeatures && legacyFeatures.length > 0 && (
            <div className="pt-16 border-t border-border">
              <h3 className="text-lg font-bold text-text-primary mb-8 text-center">Additional Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legacyFeatures.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="card-interactive group animate-fade-in-up"
                      style={{ transitionDelay: `${idx * 80}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-text-muted bg-surface-secondary border border-border px-2 py-0.5 rounded-full">{feature.badge}</span>
                      </div>
                      <h4 className="text-base font-bold text-text-primary mb-2">{feature.title}</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}