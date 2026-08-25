import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThreeScene } from '../context/ThreeSceneContext';
import {
  Database,
  Zap,
  Shield,
  BarChart3,
  Code,
  ArrowRight,
  Sparkles,
  Lock,
  Cpu,
  Network,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Activity,
  Terminal,
  Layers,
  Target,
  Wand2,
  Brain,
  Server,
  Eye,
  ExternalLink,
} from 'lucide-react';
import PublicNavbar from '../components/Navbar/PublicNavbar';

const HeroScene = lazy(() => import('../components/Three/HeroScene'));
const HowItWorks = lazy(() => import('../components/Sections/HowItWorks'));
const Features = lazy(() => import('../components/Sections/Features'));
const ProductPreview = lazy(() => import('../components/Sections/ProductPreview'));
const FinalCTA = lazy(() => import('../components/Sections/FinalCTA'));

const FEATURES = [
  {
    icon: Database,
    title: 'Natural Language Queries',
    description: 'Ask questions in plain conversational English. The agent translates intent into exact, optimized pandas operations with zero SQL needed.',
    badge: 'NLP Engine',
  },
  {
    icon: Zap,
    title: 'Grounded AST Execution',
    description: 'Python code executes inside a hardened, isolated AST sandbox. No hallucinated figures, no approximation — strictly deterministic computations.',
    badge: 'Zero Hallucination',
  },
  {
    icon: Shield,
    title: 'Hardened Security',
    description: 'Syscall restrictions, import blacklists, execution timeouts, and strict memory limits keep your dataset protected at all times.',
    badge: 'Sandbox Cap',
  },
  {
    icon: BarChart3,
    title: 'Intelligent Auto-Charts',
    description: 'Visualizations generated automatically from query aggregates. Responsive charts with customized dark palettes and hover tooltips.',
    badge: 'Recharts',
  },
  {
    icon: Code,
    title: 'Complete Code Auditability',
    description: 'Inspect the exact Python pandas script executed for every single question. Total transparency, repeatability, and zero black box mysteries.',
    badge: 'AST Inspector',
  },
  {
    icon: Network,
    title: 'Automated Profiling & Health',
    description: 'Instant data quality scoring, missing-value scans, anomaly detection, type inference, and AI-suggested questions on file upload.',
    badge: 'Quality Engine',
  },
];

const PIPELINE_STEPS = [
  {
    number: '01',
    title: 'Upload Dataset',
    description: 'Drop any CSV or Excel file. Automatic schema inference, null-value checks, and dataset health score calculation.',
    icon: FileSpreadsheet,
  },
  {
    number: '02',
    title: 'Ask Questions',
    description: 'Express your analytical inquiries naturally without writing boilerplate Python code or complex database queries.',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'AI Analysis & AST Execution',
    description: 'The reasoning agent constructs pandas execution plans and safely evaluates them in our isolated Python sandbox.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Insights & Visuals',
    description: 'Receive crystal-clear natural language answers, interactive charts, structured tables, and exportable PDF summaries.',
    icon: BarChart3,
  },
];

