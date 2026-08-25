import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { ShieldCheck, Cpu, Database, Server, CheckCircle2, Lock, Terminal, Sparkles } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent-primary)]/30 selection:text-[var(--accent-primary-glow)] relative">
      {/* Global 3D scene is rendered by App */}
      <Navbar isConnected={true} activeDataset={null} />

      <main role="main" className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-6 relative z-10">
        <div className="relative animate-fade-in-up">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--accent-primary)]/5 blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[var(--accent-secondary)]/5 blur-xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-display">
            System Settings & Security
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            System configuration, sandboxed execution rules, model parameters, and database state.
          </p>
        </div>

        {/* Section 1: LLM & Inference Engine */}
        <section aria-labelledby="inference-heading" className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-glass)] space-y-4 relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '100ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5" />
          <div className="relative flex items-center space-x-2 text-[var(--text-primary)] font-bold text-base md:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)]">
              <Cpu className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 id="inference-heading">LLM & Inference Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent" />
              <span className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider relative">Active Model</span>
              <div className="font-bold text-[var(--text-primary)] mt-1 text-sm md:text-base font-mono-tight relative">llama-3.3-70b-versatile</div>
              <span className="text-xs text-[var(--accent-tertiary)] bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/30 px-2.5 py-0.5 rounded-full font-semibold mt-2.5 inline-block relative">
                Groq API Hardware Acceleration
              </span>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/5 to-transparent" />
              <span className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider relative">Execution Mode</span>
              <div className="font-bold text-[var(--text-primary)] mt-1 text-sm md:text-base relative">Structured JSON Code Generation</div>
              <span className="text-xs text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-2.5 py-0.5 rounded-full font-semibold mt-2.5 inline-block relative">
                Anti-Hallucination 2-Pass Pipeline
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: AST Execution Sandbox Safety */}
        <section aria-labelledby="sandbox-heading" className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-glass)] space-y-4 relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '200ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-tertiary)]/5 via-transparent to-[var(--accent-secondary)]/5" />
          <div className="relative flex items-center space-x-2 text-[var(--text-primary)] font-bold text-base md:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/30 flex items-center justify-center text-[var(--accent-tertiary)]">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 id="sandbox-heading">AST Security & Execution Sandbox</h2>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed relative">
            All code generated by the LLM is statically validated via Python AST before execution in a restricted namespace.
          </p>

          <div className="space-y-2.5 text-xs md:text-sm">
            <div className="flex items-center justify-between bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-subtle)] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-tertiary)]/5 to-transparent" />
              <span className="font-medium text-[var(--text-primary)] relative">Import Statements Blocked</span>
              <span className="text-[var(--accent-tertiary)] font-semibold bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/30 px-2.5 py-0.5 rounded-md text-xs font-mono-tight relative">
                Enforced (ast.Import, ast.ImportFrom)
              </span>
            </div>

            <div className="flex items-center justify-between bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-subtle)] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-hot)]/5 to-transparent" />
              <span className="font-medium text-[var(--text-primary)] relative">Blocked System Calls</span>
              <span className="text-[var(--accent-tertiary)] font-semibold bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/30 px-2.5 py-0.5 rounded-md text-xs font-mono-tight relative">
                eval, exec, open, compile, __import__
              </span>
            </div>

            <div className="flex items-center justify-between bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-subtle)] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent" />
              <span className="font-medium text-[var(--text-primary)] relative">Execution Watchdog Timeout</span>
              <span className="text-[var(--accent-primary)] font-semibold bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-2.5 py-0.5 rounded-md text-xs font-mono-tight relative">
                10 Seconds Thread Limit
              </span>
            </div>

            <div className="flex items-center justify-between bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-subtle)] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)]/5 to-transparent" />
              <span className="font-medium text-[var(--text-primary)] relative">Result Memory Cap</span>
              <span className="text-[var(--accent-primary)] font-semibold bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 px-2.5 py-0.5 rounded-md text-xs font-mono-tight relative">
                Max 1,000 Rows Returned
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: SQLite Database & Logs */}
        <section aria-labelledby="database-heading" className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-glass)] space-y-4 relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '300ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)]/5 via-transparent to-[var(--accent-warm)]/5" />
          <div className="relative flex items-center space-x-2 text-[var(--text-primary)] font-bold text-base md:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 flex items-center justify-center text-[var(--accent-secondary)]">
              <Database className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 id="database-heading">Database Persistence & Logging</h2>
          </div>

          <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)] text-xs md:text-sm space-y-2.5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-secondary)]/5 to-transparent" />
            <div className="flex justify-between flex-wrap gap-1 relative">
              <span className="text-[var(--text-muted)] font-medium">Database System:</span>
              <span className="font-mono-tight text-[var(--text-primary)] font-semibold">PostgreSQL / Neon & SQLite</span>
            </div>
            <div className="flex justify-between flex-wrap gap-1 relative">
              <span className="text-[var(--text-muted)] font-medium">Table Schema:</span>
              <span className="font-mono-tight text-[var(--text-secondary)]">users, logs (id, timestamp, dataset_name, ...)</span>
            </div>
          </div>
        </section>
        
        {/* Section 4: Three.js & Visual Settings */}
        <section aria-labelledby="visual-heading" className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-6 shadow-[var(--shadow-glass)] space-y-4 relative overflow-hidden animate-fade-in-up" style={{ transitionDelay: '400ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)]/5 via-transparent to-transparent" />
          <div className="relative flex items-center space-x-2 text-[var(--text-primary)] font-bold text-base md:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 flex items-center justify-center text-[var(--accent-secondary)]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 id="visual-heading">Visual Environment</h2>
          </div>

          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed relative">
            The cinematic 3D data universe runs continuously across all pages. Adjust visual preferences below.
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-[var(--text-primary)] text-sm">Reduced Motion</span>
              <input
                type="checkbox"
                className="w-10 h-5 rounded-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] appearance-none relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:left-5 checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-[var(--text-primary)] text-sm">Ambient Particles</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-10 h-5 rounded-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] appearance-none relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:left-5 checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-[var(--text-primary)] text-sm">Mouse Parallax</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-10 h-5 rounded-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] appearance-none relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:left-5 checked:bg-[var(--accent-primary)] checked:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}