import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight, 
  Building2, 
  Lock, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { CitizenProfile, Scheme, DocumentItem, ApplicationRecord } from '../types';

interface ApplicationModalProps {
  scheme: Scheme | null;
  profile: CitizenProfile;
  documents: DocumentItem[];
  onClose: () => void;
  onSubmitApplication: (newApp: ApplicationRecord) => void;
  onNavigateToTracking: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  scheme,
  profile,
  documents,
  onClose,
  onSubmitApplication,
  onNavigateToTracking
}) => {
  if (!scheme) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [aadhaarOtp, setAadhaarOtp] = useState('482910');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApplication, setCreatedApplication] = useState<ApplicationRecord | null>(null);

  // Filter documents required for this scheme
  const linkedDocs = documents.filter((doc) =>
    scheme.requiredDocuments.includes(doc.docType)
  );

  const handleAuthorizeAndSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const appId = `SCH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

      const newRecord: ApplicationRecord = {
        id: `app-${Date.now()}`,
        applicationId: appId,
        schemeId: scheme.id,
        schemeTitle: scheme.title,
        schemeCategory: scheme.category,
        appliedDate: formattedDate,
        status: 'Under Scrutiny',
        currentStage: 2,
        totalStages: 5,
        lastUpdated: 'Just now',
        attachedDocuments: linkedDocs.map((d) => d.title),
        dbtAmount: scheme.financialAssistanceAmount,
        timeline: [
          {
            title: '1-Click Application Submitted',
            date: formattedDate,
            completed: true,
            officerDesignation: 'Schematrix Unified Gateway Engine',
            remarks: 'Citizen profile & DigiLocker e-credentials validated.'
          },
          {
            title: 'Automated Eligibility & Scrutiny',
            date: formattedDate,
            completed: false,
            current: true,
            officerDesignation: 'Nodal Verification Officer',
            remarks: 'Checking DBT bank mandate with PFMS server.'
          },
          {
            title: 'Document & Identity Clearance',
            date: 'Pending',
            completed: false,
            officerDesignation: 'District Department Desk'
          },
          {
            title: 'Sanction Order Generation',
            date: 'Pending',
            completed: false,
            officerDesignation: 'Competent Sanctioning Authority'
          },
          {
            title: 'Direct Benefit Transfer (DBT) Disbursal',
            date: 'Pending',
            completed: false,
            officerDesignation: 'National Automated Clearing House (NACH / RBI)'
          }
        ]
      };

      onSubmitApplication(newRecord);
      setCreatedApplication(newRecord);
      setIsSubmitting(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              1-Click Smart Application
            </span>
            <span className="text-xs text-slate-400">Step {step} of 4</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {scheme.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            No repeated forms. All details & documents mapped from your central citizen vault.
          </p>

          {/* Stepper Progress bar */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step >= s ? 'bg-emerald-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm">
          {/* Step 1: Profile & Bank Mandate */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Verified Citizen Profile Pre-Filled: </span>
                  Information retrieved from your Central UIDAI & State Citizen Directory record.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant Name</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.name}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Aadhaar Status</span>
                  <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Linked & e-KYC Verified
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupation & Category</span>
                  <span className="font-semibold text-slate-800">{profile.occupation} • {profile.category}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Residence & State</span>
                  <span className="font-semibold text-slate-800">{profile.district}, {profile.state}</span>
                </div>
              </div>

              {/* Direct Benefit Transfer (DBT) Bank Account */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Target DBT Bank Account for Funds
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    PFMS Validated
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{profile.bankName}</span>
                  <span className="font-mono font-bold text-slate-800">{profile.accountNumberMasked}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  IFSC: {profile.ifscCode} • Aadhaar Seeding: Active
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Auto-Attached Documents */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zero Paperwork Guarantee: </span>
                  Schematrix automatically binds cryptographic digital copies of your documents from DigiLocker.
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Attached Documents for this Scheme
                </h3>
                {linkedDocs.length === 0 ? (
                  <p className="text-xs text-slate-500">No special documents required beyond Aadhaar.</p>
                ) : (
                  linkedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{doc.title}</p>
                          <p className="text-[11px] text-slate-400">{doc.issuingAuthority}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {doc.docNumber}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">DigiLocker Certified</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 3: Self-Declaration & e-Sign OTP */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Citizen Self-Declaration
                </h3>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I solemnly declare that all personal credentials, landholding details, and income records submitted above are genuine. I authorize the department to disburse eligible subsidies directly to my Aadhaar-seeded bank account via DBT.
                  </span>
                </label>
              </div>

              {/* Aadhaar OTP Simulation */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-blue-600" />
                    UIDAI Aadhaar OTP Consent
                  </span>
                  <span className="text-[11px] text-blue-700">Sent to {profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="font-mono text-center tracking-widest text-base font-bold bg-white border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
                  />
                  <span className="text-xs text-emerald-700 font-medium">
                    ✓ Simulated Aadhaar OTP Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Secured with 256-bit government grade cryptographic timestamp.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Submission Success */}
          {step === 4 && createdApplication && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Application Successfully Registered!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your application file has been routed to the respective district nodal scrutiny desk.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-2 text-xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Application Number:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {createdApplication.applicationId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Scheme Name:</span>
                  <span className="font-semibold text-slate-800">{scheme.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-800">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">DBT Bank Account:</span>
                  <span className="font-semibold text-slate-800">{profile.accountNumberMasked}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                    Under Scrutiny (Stage 2/5)
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SMS notification sent to {profile.phone}. You can track stages 24x7.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step < 4 ? (
            <>
              <button
                onClick={() => {
                  if (step > 1) setStep((step - 1) as any);
                  else onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-2">
                {step < 3 ? (
                  <button
                    onClick={() => setStep((step + 1) as any)}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <span>Next: {step === 1 ? 'Verify Documents' : 'Self-Declaration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleAuthorizeAndSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting with DigiLocker Seal...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authenticate & Submit 1-Click</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTracking();
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <span>Track Application in Live Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
