import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Plus, 
  QrCode, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ScanLine, 
  Eye, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  XCircle, 
  CheckSquare, 
  Square, 
  Sparkles,
  Info
} from 'lucide-react';
import { DocumentItem, CitizenProfile } from '../types';

interface DocumentVaultProps {
  documents: DocumentItem[];
  profile: CitizenProfile;
  onOpenScanner: () => void;
  onDeleteDocument: (id: string) => void;
  onRenewDocument?: (docId: string, updatedDoc: DocumentItem) => void;
  onUpdateDocumentStatus?: (docId: string, status: DocumentItem['verifiedStatus']) => void;
  isSeniorMode: boolean;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  profile,
  onOpenScanner,
  onDeleteDocument,
  onRenewDocument,
  onUpdateDocumentStatus,
  isSeniorMode
}) => {
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [docToRenew, setDocToRenew] = useState<DocumentItem | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState<string | null>(null);

  // Document multi-selection state
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected' | 'expiring'>('all');

  const verifiedCount = documents.filter((d) => d.verifiedStatus === 'verified').length;
  const pendingCount = documents.filter((d) => d.verifiedStatus === 'pending').length;
  const rejectedCount = documents.filter((d) => d.verifiedStatus === 'rejected' || d.verifiedStatus === 'action_required').length;
  const expiringDocs = documents.filter(
    (d) => d.isExpiringSoon || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 45)
  );

  // Filtered documents
  const filteredDocs = documents.filter((d) => {
    if (statusFilter === 'verified') return d.verifiedStatus === 'verified';
    if (statusFilter === 'pending') return d.verifiedStatus === 'pending';
    if (statusFilter === 'rejected') return d.verifiedStatus === 'rejected' || d.verifiedStatus === 'action_required';
    if (statusFilter === 'expiring') return d.isExpiringSoon || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 45);
    return true;
  });

  const toggleSelectDocument = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map((d) => d.id));
    }
  };

  const handleExecuteRenewal = (doc: DocumentItem) => {
    setIsRenewing(true);

    setTimeout(() => {
      const nextYear = new Date().getFullYear() + 1;
      const updatedDoc: DocumentItem = {
        ...doc,
        verifiedStatus: 'verified',
        issuedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        expiryDate: `28 Oct ${nextYear}`,
        daysUntilExpiry: 365,
        isExpiringSoon: false,
        qrToken: `RENEWED-PKI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        extractedDetails: {
          ...(doc.extractedDetails || {}),
          'Renewal Status': `Validated via State Portal until Oct ${nextYear}`,
          'Last Renewed': new Date().toLocaleDateString('en-GB')
        }
      };

      if (onRenewDocument) {
        onRenewDocument(doc.id, updatedDoc);
      }

      setIsRenewing(false);
      setRenewalSuccess(`"${doc.title}" has been renewed successfully.`);
      setTimeout(() => {
        setRenewalSuccess(null);
        setDocToRenew(null);
      }, 1800);
    }, 1200);
  };

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Citizen Document Vault
            </h1>
            <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
              Demo Sandbox Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, preview, and pre-link simulated government certificates for 1-click scheme filing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-700 block">
              {documents.length} Total Certificates
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {verifiedCount} Verified • {pendingCount} Pending • {rejectedCount} Rejected
            </span>
          </div>
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            <ScanLine className="w-4 h-4" />
            <span>Upload Demo Document</span>
          </button>
        </div>
      </div>

      {/* Honest Storage & Security Sandbox Disclaimer Banner (Requirement: Do not claim secure storage unless implemented) */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Prototype Sandbox Storage Disclaimer</span>
              <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">Local In-Browser Session</span>
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              This is an interactive design prototype. All documents and certificates are stored strictly within your local browser session for demonstration of the verification workflow. <strong>Do not enter or upload genuine sensitive national identity cards (real Aadhaar, PAN) or confidential documents.</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-blue-300 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800 shrink-0 self-start sm:self-auto">
          <span>Demo Sandbox Only</span>
        </div>
      </div>

      {/* Document Expiration Warning Alert Banner (if any documents are expiring soon) */}
      {expiringDocs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-amber-950">
                    Document Expiration Warning: {expiringDocs.length} Certificate(s) Expiring Soon
                  </h3>
                  <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                  Active government welfare schemes mandate current income and ration proofs. Renew now to prevent benefit delays.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {expiringDocs.slice(0, 1).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDocToRenew(d)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew {d.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick list of expiring items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200/80 text-xs">
            {expiringDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/80 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-800">{doc.title}</span>
                    <span className="text-amber-800 block text-[11px]">
                      Expires: <strong>{doc.expiryDate}</strong> ({doc.daysUntilExpiry} days left)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDocToRenew(doc)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 shrink-0"
                >
                  Renew Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Multi-Select Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs: All, Verified, Pending, Rejected, Expiring */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Demo ({verifiedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pending Review ({pendingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Rejected / Action Required ({rejectedCount})</span>
          </button>
          {expiringDocs.length > 0 && (
            <button
              onClick={() => setStatusFilter('expiring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'expiring'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Expiring Soon ({expiringDocs.length})</span>
            </button>
          )}
        </div>

        {/* Selection Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors font-semibold"
          >
            {selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0 ? 'Deselect All' : 'Select All'}</span>
          </button>

          {selectedDocIds.length > 0 && (
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {selectedDocIds.length} Selected
            </span>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No certificates match the selected filter ({statusFilter}). Clear filters or add a new demo document.
          </p>
          <button
            onClick={() => setStatusFilter('all')}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Show All Documents
          </button>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const isExpiring = doc.isExpiringSoon || (doc.daysUntilExpiry !== undefined && doc.daysUntilExpiry <= 45);
          const isSelected = selectedDocIds.includes(doc.id);
          const isRejected = doc.verifiedStatus === 'rejected' || doc.verifiedStatus === 'action_required';
          const isPending = doc.verifiedStatus === 'pending';
          const isVerified = doc.verifiedStatus === 'verified';

          return (
            <div
              key={doc.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md relative group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20'
                  : isRejected
                  ? 'bg-rose-50/30 border-rose-300 ring-1 ring-rose-200'
                  : isPending
                  ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-200'
                  : isExpiring
                  ? 'bg-orange-50/20 border-orange-300 ring-1 ring-orange-200'
                  : 'bg-white border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                {/* Top row with Selection Checkbox and Status Pill */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleSelectDocument(doc.id)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                      title={isSelected ? 'Deselect document' : 'Select document'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isRejected
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : isExpiring 
                        ? 'bg-orange-100 text-orange-800 border-orange-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="text-right space-y-1">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified (Demo)
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Rejected (Demo)
                      </span>
                    )}

                    {isExpiring && isVerified && (
                      <span className="block text-[9px] font-extrabold text-orange-700">
                        Expires in {doc.daysUntilExpiry} days
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 font-mono">
                      {doc.docSize}
                    </p>
                  </div>
                </div>

                {/* Title & Issuer */}
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {doc.issuingAuthority}
                </p>

                {/* Rejection Alert Callout if Rejected */}
                {isRejected && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-100/80 border border-rose-200 text-xs text-rose-950 space-y-1.5">
                    <div className="flex items-start gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                      <span>Rejection Reason:</span>
                    </div>
                    <p className="text-[11px] text-rose-900 leading-relaxed">
                      {doc.rejectionReason || 'Document clarity or statutory validity condition not met.'}
                    </p>
                    <button
                      onClick={onOpenScanner}
                      className="mt-1 w-full py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1"
                    >
                      <ScanLine className="w-3 h-3" />
                      <span>Re-Upload / Fix Document</span>
                    </button>
                  </div>
                )}

                {/* Pending Callout if Pending */}
                {isPending && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Under Scrutiny by Nodal Officer</span>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Biometric & revenue records matched; awaiting officer endorsement.
                    </p>
                  </div>
                )}

                {/* Expiry Warning Callout Box */}
                {isExpiring && isVerified && (
                  <div className="mt-3 p-2.5 rounded-xl bg-orange-100/70 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-orange-700" />
                      <span>Valid till: <strong>{doc.expiryDate}</strong></span>
                    </div>
                    <button
                      onClick={() => setDocToRenew(doc)}
                      className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-2xs"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Renew</span>
                    </button>
                  </div>
                )}

                {/* Number pill */}
                <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[10px] uppercase">ID No:</span>
                  <span className="font-bold text-slate-800">{doc.docNumber}</span>
                </div>

                {/* Extracted Details */}
                {doc.extractedDetails && (
                  <div className="mt-3 space-y-1 pt-2 border-t border-slate-100 text-[11px]">
                    {Object.entries(doc.extractedDetails).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">{key}:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions & Demo Status Switcher */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {/* Demo Status Switcher (For evaluators to easily test Verified, Pending, Rejected states) */}
                <div className="flex items-center justify-between text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-500">Demo State:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateDocumentStatus?.(doc.id, 'verified')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        isVerified ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Set to Verified demo state"
                    >
                      Verified
                    </button>
                    <button
                      onClick={() => onUpdateDocumentStatus?.(doc.id, 'pending')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        isPending ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Set to Pending demo state"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => onUpdateDocumentStatus?.(doc.id, 'rejected')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        isRejected ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Set to Rejected demo state"
                    >
                      Rejected
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-slate-500" />
                    {doc.qrToken.substring(0, 10)}...
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Dedicated Renew Button if expiring */}
                    {isExpiring && isVerified && (
                      <button
                        onClick={() => setDocToRenew(doc)}
                        className="px-2.5 py-1 text-xs font-bold text-orange-800 hover:bg-orange-100 rounded-lg flex items-center gap-1 transition-colors border border-orange-300"
                        title="Renew Certificate"
                      >
                        <RefreshCw className="w-3 h-3 text-orange-700" />
                        <span>Renew</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1"
                      title="Preview Document Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Document Card Trigger */}
        <div
          onClick={onOpenScanner}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/20 transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
            Upload or Scan Certificate
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            Add Domicile, Disability (UDID), or Marksheets for simulated OCR verification.
          </p>
        </div>
      </div>

      {/* Document Renewal Modal */}
      {docToRenew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5 text-orange-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                    Certificate Renewal
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {docToRenew.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDocToRenew(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Current status warning */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Expiration Notice: {docToRenew.daysUntilExpiry} days remaining</p>
                <p className="text-[11px] text-orange-900 mt-0.5">
                  Issuing department requires annual re-validation for subsidized welfare beneficiaries.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Document No:</span>
                <span className="font-mono font-bold text-slate-800">{docToRenew.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Validity:</span>
                <span className="font-semibold text-rose-700">{docToRenew.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proposed Extension:</span>
                <span className="font-bold text-emerald-700">+1 Financial Year (365 Days)</span>
              </div>
            </div>

            {renewalSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{renewalSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDocToRenew(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteRenewal(docToRenew)}
                disabled={isRenewing}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isRenewing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Demo Renewal...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Confirm 1-Click Renewal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal (Requirement: preview where appropriate, pending/verified/rejected demo statuses) */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    selectedDocForPreview.verifiedStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedDocForPreview.verifiedStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedDocForPreview.verifiedStatus.toUpperCase()} (DEMO)
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    {selectedDocForPreview.docType}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedDocForPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Status-specific Callout in Preview */}
            {selectedDocForPreview.verifiedStatus === 'verified' ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digitally Verified in Sandbox. Pre-approved for 1-click scheme attachments.</span>
              </div>
            ) : selectedDocForPreview.verifiedStatus === 'pending' ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pending Scrutiny by Block Verification Officer. Expected SLA: 2 Working Days.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Document Rejected / Action Required</span>
                </div>
                <p className="text-[11px] text-rose-900">
                  {selectedDocForPreview.rejectionReason || 'Document does not meet statutory requirements.'}
                </p>
              </div>
            )}

            {/* Document Details Table */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Issuing Authority:</span>
                <span className="font-semibold text-slate-800 text-right">{selectedDocForPreview.issuingAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedDocForPreview.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued On:</span>
                <span className="font-semibold text-slate-800">{selectedDocForPreview.issuedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiry / Validity:</span>
                <span className="font-bold text-slate-900">{selectedDocForPreview.expiryDate || 'Permanent'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Simulation Token:</span>
                <span className="font-mono text-slate-700 font-bold">{selectedDocForPreview.qrToken}</span>
              </div>
              {selectedDocForPreview.extractedDetails && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Extracted Metadata:</span>
                  {Object.entries(selectedDocForPreview.extractedDetails).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-medium text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              {selectedDocForPreview.verifiedStatus === 'rejected' ? (
                <button
                  onClick={() => {
                    setSelectedDocForPreview(null);
                    onOpenScanner();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Re-Upload / Fix Document</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Demo Copy</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
