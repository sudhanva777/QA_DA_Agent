import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, text: 'Inspecting schema & sample context...' },
  { id: 2, text: 'Generating pandas analysis code...' },
  { id: 3, text: 'Executing in safe AST sandbox...' },
  { id: 4, text: 'Synthesizing grounded natural language answer...' },
];

export default function SequentialLoader() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(2), 1200);
    const timer2 = setTimeout(() => setActiveStep(3), 2800);
    const timer3 = setTimeout(() => setActiveStep(4), 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-[#0E0E16]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-glass my-4 max-w-xl w-full">
      <div className="flex items-center space-x-2.5 text-sm font-semibold text-text-primary mb-3.5 pb-3 border-b border-white/[0.08]">
        <div className="w-6 h-6 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" aria-hidden="true" />
        </div>
        <span>Analyzing dataset with pandas engine...</span>
      </div>

      <div className="space-y-2.5 pl-1">
        {STEPS.map((step) => {
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-2.5 text-xs md:text-sm transition-all duration-200 ${
                isDone
                  ? 'text-accent-emerald font-medium'
                  : isCurrent
                  ? 'text-brand-300 font-semibold'
                  : 'text-text-dim font-normal'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" aria-hidden="true" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-4 h-4 text-text-dim/60 shrink-0" aria-hidden="true" />
              )}
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
