import React, { useRef, useEffect, useState } from 'react';
import {
  Database,
  BarChart3,
  Code,
  Terminal,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

export default function ProductPreview() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[200px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-success/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Interactive Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text-primary tracking-tight mt-4 font-display">
            A Workstation Designed for Fast Answers
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            See how DATA_AGENT analyzes data, executes code, generates charts, and explains findings in one unified flow.
            This is a live preview of the actual application interface.
          </p>
        </div>

        {/* Product Mockup */}
        <div className="relative z-10 flex justify-center animate-fade-in-up">
          <div 
            className={`relative rounded-2xl bg-surface border border-border shadow-xl overflow-hidden transition-all duration-500 ${
              isHovered ? 'shadow-2xl border-primary/30' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: isHovered 
                ? 'rotateX(2deg) rotateY(-2deg) scale(1.01)' 
                : 'rotateX(0) rotateY(0) scale(1)',
            }}
          >
            {/* Window Bar */}
            <div className="bg-surface-secondary px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="text-xs text-text-muted font-mono-tight ml-3">sales_revenue_2026.csv — Active Dataset</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Quality Score: 98/100</span>
                </span>
                <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Workspace Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Question & Answer */}
              <div className="lg:col-span-7 space-y-6">
                {/* User Question */}
                <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                  <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>User Query</span>
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    "What was the monthly revenue trend in Q3 and which product category had the highest profit margin?"
                  </p>
                </div>

                {/* AI Grounded Synthesis */}
                <div className="p-5 rounded-xl bg-surface border border-primary/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                      <span className="text-xs font-semibold text-text-primary">DATA_AGENT Analysis</span>
                    </div>
                    <span className="text-[11px] text-text-muted font-mono-tight">Executed in 340ms</span>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    Total revenue in Q3 reached <strong className="text-primary">$1,428,500</strong> with a month-over-month growth of <strong className="text-success">+18.4%</strong>. The <strong className="text-text-primary">Enterprise Cloud Suite</strong> category achieved the highest profit margin at <strong className="text-success">74.2%</strong>, contributing $530,000 to net profits.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
                      <div className="text-[10px] text-text-muted uppercase">Q3 Revenue</div>
                      <div className="text-base font-bold text-text-primary">$1.43M</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
                      <div className="text-[10px] text-text-muted uppercase">MoM Growth</div>
                      <div className="text-base font-bold text-success">+18.4%</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
                      <div className="text-[10px] text-text-muted uppercase">Peak Margin</div>
                      <div className="text-base font-bold text-primary">74.2%</div>
                    </div>
                  </div>
                </div>

                {/* AST Code Box */}
                <div className="rounded-xl bg-[#0B0F1A] border border-border p-4 font-mono text-xs text-text-secondary">
                  <div className="flex items-center justify-between text-text-muted pb-2 border-b border-border mb-3">
                    <span className="flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>sandbox_execution.py</span>
                    </span>
                    <span className="text-[10px] text-success flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>AST Validated</span>
                    </span>
                  </div>
                  <pre className="text-primary/90 overflow-x-auto leading-relaxed">
{`# Sandboxed AST calculation
q3_data = df[df['quarter'] == 'Q3']
monthly_rev = q3_data.groupby('month')['revenue'].sum()
margins = (q3_data.groupby('category')['profit'].sum() / 
           q3_data.groupby('category')['revenue'].sum()) * 100`}
                  </pre>
                </div>
              </div>

              {/* Right Column: Visual Chart & Metrics */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="p-5 rounded-xl bg-surface border border-border flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-text-primary">Q3 Revenue Breakdown</span>
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>

                  {/* Visual Chart Bars */}
                  <div className="space-y-4 my-auto py-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">July</span>
                        <span className="font-semibold text-text-primary">$410,000</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">August</span>
                        <span className="font-semibold text-text-primary">$485,000</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">September</span>
                        <span className="font-semibold text-text-primary">$533,500</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-success rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                    <span>Export format: CSV / PDF / JSON</span>
                    <span className="text-success font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live Grounded</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-2">
                  <div className="text-xs font-semibold text-primary">Want to test with your own data?</div>
                  <a
                    href="/register"
                    className="btn-primary text-xs w-full py-2 inline-flex items-center justify-center space-x-2"
                  >
                    <span>Upload Your Dataset</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Below Mockup */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { icon: Database, title: 'Real Dataset Analysis', desc: 'Upload CSV/XLSX and query instantly', color: '#2563EB' },
            { icon: BarChart3, title: 'Auto-Generated Visualizations', desc: 'Charts created from query results', color: '#3B82F6' },
            { icon: Code, title: 'Full Code Transparency', desc: 'Every pandas script visible & auditable', color: '#16A34A' },
          ].map((item, i) => (
            <div
              key={item.title}
              className="card-elevated group p-6 flex items-start space-x-4 transition-all animate-fade-in-up"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-[${item.color}]/10 border border-[${item.color}]/30 flex items-center justify-center text-[${item.color}] shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-text-primary mb-1">{item.title}</h4>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}