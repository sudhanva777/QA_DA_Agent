import React, { useState, useRef, useEffect } from 'react';
import { Send, FileSpreadsheet, Database, ArrowRight, Upload, Sparkles, Terminal, Brain } from 'lucide-react';
import MessageCard from '../Message/MessageCard';
import SequentialLoader from '../Loading/SequentialLoader';
import DatasetHealthPanel from '../Dataset/DatasetHealthPanel';

const SAMPLE_SUGGESTIONS = [
  'What are the total sales by region?',
  'Which product department has the highest revenue?',
  'Show average performance metrics by category.',
  'What is the distribution of sales across quarters?',
];

export default function ChatWorkspace({
  messages,
  onSendMessage,
  activeDataset,
  datasetDetails,
  isLoading,
  onOpenUploadModal,
  onOpenCleaning,
  onDismissBanner,
  bannerDismissed,
}) {
  const [question, setQuestion] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSendMessage(question.trim());
    setQuestion('');
  };

  return (
    <main role="main" className="flex-1 flex flex-col h-[calc(100vh-60px)] bg-transparent overflow-hidden relative z-10">
      {/* Messages / Hero Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-5xl mx-auto w-full relative z-10">
        {activeDataset && datasetDetails && (
          <DatasetHealthPanel
            datasetId={activeDataset}
            datasetDetails={datasetDetails}
            onOpenCleaning={onOpenCleaning}
            onDismissBanner={onDismissBanner}
            bannerDismissed={bannerDismissed}
          />
        )}

        {messages.length === 0 ? (
          /* Central Hero Panel Card - AI Analysis Chamber */
          <div className="h-full flex flex-col items-center justify-center my-auto py-8">
            <div className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-8 max-w-2xl w-full flex flex-col items-center text-center shadow-[var(--shadow-glass)] relative overflow-hidden animate-fade-in-up">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 opacity-30 animate-pulse" />
              
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white flex items-center justify-center shadow-[var(--shadow-glow-sm)] relative">
                  <Brain className="w-8 h-8 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] animate-ping opacity-75" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-display">
                    Ask questions about your dataset
                  </h1>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md leading-relaxed">
                    Query your tabular datasets using natural language. Fast, deterministic calculation with zero LLM math hallucination.
                  </p>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenUploadModal}
                    className="btn-primary text-xs font-semibold py-2.5 px-5 rounded-xl flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    <span>Upload Dataset</span>
                  </button>

                  <div className="inline-flex items-center space-x-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-4 py-2 rounded-xl text-xs md:text-sm text-[var(--text-secondary)]">
                    <FileSpreadsheet className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
                    <span className="text-[var(--text-muted)] font-medium">Active:</span>
                    <span className="font-semibold text-[var(--text-primary)] max-w-[160px] truncate font-mono-tight text-xs">
                      {activeDataset || 'None'}
                    </span>
                  </div>
                </div>

                {/* Suggested Questions Grid Cards */}
                <div className="mt-6 w-full">
                  <div className="flex items-center space-x-1.5 mb-3 text-left">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Suggested Questions
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SAMPLE_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestion(sug)}
                        className="block w-full text-left p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-elevated)] transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] group shadow-[var(--shadow-card)] animate-fade-in-up"
                        style={{ transitionDelay: `${idx * 80}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-xs md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] line-clamp-2 leading-relaxed">
                            {sug}
                          </p>
                          <ArrowRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--accent-primary)] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Trajectory - Floating in the Analysis Chamber */
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <MessageCard key={idx} message={msg} />
            ))}

            {/* Sequential Loader indicator */}
            {isLoading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <SequentialLoader />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modernized Bottom Chat Input Bar - Floating Command Interface */}
      <div className="p-4 bg-[var(--bg-base)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] shadow-[var(--shadow-glass)] shrink-0 z-20 relative">
        {/* Subtle glow line at top */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-elevated)] focus-within:border-[var(--accent-primary)] focus-within:ring-1 focus-within:ring-[var(--accent-primary)] transition-all shadow-[var(--shadow-card)] relative">
            {/* Sparkle indicator when focused */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <label htmlFor="chat-input" className="sr-only">
              Type your analysis question
            </label>
            <input
              id="chat-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                activeDataset
                  ? `Ask a question about ${activeDataset}...`
                  : 'Ask a question about your dataset...'
              }
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-sm bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              aria-label="Send message"
              className="btn-primary m-1.5 px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 shrink-0 relative overflow-hidden"
            >
              <span className="relative z-10 hidden sm:inline">Analyze</span>
              <Send className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-0 hover:opacity-20 transition-opacity pointer-events-none" />
            </button>
          </div>

          <div className="mt-2 text-center text-[11px] text-[var(--text-dim)] flex items-center justify-center space-x-2">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3 h-3" />
              <span>Deterministic AST Sandbox</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>Zero Hallucination</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Instant Insights</span>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}