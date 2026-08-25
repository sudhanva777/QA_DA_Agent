import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lightbulb,
  Columns,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import Tabs from '../Common/Tabs';
import QualityHeader from '../Quality/QualityHeader';
import TransparencyBanner from '../Quality/TransparencyBanner';
import InsightsPanel from '../Insights/InsightsPanel';
import DataProfileView from '../Profile/DataProfileView';
import api from '../../services/api';

export default function DatasetHealthPanel({
  datasetId,
  datasetDetails,
  onOpenCleaning,
  onDismissBanner,
  bannerDismissed,
}) {
  const [activeTab, setActiveTab] = useState('health');
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const qualityScore = datasetDetails?.quality_score;
  const validation = datasetDetails?.validation;
  const insights = datasetDetails?.insights || [];
  const validationIssues = validation?.issues || [];

  useEffect(() => {
    setProfile(null);
    setActiveTab('health');
  }, [datasetId]);

  useEffect(() => {
    if (activeTab !== 'profile' || profile || !datasetId) return;

    let cancelled = false;
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const data = await api.getProfile(datasetId);
        if (!cancelled) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    };
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [activeTab, datasetId, profile]);

  if (!datasetId || !datasetDetails) return null;

  const tabs = [
    { id: 'health', label: 'Health', icon: Shield },
    { id: 'insights', label: 'Insights', icon: Lightbulb, badge: insights.length || undefined },
    { id: 'profile', label: 'Profile', icon: Columns },
    {
      id: 'issues',
      label: 'Issues',
      icon: AlertTriangle,
      badge: validationIssues.length || undefined,
    },
  ];

  return (
    <div className="bg-[#0E0E16] border border-white/10 rounded-2xl shadow-dark-card overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-white/[0.08] bg-[#12121A] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold text-text-primary">Dataset Intelligence</h2>
          {qualityScore && (
            <span className="text-xs text-text-muted font-mono">
              {qualityScore.score}/100 · {qualityScore.status}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="px-4 pt-3">
            {!bannerDismissed && (
              <TransparencyBanner
                qualityScore={qualityScore}
                validationSummary={validation?.summary}
                onAutoClean={onOpenCleaning}
                onReviewIssues={() => setActiveTab('issues')}
                onContinue={onDismissBanner}
              />
            )}
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />

          <div className="p-4">
            {activeTab === 'health' && <QualityHeader qualityScore={qualityScore} />}

            {activeTab === 'insights' && (
              insights.length > 0 ? (
                <InsightsPanel insights={insights} />
              ) : (
                <p className="text-sm text-text-muted italic">No insights available yet.</p>
              )
            )}

            {activeTab === 'profile' && (
              isLoadingProfile ? (
                <div className="flex items-center justify-center py-8 text-text-secondary text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-400" aria-hidden="true" />
                  Loading data profile...
                </div>
              ) : (
                <DataProfileView profile={profile} />
              )
            )}

            {activeTab === 'issues' && (
              validationIssues.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {validationIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2.5 p-3 rounded-xl border border-white/[0.06] bg-[#12121A] text-xs"
                    >
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          issue.severity === 'CRITICAL' || issue.severity === 'HIGH'
                            ? 'text-accent-rose'
                            : 'text-accent-amber'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <span className="font-semibold text-text-primary">{issue.type}</span>
                        {issue.column && (
                          <span className="text-text-muted ml-1 font-mono">({issue.column})</span>
                        )}
                        <p className="text-text-secondary mt-0.5">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">No validation issues detected.</p>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
