import React, { useState, useRef, useEffect } from 'react';
import { Send, FileSpreadsheet, Database, ArrowRight, Upload, Sparkles, Terminal, Brain } from 'lucide-react';
import MessageCard from '../Message/MessageCard';
import SequentialLoader from '../Loading/SequentialLoader';
import DatasetHealthPanel from '../Dataset/DatasetHealthPanel';
import { Button } from '../ui';

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
    <main role="main" className="flex-1 flex flex-col h-[calc(100vh-56px)] bg-transparent overflow-hidden relative z-10">
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
            <div className="card-elevated max-w-2xl w-full flex flex-col items-center text-center shadow-lg relative overflow-hidden animate-fade-in-up">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-30 animate-pulse" />
              
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center shadow-lg relative">
                  <Brain className="w-8 h-8 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary-hover animate-ping opacity-75" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                    Ask questions about your dataset
                  </h1>
                  <p className="text-sm md:text-base text-text-secondary max-w-md leading-relaxed">
                    Query your tabular datasets using natural language. Fast, deterministic calculation with zero LLM math hallucination.
                  </p>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={onOpenUploadModal}
                    leftIcon={<Upload className="w-4 h-4" />}
                    className="text-xs font-semibold py-2.5 px-5 rounded-xl"
                  >
                    Upload Dataset
                  </Button>

                  <div className="inline-flex items-center space-x-2 card px-4 py-2 rounded-xl text-xs md:text-sm text-text-secondary">
                    <FileSpreadsheet className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-text-muted font-medium">Active:</span>
                    <span className="font-semibold text-text-primary max-w-[160px] truncate font-mono-tight text-xs">
                      {activeDataset || 'None'}
                    </span>
                  </div>
                </div>

                {/* Suggested Questions Grid Cards */}
                <div className="mt-6 w-full">
                  <div className="flex items-center space-x-1.5 mb-3 text-left">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Suggested Questions
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SAMPLE_SUGGESTIONS.map((sug, idx) => (
                      <Button
                        key={idx}
                        type="button"
                        variant="ghost"
                        className="w-full text-left p-4 rounded-xl card hover:border-primary/40 hover:bg-surface-secondary transition-all duration-150 ease-in-out group shadow-sm animate-fade-in-up"
                        style={{ transitionDelay: `${idx * 80}ms` }}
                        onClick={() => setQuestion(sug)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-xs md:text-sm text-text-secondary group-hover:text-text-primary line-clamp-2 leading-relaxed">
                            {sug}
                          </p>
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </div>
                      </Button>
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
      <div className="p-4 bg-white/95 backdrop-blur-xl border-t border-border shadow-sm shrink-0 z-20 relative">
        {/* Subtle glow line at top */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-surface-secondary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-sm relative">
            {/* Sparkle indicator when focused */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
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
              className="flex-1 px-4 py-3 text-sm bg-transparent border-none focus:outline-none text-text-primary placeholder-text-muted disabled:opacity-50"
            />

            <Button
              type="submit"
              disabled={!question.trim() || isLoading}
              aria-label="Send message"
              variant="primary"
              size="sm"
              className="m-1.5 px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 shrink-0 relative overflow-hidden"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Analyze</span>
            </Button>
          </div>

          <div className="mt-2 text-center text-[11px] text-text-muted flex items-center justify-center space-x-2">
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