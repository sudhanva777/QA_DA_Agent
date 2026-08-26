import React, { useRef, useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Cpu,
  Code,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Zap,
  Shield,
  Network,
  Eye,
  Terminal,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    number: '01',
    title: 'Upload Dataset',
    description: 'Drop any CSV or Excel file. Automatic schema inference, null-value checks, and dataset health score calculation.',
    icon: FileSpreadsheet,
    color: '#2563EB',
    features: ['Auto schema inference', 'Null-value detection', 'Health scoring', 'Type optimization'],
  },
  {
    number: '02',
    title: 'Ask Questions',
    description: 'Express your analytical inquiries naturally without writing boilerplate Python code or complex database queries.',
    icon: Cpu,
    color: '#3B82F6',
    features: ['Natural language parsing', 'Intent recognition', 'Context awareness', 'Multi-turn support'],
  },
  {
    number: '03',
    title: 'AI Analysis & AST Execution',
    description: 'The reasoning agent constructs pandas execution plans and safely evaluates them in our isolated Python sandbox.',
    icon: Code,
    color: '#6366F1',
    features: ['AST validation', 'Sandbox execution', 'Memory limits', 'Timeout protection'],
  },
  {
    number: '04',
    title: 'Insights & Visuals',
    description: 'Receive crystal-clear natural language answers, interactive charts, structured tables, and exportable PDF summaries.',
    icon: BarChart3,
    color: '#16A34A',
    features: ['Grounded answers', 'Auto-chart generation', 'Data tables', 'PDF export'],
  },
];

export default function HowItWorks() {
  const containerRef = useRef(null);
  const [visibleStep, setVisibleStep] = useState(-1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = PIPELINE_STEPS.findIndex((_, i) => entry.target.dataset.index === String(i));
            if (index !== -1) setVisibleStep(index);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px' }
    );
    PIPELINE_STEPS.forEach((_, i) => {
      const el = containerRef.current?.querySelector(`[data-index="${i}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-success/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10 animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text-primary tracking-tight mt-4 font-display">
            From Raw File to Instant Insight
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            A 4-step pipeline combining automated profiling, LLM analytical planning, and sandboxed code execution.
            Scroll to travel through each stage.
          </p>
        </div>

        {/* Pipeline Journey - Spatial Layout */}
        <div className="relative z-10">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />
          
          <div className="space-y-20 lg:space-y-28">
            {PIPELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;
              const isVisible = visibleStep >= index;
              
              return (
                <div
                  key={step.number}
                  ref={(el) => { if (el) el.dataset.index = index; }}
                  className={`relative flex items-center gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'} opacity-0 translate-y-10 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
                  data-index={index}
                >
                  {/* Step Card */}
                  <div className={`w-full lg:w-1/2 relative ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`card-elevated relative p-6 sm:p-8 ${isVisible ? 'border-primary/30 shadow-lg' : ''} transition-all duration-500 animate-fade-in-up`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-black text-primary font-mono-tight">{step.number}</span>
                        <div className={`w-12 h-12 rounded-xl bg-[${step.color}]/10 border border-[${step.color}]/30 flex items-center justify-center text-[${step.color}] group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                      
                      {/* Feature highlights */}
                      <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        {step.features.map((feat, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs text-text-primary">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual Indicator */}
                  <div className="hidden lg:block w-32 h-32 flex items-center justify-center relative">
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[${step.color}]/20 to-transparent border border-[${step.color}]/40 flex items-center justify-center shadow-[0_0_40px_${step.color}40] animate-float`}>
                      <Icon className="w-8 h-8 text-[${step.color}]" />
                    </div>
                    {/* Connection line to next step */}
                    {index < PIPELINE_STEPS.length - 1 && (
                      <div className="absolute left-1/2 top-full w-px h-20 bg-gradient-to-b from-[${step.color}]/50 to-transparent -translate-x-1/2" />
                    )}
                    {/* Floating particles around step */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[1,2,3,4].map((i) => (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-[${step.color}]/60 animate-pulse"
                          style={{
                            top: `${20 + i * 12}%`,
                            left: `${15 + i * 18}%`,
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Version */}
        <div className="lg:hidden space-y-8 mt-16">
          {PIPELINE_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleStep >= index;
            return (
              <div
                key={step.number}
                ref={(el) => { if (el) el.dataset.index = index; }}
                className={`card-elevated p-6 transition-all duration-500 ${isVisible ? 'border-primary/30 shadow-lg' : 'opacity-50'} animate-fade-in-up`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-black text-primary font-mono-tight">{step.number}</span>
                  <div className={`w-10 h-10 rounded-xl bg-[${step.color}]/10 border border-[${step.color}]/30 flex items-center justify-center text-[${step.color}]`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{step.description}</p>
                <div className="space-y-2 text-left">
                  {step.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-text-primary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}