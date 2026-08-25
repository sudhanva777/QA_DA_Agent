import React, { useRef, useEffect, useState } from 'react';
import { useThreeScene } from '../../context/ThreeSceneContext';
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

export default function ProductPreview() {
  const { _isReducedMotion } = useThreeScene();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-32 lg:py-48 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--accent-primary)]/3 rounded-full blur-[200px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--accent-secondary)]/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent-tertiary)]/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-3 py-1 rounded-full">
            Interactive Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight mt-4 font-display">
            A Workstation Designed for Fast Answers
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-4 max-w-xl mx-auto">
            See how DATA_AGENT analyzes data, executes code, generates charts, and explains findings in one unified flow.
            This is a live preview of the actual application interface.
          </p>
        </div>

        {/* Product Mockup - Floating in 3D Space */}
        <div className="relative z-10 flex justify-center animate-fade-in-up">
          <div 
            className={`relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] shadow-2xl overflow-hidden transition-all duration-500 ${
              isHovered ? 'shadow-[0_0_60px_rgba(139,92,246,0.2)] border-[var(--accent-primary)]/30' : ''
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
            <div className="bg-[var(--bg-elevated)] px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[var(--accent-hot)]/80" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-warm)]/80" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-tertiary)]/80" />
                <span className="text-xs text-[var(--text-muted)] font-mono-tight ml-3">sales_revenue_2026.csv — Active Dataset</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="badge-brand text-[11px] flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Quality Score: 98/100</span>
                </span>
                <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Workspace Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Question & Answer */}
              <div className="lg:col-span-7 space-y-6">
                {/* User Question */}
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[11px] font-semibold text-[var(--accent-primary)] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>User Query</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    "What was the monthly revenue trend in Q3 and which product category had the highest profit margin?"
                  </p>
                </div>

                {/* AI Grounded Synthesis */}
                <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--accent-primary)]/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">DATA_AGENT Analysis</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono-tight">Executed in 340ms</span>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Total revenue in Q3 reached <strong className="text-[var(--accent-primary)]">$1,428,500</strong> with a month-over-month growth of <strong className="text-[var(--accent-tertiary)]">+18.4%</strong>. The <strong className="text-[var(--text-primary)]">Enterprise Cloud Suite</strong> category achieved the highest profit margin at <strong className="text-[var(--accent-tertiary)]">74.2%</strong>, contributing $530,000 to net profits.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">Q3 Revenue</div>
                      <div className="text-base font-bold text-[var(--text-primary)]">$1.43M</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">MoM Growth</div>
                      <div className="text-base font-bold text-[var(--accent-tertiary)]">+18.4%</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">Peak Margin</div>
                      <div className="text-base font-bold text-[var(--accent-primary)]">74.2%</div>
                    </div>
                  </div>
                </div>

                {/* AST Code Box */}
                <div className="rounded-xl bg-[var(--bg-deep)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between text-[var(--text-muted)] pb-2 border-b border-[var(--border-subtle)] mb-3">
                    <span className="flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>sandbox_execution.py</span>
                    </span>
                    <span className="text-[10px] text-[var(--accent-tertiary)] flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>AST Validated</span>
                    </span>
                  </div>
                  <pre className="text-[var(--accent-primary-glow)]/90 overflow-x-auto leading-relaxed">
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
                <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">Q3 Revenue Breakdown</span>
                    <BarChart3 className="w-4 h-4 text-[var(--accent-primary)]" />
                  </div>

                  {/* Visual Chart Bars */}
                  <div className="space-y-4 my-auto py-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">July</span>
                        <span className="font-semibold text-[var(--text-primary)]">$410,000</span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">August</span>
                        <span className="font-semibold text-[var(--text-primary)]">$485,000</span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)]">September</span>
                        <span className="font-semibold text-[var(--text-primary)]">$533,500</span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Export format: CSV / PDF / JSON</span>
                    <span className="text-[var(--accent-tertiary)] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live Grounded</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/30 to-[var(--accent-secondary)]/20 border border-[var(--accent-primary)]/30 text-center space-y-2">
                  <div className="text-xs font-semibold text-[var(--accent-primary-glow)]">Want to test with your own data?</div>
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
            { icon: Database, title: 'Real Dataset Analysis', desc: 'Upload CSV/XLSX and query instantly', color: '#6366F1' },
            { icon: BarChart3, title: 'Auto-Generated Visualizations', desc: 'Charts created from query results', color: '#06B6D4' },
            { icon: Code, title: 'Full Code Transparency', desc: 'Every pandas script visible & auditable', color: '#10B981' },
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
                <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">{item.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}