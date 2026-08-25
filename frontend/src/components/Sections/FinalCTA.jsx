import React from 'react';
import { Link } from 'react-router-dom';
import { useThreeScene } from '../../context/ThreeSceneContext';
import { ArrowRight, Sparkles, Database, Zap, Shield, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  const { _isReducedMotion } = useThreeScene();

  return (
    <section className="relative py-32 lg:py-48 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[200px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--accent-secondary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--accent-tertiary)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Animated Center Piece */}
        <div className="mb-12 relative animate-fade-in-up">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[var(--shadow-glow-lg)] relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] animate-ping opacity-75" />
            <Database className="w-10 h-10 text-white relative" />
          </div>
          
          {/* Orbiting indicators */}
          <div className="absolute inset-0 -z-10">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[var(--accent-primary)]/20"
                style={{
                  animation: `orbit ${20 + i * 5}s linear infinite`,
                  animationDelay: `${i * -5}s`,
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight mb-6 font-display animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
          Ready to Transform Your Data?
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ transitionDelay: '200ms' }}>
          Join thousands of analysts using DATA_AGENT for deterministic, hallucination-free data intelligence.
          Start free. No credit card required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ transitionDelay: '300ms' }}>
          <Link
            to="/register"
            className="btn-primary px-8 py-4 text-base font-semibold rounded-xl flex items-center justify-center space-x-3 group shadow-[var(--shadow-glow-lg)]"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Analyzing Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary px-8 py-4 text-base font-semibold rounded-xl flex items-center justify-center space-x-3"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-5 h-5 text-[var(--text-muted)]" />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12 animate-fade-in-up" style={{ transitionDelay: '400ms' }}>
          {[
            { icon: CheckCircle2, label: 'No setup required', color: '#10B981' },
            { icon: Zap, label: 'Instant insights', color: '#F59E0B' },
            { icon: Shield, label: 'Enterprise security', color: '#6366F1' },
            { icon: Database, label: 'Your data, your control', color: '#8B5CF6' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="card-elevated p-4 flex flex-col items-center space-y-2 group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-[${item.color}]/10 border border-[${item.color}]/30 flex items-center justify-center text-[${item.color}] group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-[var(--text-secondary)] text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Final reassurance */}
        <p className="text-xs text-[var(--text-dim)] animate-fade-in-up" style={{ transitionDelay: '500ms' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Your data is never used for training.
        </p>
      </div>

      <style jsx global>{`
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}