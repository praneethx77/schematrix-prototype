import React from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Clock, 
  FileText, 
  Building2, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CitizenProfile, Scheme, DocumentItem } from '../types';
import { evaluateEligibility } from '../utils/eligibilityEngine';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  profile: CitizenProfile;
  documents: DocumentItem[];
  onClose: () => void;
  onApply: (scheme: Scheme) => void;
  onAskAISahayak: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  profile,
  documents,
  onClose,
  onApply,
  onAskAISahayak
}) => {
  if (!scheme) return null;

  const verifiedDocTitles = documents
    .filter((d) => d.verifiedStatus === 'verified')
    .map((d) => d.docType);

  const evaluation = evaluateEligibility(profile, scheme, verifiedDocTitles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
              {scheme.category}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {scheme.level === 'State' ? `State Govt (${scheme.stateSpecific})` : 'Central Govt'}
            </span>
            <span className="text-[11px] font-mono text-slate-400 ml-auto mr-8">
              Code: {scheme.code}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {scheme.title}
          </h2>
          {scheme.titleHindi && (
            <p className="text-sm text-slate-300 font-hindi mt-1">
              {scheme.titleHindi}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {scheme.ministry}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Eligibility Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            evaluation.isEligible
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : evaluation.matchScore >= 60
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-slate-50 border-slate-300 text-slate-800'
          }`}>
            {evaluation.isEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : evaluation.matchScore >= 60 ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold text-sm flex items-center gap-2">
                <span>Citizen Eligibility Assessment: {evaluation.matchScore}% Match</span>
                {evaluation.isEligible && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-extrabold tracking-wide">
                    Criteria Met (Preliminary)
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed">
                {evaluation.recommendationReason}
              </p>
            </div>
          </div>

          {/* Statutory Advisory Callout */}
          <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-950">
            <span className="text-amber-700 font-bold text-xs shrink-0 mt-0.5">⚠️</span>
            <p className="leading-relaxed">
              <strong>Statutory Notice:</strong> Schematrix provides preliminary advisory matching based on profile inputs. Official sanction, quotas, and cash transfers remain subject to field & statutory scrutiny by the respective nodal department. <em>Eligibility is never unconditionally guaranteed.</em>
            </p>
          </div>

          {/* Direct Benefits Highlight Card */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Direct Benefits & Financial Entitlement
            </h3>
            <p className="text-sm font-bold text-blue-950">
              {scheme.benefitHighlight}
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              {scheme.fullDescription}
            </p>
          </div>

          {/* Criteria Checklist Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personalized Eligibility Checklist for {profile.name}
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {evaluation.criteriaChecks.map((check, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="flex items-start gap-2.5">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {check.name}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Required: <strong className="text-slate-700">{check.requiredValue}</strong> • Your Profile: <strong className="text-slate-900">{check.citizenValue}</strong>
                      </span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    check.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {check.passed ? 'Satisfied' : 'Not Met'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents from Vault */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Documents (Pre-linked from Schematrix Vault)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.requiredDocuments.map((docName) => {
                const isReady = verifiedDocTitles.includes(docName as any);
                return (
                  <div
                    key={docName}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isReady
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${isReady ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="font-semibold">{docName}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isReady ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isReady ? 'Ready in Vault' : 'Needs Upload'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Facts */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-slate-400 text-[10px]">Processing Timeline</p>
                <p className="font-bold text-slate-800">~{scheme.processingDays} Working Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-slate-400 text-[10px]">Official Govt Portal</p>
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  Visit Portal <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onAskAISahayak(scheme)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Ask AI Sahayak about this Scheme</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(scheme);
              }}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Proceed with 1-Click Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
