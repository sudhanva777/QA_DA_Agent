import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Zap,
  Shield,
  BarChart3,
  Code,
  ArrowRight,
  Sparkles,
  Users,
  Lock,
  Cpu,
  Network,
  FileSpreadsheet,
} from 'lucide-react';
import PublicNavbar from '../components/Navbar/PublicNavbar';

const HeroScene = lazy(() => import('../components/Three/HeroScene'));

const FEATURES = [
  {
    icon: Database,
    title: 'Natural Language Queries',
    description: 'Ask questions in plain English. The agent translates intent into precise pandas operations with zero SQL knowledge required.',
  },
  {
    icon: Zap,
    title: 'Instant Deterministic Execution',
    description: 'Code runs in a hardened AST sandbox. No hallucinated numbers, no approximate results — just grounded computation.',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Import blocking, syscall restrictions, execution timeouts, and memory caps. Your data never leaves your environment.',
  },
  {
    icon: BarChart3,
    title: 'Auto-Visualization',
    description: 'Charts generated automatically from analysis results. Recharts-powered interactive visualizations with zero configuration.',
  },
  {
    icon: Code,
    title: 'Full Code Transparency',
    description: 'Every answer shows the exact Python code executed. Audit, reproduce, and extend analyses with complete visibility.',
  },
  {
    icon: Network,
    title: 'Data Intelligence Pipeline',
    description: 'Automated profiling, quality scoring, anomaly detection, and AI-generated insights for every uploaded dataset.',
  },
];

const PIPELINE_STEPS = [
  {
    number: '01',
    title: 'Upload & Profile',
    description: 'Drag-and-drop CSV/Excel files. Automatic schema inference, type detection, and comprehensive data profiling report.',
    icon: FileSpreadsheet,
  },
  {
    number: '02',
    title: 'Quality Assessment',
    description: 'Validation engine detects missing values, outliers, type mismatches, duplicates, and structural anomalies with severity scoring.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'AI Analysis Planning',
    description: 'LLM decomposes natural language questions into structured multi-step pandas execution plans with explicit reasoning.',
    icon: Cpu,
  },
  {
    number: '04',
    title: 'Sandboxed Execution',
    description: 'Generated code runs in AST-validated Python sandbox with import blocking, timeout enforcement, and memory limits.',
    icon: Code,
  },
  {
    number: '05',
    title: 'Grounded Synthesis',
    description: 'Results composed into natural language answers with supporting tables, charts, and full execution logs for auditability.',
    icon: BarChart3,
  },
];

const TRUST_PILLARS = [
  {
    icon: Lock,
    title: 'Data Privacy',
    description: 'Datasets processed locally. No data sent to external model providers beyond schema context. Full air-gap deployment option.',
  },
  {
    icon: Code,
    title: 'Code Transparency',
    description: 'Every generated script is visible, auditable, and reproducible. No black-box inference — you see exactly what ran.',
  },
  {
    icon: Shield,
    title: 'Execution Safety',
    description: 'AST-level static analysis blocks dangerous operations. Resource limits prevent runaway computation. Zero supply-chain risk.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Shared workspaces, versioned analyses, and audit trails. Built for data teams who need governance and reproducibility.',
  },
];

