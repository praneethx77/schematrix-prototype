import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  MessageSquareWarning, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Landmark,
  FileText,
  Printer,
  Calendar,
  Info
} from 'lucide-react';
import { ApplicationRecord, GrievanceTicket, CitizenProfile } from '../types';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  profile: CitizenProfile;
  onOpenGrievance: (app: ApplicationRecord) => void;
  isSeniorMode: boolean;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  profile,
  onOpenGrievance,
  isSeniorMode
}) => {
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord>(applications[0] || null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'disbursed' | 'in_progress' | 'submitted'>('all');

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'disbursed') return app.status === 'Disbursed';
    if (statusFilter === 'submitted') return app.status === 'Submitted';
    if (statusFilter === 'in_progress') return app.status !== 'Disbursed' && app.status !== 'Submitted';
    return true;
  });

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <Clock className="w-10 h-10 text-slate-400 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">No Applications Submitted Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Explore the Schemes directory and submit your first 1-click application. All milestone steps will update here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Tracker Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Application Tracker
            </h1>
            <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
              Demo Prototype Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time inter-departmental visibility. Track reference IDs, file movements, officer scrutiny, and DBT credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {applications.filter(a => a.status === 'Disbursed').length} Disbursed via DBT
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            {applications.filter(a => a.status !== 'Disbursed').length} In Progress
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setStatusFilter('disbursed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
            statusFilter === 'disbursed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Disbursed via DBT ({applications.filter(a => a.status === 'Disbursed').length})</span>
        </button>
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
            statusFilter === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Under Scrutiny ({applications.filter(a => a.status !== 'Disbursed' && a.status !== 'Submitted').length})</span>
        </button>
        <button
          onClick={() => setStatusFilter('submitted')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
            statusFilter === 'submitted'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <span>Submitted ({applications.filter(a => a.status === 'Submitted').length})</span>
        </button>
      </div>

      {/* Main Layout: Left List, Right Detailed Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Application Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Applications ({filteredApps.length})
            </h2>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              All Records Demo Labeled
            </span>
          </div>

          {filteredApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      Ref: {app.applicationId}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                      Demo Record
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    app.status === 'Disbursed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : app.status === 'Submitted'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {app.status === 'Disbursed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {app.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {app.schemeTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Applied: {app.appliedDate} • {app.schemeCategory}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">
                    Stage {app.currentStage} of {app.totalStages}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Updated: {app.lastUpdated}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Milestones & Timeline */}
        {selectedApp && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    Ref ID: {selectedApp.applicationId}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    Demo Record
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedApp.schemeTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Applied: <strong className="text-slate-700">{selectedApp.appliedDate}</strong></span>
                  <span>•</span>
                  <span>Last Updated: <strong className="text-slate-700">{selectedApp.lastUpdated}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                  title="Print official acknowledgment slip"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Acknowledgment Slip</span>
                </button>
                <button
                  onClick={() => onOpenGrievance(selectedApp)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                  <span>File Grievance</span>
                </button>
              </div>
            </div>

            {/* DBT Credit Highlight Banner if Disbursed */}
            {selectedApp.status === 'Disbursed' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Direct Benefit Transfer (DBT) Credited
                  </span>
                  <span className="text-[11px] font-mono bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    Success
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-emerald-700 block text-[10px]">Amount Disbursed:</span>
                    <span className="font-extrabold text-base text-emerald-950">
                      ₹{selectedApp.dbtAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[10px]">Target Account:</span>
                    <span className="font-semibold text-slate-800">
                      {profile.bankName} ({profile.accountNumberMasked})
                    </span>
                  </div>
                  <div className="col-span-2 text-[11px] font-mono text-emerald-800 pt-1 border-t border-emerald-200">
                    RBI UTR Reference: {selectedApp.dbtReferenceId || 'DBT/RBI/2026/8892100'}
                  </div>
                </div>
              </div>
            )}

            {/* Milestone Steps Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status Timeline ({selectedApp.currentStage} of {selectedApp.totalStages} Stages Completed)
                </h4>
                <span className="text-[11px] font-mono text-slate-500">
                  Last Step Updated: {selectedApp.lastUpdated}
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {selectedApp.timeline.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={idx} className="relative group">
                      {/* Node Bullet */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs font-bold ${
                            isDone ? 'text-slate-900' : isCurrent ? 'text-blue-700' : 'text-slate-500'
                          }`}>
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {step.date}
                          </span>
                        </div>

                        {step.officerDesignation && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {step.officerDesignation}
                          </p>
                        )}

                        {step.remarks && (
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium mt-1">
                            {step.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Documents in Application */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attached Digital Certificates from Vault
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedApp.attachedDocuments.map((docTitle) => (
                  <span
                    key={docTitle}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    {docTitle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {showReceiptModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                  SCHEMATRIX CITIZEN GATEWAY
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                  DEMO RECEIPT
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Official E-Acknowledgment Slip
              </h3>
              <p className="text-xs font-mono text-slate-600">
                Ref ID: {selectedApp.applicationId}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Beneficiary Name:</span>
                <span className="font-bold text-slate-900">{profile.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Scheme Name:</span>
                <span className="font-bold text-slate-900 text-right">{selectedApp.schemeTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-semibold text-slate-800">{selectedApp.appliedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Last Status Update:</span>
                <span className="font-semibold text-slate-800">{selectedApp.lastUpdated}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">PFMS / DBT Target Bank:</span>
                <span className="font-mono text-slate-900">{profile.bankName} ({profile.accountNumberMasked})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Milestone:</span>
                <span className="font-bold text-blue-700">{selectedApp.status}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-[10px] text-slate-500 space-y-1">
              <p className="font-mono font-bold text-slate-700">DEMO DIGITAL SEAL: SEC-GOV-SCHEMATRIX-{selectedApp.applicationId}</p>
              <p>Simulated prototype acknowledgment. Generated for demonstrative verification purposes.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