export default function Landing() {
  const [activeTab, setActiveTab] = useState('insights');
  const { scrollProgress } = useThreeScene();
  const scrollRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollProgress * (scrollRef.current.scrollHeight - window.innerHeight);
    }
  }, [scrollProgress]);

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--accent-primary-glow)] overflow-x-hidden relative">
      <div ref={scrollRef} className="relative z-10">
        <PublicNavbar />

        {/* Global 3D Scene */}
        <Suspense fallback={<div className="fixed inset-0 -z-10" />}>
          <HeroScene />
        </Suspense>

        {/* Hero Section - Entry Point */}
        <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-32 lg:pt-0 lg:pb-20">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[var(--accent-primary)]/3 rounded-full blur-[250px]" />
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[var(--accent-secondary)]/3 rounded-full blur-[200px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--accent-tertiary)]/3 rounded-full blur-[200px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
              
              {/* Left Hero Content */}
              <div className="lg:col-span-7 relative text-center lg:text-left space-y-10">
                {/* Pill badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[var(--bg-base)]/80 border border-[var(--border-default)] shadow-[var(--shadow-glow-sm)] backdrop-blur-sm animate-fade-in-up">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)] tracking-widest uppercase">
                    Cinematic AI Data Intelligence
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.02] font-display">
                  Your Data.
                  <br />
                  <span className="text-gradient-violet">
                    Your Questions.
                  </span>
                  <br />
                  Intelligent Answers.
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Enter a living data universe. Ask questions in plain English and watch AI navigate through your datasets, 
                  executing grounded pandas analysis in isolated sandboxes. No hallucinations. Just insights.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    to="/register"
                    className="btn-primary w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl flex items-center justify-center space-x-3 group"
                  >
                    <span>Start Analyzing Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl flex items-center justify-center space-x-3"
                  >
                    <span>Explore Demo</span>
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                  </Link>
                </div>

                {/* Capability bullet points */}
                <div className="pt-8 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-6 text-left">
                  <div className="group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] mb-3 group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">100% Deterministic</div>
                    <div className="text-xs text-[var(--text-dim)]">Sandboxed AST Python</div>
                  </div>
                  <div className="group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--accent-secondary)] mb-3 group-hover:scale-110 transition-transform">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">Zero SQL Needed</div>
                    <div className="text-xs text-[var(--text-dim)]">Natural Language QA</div>
                  </div>
                  <div className="group">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/20 flex items-center justify-center text-[var(--accent-tertiary)] mb-3 group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">Enterprise Ready</div>
                    <div className="text-xs text-[var(--text-dim)]">Auto Profiling & Export</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Floating 3D Data Objects Preview */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full h-[500px] lg:h-[600px]">
                  {/* Floating data cards around the hero - positioned in 3D space */}
                  <FloatingDataCard
                    position={{ x: -35, y: 25, z: -25 }}
                    rotation={-0.15}
                    delay={0}
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-primary)]/30 shadow-[0_0_25px_rgba(139,92,246,0.15)] backdrop-blur-xl min-w-[200px]">
                      <div className="flex items-center space-x-2 text-[var(--accent-primary)] mb-2">
                        <Database className="w-5 h-5" />
                        <span className="font-semibold text-[var(--text-primary)]">Dataset</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--text-primary)] font-mono-tight">12,482</div>
                      <div className="text-xs text-[var(--text-muted)]">rows × 18 columns</div>
                    </div>
                  </FloatingDataCard>

                  <FloatingDataCard
                    position={{ x: 45, y: -15, z: -35 }}
                    rotation={0.1}
                    delay={0.2}
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-secondary)]/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-xl min-w-[200px]">
                      <div className="flex items-center space-x-2 text-[var(--accent-secondary)] mb-2">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-semibold text-[var(--text-primary)]">Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--text-primary)] font-mono-tight">$1.43M</div>
                      <div className="text-xs text-[var(--accent-tertiary)]">+18.4% MoM</div>
                    </div>
                  </FloatingDataCard>

                  <FloatingDataCard
                    position={{ x: -50, y: -30, z: 5 }}
                    rotation={0.05}
                    delay={0.4}
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-tertiary)]/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl min-w-[200px]">
                      <div className="flex items-center space-x-2 text-[var(--accent-tertiary)] mb-2">
                        <Brain className="w-5 h-5" />
                        <span className="font-semibold text-[var(--text-primary)]">AI Insight</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--text-primary)] font-mono-tight">14.7 days</div>
                      <div className="text-xs text-[var(--text-muted)]">Avg Duration</div>
                    </div>
                  </FloatingDataCard>

                  <FloatingDataCard
                    position={{ x: 40, y: 40, z: -20 }}
                    rotation={-0.08}
                    delay={0.6}
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-warm)]/30 shadow-[0_0_25px_rgba(245,158,11,0.15)] backdrop-blur-xl min-w-[200px]">
                      <div className="flex items-center space-x-2 text-[var(--accent-warm)] mb-2">
                        <Terminal className="w-5 h-5" />
                        <span className="font-semibold text-[var(--text-primary)]">Query</span>
                      </div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">"Avg dev time?"</div>
                      <div className="text-xs text-[var(--text-muted)]">Natural Language</div>
                    </div>
                  </FloatingDataCard>

                  <FloatingDataCard
                    position={{ x: -25, y: 50, z: -45 }}
                    rotation={0.12}
                    delay={0.8}
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-rose)]/30 shadow-[0_0_25px_rgba(236,72,153,0.15)] backdrop-blur-xl min-w-[200px]">
                      <div className="flex items-center space-x-2 text-[var(--accent-rose)] mb-2">
                        <Code className="w-5 h-5" />
                        <span className="font-semibold text-[var(--text-primary)]">Code</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--text-primary)] font-mono-tight">42 lines</div>
                      <div className="text-xs text-[var(--text-muted)]">Pandas Script</div>
                    </div>
                  </FloatingDataCard>

                  {/* Central Data Orb indicator */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-[var(--text-muted)]/50 animate-float-slow">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce" />
                    <span className="text-xs font-mono-tight uppercase tracking-wider">Scroll to Journey</span>
                    <div className="w-px h-16 bg-gradient-to-b from-[var(--accent-primary)]/50 to-transparent" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works - Spatial Journey */}
        <section id="how-it-works" className="relative border-t border-[var(--border-subtle)]">
          <Suspense fallback={<div className="h-64" />}>
            <HowItWorks />
          </Suspense>
        </section>

        {/* Features - Floating Feature Objects */}
        <section id="features" className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
          <Suspense fallback={<div className="h-64" />}>
            <Features features={FEATURES} />
          </Suspense>
        </section>

        {/* Product Preview - Workstation Floating in Space */}
        <section id="preview" className="relative border-t border-[var(--border-subtle)]">
          <Suspense fallback={<div className="h-64" />}>
            <ProductPreview />
          </Suspense>
        </section>

        {/* Final CTA - Arrival at AI Engine */}
        <section id="cta" className="relative border-t border-[var(--border-subtle)]">
          <Suspense fallback={<div className="h-64" />}>
            <FinalCTA />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-[var(--border-default)] bg-[var(--bg-deep)] text-xs text-[var(--text-dim)] relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs">
                <Database className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[var(--text-secondary)]">DATA_AGENT</span>
              <span>© 2026 InsightFlow Engine. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-[var(--text-primary)] transition-colors">Register</Link>
              <a href="#cta" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FloatingDataCard({ position, rotation, delay, children }) {
  const { isReducedMotion } = useThreeScene();
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isReducedMotion || !ref.current) return;
    const duration = 4000 + delay * 1000;
    const animate = () => {
      if (!ref.current) return;
      const t = Date.now() / duration;
      ref.current.style.transform = `
        translate3d(${position.x}px, ${position.y + Math.sin(t * 2 * Math.PI) * 12}px, ${position.z}px)
        rotateY(${rotation + Math.sin(t * Math.PI) * 0.08}rad)
        rotateX(${Math.cos(t * Math.PI) * 0.05}rad)
      `;
      requestAnimationFrame(animate);
    };
    animate();
  }, [position, rotation, delay, isReducedMotion]);

  return (
    <div
      ref={ref}
      className="absolute transition-transform duration-300 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) rotateY(${rotation}rad)`,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}