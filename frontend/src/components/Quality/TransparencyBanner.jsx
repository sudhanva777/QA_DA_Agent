import React from 'react';
import { AlertTriangle, CheckCircle, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../ui';

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
      <div className="bg-success/10 border border-success/20 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <CheckCircle className="w-4.5 h-4.5 text-success" aria-hidden="true" />
          <div>
            <span className="text-sm font-semibold text-text-primary">Dataset is Clean</span>
            <span className="text-xs text-success ml-2 font-mono">
              Quality Score: {score}/100 · Ready for analysis
            </span>
          </div>
        </div>
        {onContinue && (
          <Button variant="ghost" size="sm" onClick={onContinue} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Continue
          </Button>
        )}
      </div>
    );
  }

  // Show warning banner for problematic datasets
  const isUrgent = status === 'Critical' || status === 'Needs Cleaning';
  const bannerClasses = isUrgent 
    ? 'bg-warning/10 border-warning/20' 
    : 'bg-warning/10 border-warning/20';
  const iconColor = isUrgent ? 'text-warning' : 'text-warning';
  const textColor = 'text-text-primary';
  const subtextColor = isUrgent ? 'text-warning' : 'text-warning';

  return (
    <div className={`border rounded-xl p-3.5 ${bannerClasses} shadow-sm`}>
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
          <Button variant="primary" size="sm" onClick={onAutoClean} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Auto Clean
          </Button>
        )}
        {onReviewIssues && (
          <Button variant="secondary" size="sm" onClick={onReviewIssues} leftIcon={<Wrench className="w-3.5 h-3.5" />}>
            Review Issues
          </Button>
        )}
        {onContinue && (
          <Button variant="ghost" size="sm" onClick={onContinue} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Continue Anyway
          </Button>
        )}
      </div>
    </div>
  );
}