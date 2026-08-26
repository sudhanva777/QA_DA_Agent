import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '../components/ui';
import WorkflowCanvas from '../components/Workflow/WorkflowCanvas';

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
    description: 'Visualizations generated automatically from query aggregates. Responsive charts with customized palettes and hover tooltips.',
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
    color: '#2563EB',
  },
  {
    number: '02',
    title: 'Ask Questions',
    description: 'Express your analytical inquiries naturally without writing boilerplate Python code or complex database queries.',
    icon: Cpu,
    color: '#3B82F6',
  },
  {
    number: '03',
    title: 'AI Analysis & AST Execution',
    description: 'The reasoning agent constructs pandas execution plans and safely evaluates them in our isolated Python sandbox.',
    icon: Code,
    color: '#6366F1',
  },
  {
    number: '04',
    title: 'Insights & Visuals',
    description: 'Receive crystal-clear natural language answers, interactive charts, structured tables, and exportable PDF summaries.',
    icon: BarChart3,
    color: '#16A34A',
  },
];

export default function Landing() {
  const [activeTab, setActiveTab] = useState('insights');
  const scrollRef = useRef(null);
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 selection:text-primary overflow-x-hidden relative">
      <div ref={scrollRef} className="relative z-10">
        <PublicNavbar />

        {/* Hero Section */}
        <section ref={heroRef} id="hero" className="relative pt-20 md:pt-24 lg:pt-32 pb-16 md:pb-20 lg:pb-28">
          {/* Subtle background accents */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-success/5 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              
              {/* Left Hero Content */}
              <div className="lg:col-span-7 relative text-center lg:text-left space-y-6 lg:space-y-8">
                {/* Pill badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/80 border border-border shadow-sm backdrop-blur-sm animate-fade-in-up">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-semibold text-text-muted tracking-widest uppercase">
                    AI Data Intelligence Platform
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-display font-extrabold tracking-tight text-text-primary leading-[1.05] text-balance
                  text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  [font-size:clamp(2.5rem,5vw,5.5rem)]
                ">
                  Your Data.
                  <br />
                  <span className="text-gradient">
                    Your Questions.
                  </span>
                  <br />
                  Intelligent Answers.
                </h1>

                {/* Subheading */}
                <p className="text-sm md:text-base lg:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Upload your dataset, ask questions in plain English, and get deterministic AI-powered analysis with charts, code, and exportable reports. No hallucinations. Just insights.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2 md:pt-4">
                  <Link
                    to="/register"
                    className="btn-primary w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-semibold rounded-xl flex items-center justify-center space-x-2.5 group"
                  >
                    <span>Start Analyzing Free</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-semibold rounded-xl flex items-center justify-center space-x-2.5"
                  >
                    <span>Explore Demo</span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-text-muted" />
                  </Link>
                </div>

                {/* Capability bullet points */}
                <div className="pt-6 md:pt-8 border-t border-border grid grid-cols-3 gap-4 md:gap-6 text-left">
                  <div className="group">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <Target className="w-4.5 h-4.5 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xs md:text-sm font-bold text-text-primary">100% Deterministic</div>
                    <div className="text-[11px] md:text-xs text-text-muted">Sandboxed AST Python</div>
                  </div>
                  <div className="group">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <Wand2 className="w-4.5 h-4.5 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xs md:text-sm font-bold text-text-primary">Zero SQL Needed</div>
                    <div className="text-[11px] md:text-xs text-text-muted">Natural Language QA</div>
                  </div>
                  <div className="group">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <Shield className="w-4.5 h-4.5 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xs md:text-sm font-bold text-text-primary">Enterprise Ready</div>
                    <div className="text-[11px] md:text-xs text-text-muted">Auto Profiling & Export</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Interactive Workflow Canvas */}
              <div className="lg:col-span-5 relative flex items-center justify-center w-full hidden lg:block">
                <div className="relative w-full max-w-[520px] mx-auto">
                  <WorkflowCanvas />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative border-t border-border bg-surface py-16 md:py-24 lg:py-32">
          <Suspense fallback={<div className="h-64" />}>
            <HowItWorks />
          </Suspense>
        </section>

        {/* Features */}
        <section id="features" className="relative border-t border-border bg-surface-secondary py-16 md:py-24 lg:py-32">
          <Suspense fallback={<div className="h-64" />}>
            <Features features={FEATURES} />
          </Suspense>
        </section>

        {/* Product Preview */}
        <section id="preview" className="relative border-t border-border bg-surface py-16 md:py-24 lg:py-32">
          <Suspense fallback={<div className="h-64" />}>
            <ProductPreview />
          </Suspense>
        </section>

        {/* Final CTA */}
        <section id="cta" className="relative border-t border-border bg-surface py-16 md:py-24 lg:py-32">
          <Suspense fallback={<div className="h-64" />}>
            <FinalCTA />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="py-10 md:py-12 border-t border-border bg-surface text-xs text-text-muted relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span className="font-bold text-text-secondary">DATA_AGENT</span>
              <span>© 2026 AI Data Intelligence. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="hover:text-text-primary transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-text-primary transition-colors">Register</Link>
              <a href="#cta" className="hover:text-text-primary transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}