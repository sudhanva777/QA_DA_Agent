import React from 'react';
import { AlertTriangle, CheckCircle, Sparkles, Wrench, ArrowRight } from 'lucide-react';

export default function TransparencyBanner({
  qualityScore,
  _validationSummary,
  onAutoClean,
  onReviewIssues,
  onContinue,
}) {
  if (!qualityScore) return null;

  const { score, status, total_issues } = qualityScore;

  // Don't show banner for clean datasets
  if (status === 'Excellent' || status === 'Good') {
    return (
      <div className="bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <CheckCircle className="w-4.5 h-4.5 text-accent-emerald" aria-hidden="true" />
          <div>
            <span className="text-sm font-semibold text-text-primary">Dataset is Clean</span>
            <span className="text-xs text-accent-emerald ml-2 font-mono">
              Quality Score: {score}/100 · Ready for analysis
            </span>
          </div>
        </div>
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="text-xs font-medium text-accent-emerald hover:text-emerald-300 flex items-center space-x-1 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  // Show warning banner for problematic datasets
  const isUrgent = status === 'Critical' || status === 'Needs Cleaning';
  const bannerBg = isUrgent ? 'bg-orange-500/10 border-orange-500/30' : 'bg-accent-amber/10 border-accent-amber/30';
  const iconColor = isUrgent ? 'text-orange-400' : 'text-accent-amber';
  const textColor = 'text-text-primary';
  const subtextColor = isUrgent ? 'text-orange-300' : 'text-amber-300';

  return (
    <div className={`border rounded-xl p-3.5 ${bannerBg} shadow-xs`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className={`w-4.5 h-4.5 ${iconColor} mt-0.5 shrink-0`} aria-hidden="true" />
          <div>
            <span className={`text-sm font-semibold ${textColor}`}>
              Dataset {status}
            </span>
            <p className={`text-xs ${subtextColor} mt-0.5 font-mono`}>
              Quality Score: {score}/100 · {total_issues} issue{total_issues !== 1 ? 's' : ''} detected
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-3">
        {onAutoClean && (
          <button
            type="button"
            onClick={onAutoClean}
            className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            Auto Clean
          </button>
        )}
        {onReviewIssues && (
          <button
            type="button"
            onClick={onReviewIssues}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-[#12121A] hover:bg-[#181824] text-text-primary border border-white/10 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <Wrench className="w-3.5 h-3.5 mr-1.5 text-text-muted" aria-hidden="true" />
            Review Issues
          </button>
        )}
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors focus:outline-none"
          >
            Continue Anyway
            <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