const STATS = [
  { value: '<100ms', label: 'Avg Query Latency' },
  { value: '50MB', label: 'Max File Size' },
  { value: '100%', label: 'Code Visibility' },
  { value: 'Zero', label: 'Hallucinated Numbers' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white to-white" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>New: AI Data Analysis Agent v2.0</span>
                </div>

                <h1
                  id="hero-heading"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6"
                >
                  Ask questions about your data.
                  <br />
                  <span className="text-blue-600">Get grounded answers.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  InsightFlow transforms natural language into executable pandas code.
                  Deterministic. Auditable. Zero hallucination.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                  <Link
                    to="/register"
                    className="btn-primary px-6 py-3.5 text-base font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <span>Start Free Analysis</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary px-6 py-3.5 text-base font-semibold"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-xl mx-auto lg:mx-0">
                  {STATS.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Three.js Visualization */}
              <div className="relative" aria-hidden="true">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
                      <div className="text-center text-gray-500">
                        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
                        <p className="text-sm">Loading visualization...</p>
                      </div>
                    </div>
                  }>
                    <HeroScene />
                  </Suspense>
                  <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 h-16 w-full overflow-hidden" aria-hidden="true">
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,0 C360,80 720,-40 1080,40 C1440,120 1440,100 1440,100 L1440,100 L0,100 Z"
                fill="#F8FAFC"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section aria-labelledby="features-heading" className="py-16 md:py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-16">
              <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Built for Serious Data Work
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every feature designed to move you from raw data to trusted insight — without the guesswork.
              </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {FEATURES.map((feature, i) => (
                <article
                  key={i}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    <feature.icon className="w-5.5 h-5.5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works / Pipeline Section */}
        <section aria-labelledby="pipeline-heading" className="py-16 md:py-24 lg:py-32 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-16">
              <h2 id="pipeline-heading" className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                The AI Data Analysis Pipeline
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                From raw upload to actionable insight in five deterministic stages.
              </p>
            </header>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-400 to-emerald-400 -translate-x-1/2" />

              <div className="space-y-12 lg:space-y-16">
                {PIPELINE_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col lg:flex-row lg:items-center gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  >
                    <div className={`relative flex-1 ${i % 2 === 1 ? 'lg:pr-12' : 'lg:pl-12'} text-center lg:text-left`}>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
                        <span className="font-mono">{step.number}</span>
                      </div>
                      <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                        <step.icon className="w-5.5 h-5.5" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">{step.description}</p>
                    </div>

                    {/* Step indicator on the line */}
                    <div className="hidden lg:block absolute left-1/2 w-4 h-4 rounded-full border-4 border-white -translate-x-1/2 z-10"
                      style={{
                        backgroundColor: i < 2 ? '#3B82F6' : i < 4 ? '#10B981' : '#F59E0B',
                        borderColor: 'white',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo / Visualization Placeholder */}
        <section aria-labelledby="demo-heading" className="py-16 md:py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-12">
              <h2 id="demo-heading" className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                See It In Action
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Upload a dataset and start asking questions immediately. No setup, no configuration.
              </p>
            </header>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-xs">
                    <Database className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Try the Live Demo</h3>
                    <p className="text-sm text-gray-500">Upload a CSV and ask your first question in seconds</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">sales_data.csv</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">Q</div>
                      <div className="flex-1 text-gray-900 font-medium">"What are the total sales by region for Q4?"</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100 ml-11">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">A</div>
                      <div className="flex-1 text-gray-900">
                        <p className="font-medium">North: $2.4M | South: $1.8M | East: $3.1M | West: $2.7M</p>
                        <p className="text-sm text-gray-500 mt-1">Generated chart: Bar chart • 127ms execution</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 mt-4"
                  >
                    <span>Start Your Analysis</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Transparency Section */}
        <section aria-labelledby="trust-heading" className="py-16 md:py-24 lg:py-32 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto mb-16">
              <h2 id="trust-heading" className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                Transparency You Can Trust
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Security, privacy, and auditability built into every layer — not bolted on as an afterthought.
              </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {TRUST_PILLARS.map((pillar, i) => (
                <article
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <pillar.icon className="w-5.5 h-5.5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section aria-labelledby="cta-heading" className="py-16 md:py-24 lg:py-32 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-500/20 via-transparent to-transparent" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to Analyze Your Data?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join data teams who've moved beyond guesswork. Upload your first dataset and get grounded answers in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-3.5 rounded-md transition-colors text-base shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-600 hover:border-gray-400 text-gray-200 hover:text-white font-semibold px-8 py-3.5 rounded-md transition-colors text-base"
              >
                Sign In to Existing Account
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required · 14-day full access · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-xs">
                  <Database className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">InsightFlow</span>
              </Link>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                AI-powered data analysis agent. Natural language queries, deterministic execution, complete transparency.
              </p>
            </div>

            <nav aria-label="Product links">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/register" className="hover:text-blue-600 transition-colors">Get Started</Link></li>
                <li><Link to="#features" className="hover:text-blue-600 transition-colors">Features</Link></li>
                <li><Link to="#pipeline" className="hover:text-blue-600 transition-colors">How It Works</Link></li>
                <li><Link to="#trust" className="hover:text-blue-600 transition-colors">Security</Link></li>
              </ul>
            </nav>

            <nav aria-label="Company links">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} InsightFlow. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}