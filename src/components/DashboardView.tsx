import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Landmark, 
  HeartHandshake, 
  GraduationCap, 
  Home, 
  Briefcase, 
  MapPin,
  ShieldCheck, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Mic,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { 
  CitizenProfile, 
  Scheme, 
  DocumentItem, 
  ApplicationRecord 
} from '../types';
import { evaluateEligibility } from '../utils/eligibilityEngine';

interface DashboardViewProps {
  profile: CitizenProfile;
  schemes: Scheme[];
  documents: DocumentItem[];
  applications: ApplicationRecord[];
  onNavigateTab: (tab: 'dashboard' | 'schemes' | 'documents' | 'tracking' | 'centers' | 'ai-assistant') => void;
  onSelectScheme: (scheme: Scheme) => void;
  onApplyScheme: (scheme: Scheme) => void;
  onOpenScanner: () => void;
  onOpenAISahayak: () => void;
  onOpenProfileEditor: () => void;
  isSeniorMode: boolean;
  selectedLanguage?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  schemes,
  documents,
  applications,
  onNavigateTab,
  onSelectScheme,
  onApplyScheme,
  onOpenAISahayak,
  onOpenProfileEditor,
  isSeniorMode,
  selectedLanguage = 'English'
}) => {
  const verifiedDocTitles = documents
    .filter((d) => d.verifiedStatus === 'verified')
    .map((d) => d.docType);

  // Evaluate schemes for current citizen
  const evaluatedSchemes = schemes.map((scheme) => {
    const evaluation = evaluateEligibility(profile, scheme, verifiedDocTitles);
    return { scheme, evaluation };
  });

  const eligibleSchemes = evaluatedSchemes.filter((item) => item.evaluation.isEligible);
  const potentialSchemes = evaluatedSchemes.filter((item) => !item.evaluation.isEligible && item.evaluation.matchScore >= 60);

  // Calculate potential financial assistance unlocked
  const totalAssistanceUnlocked = eligibleSchemes.reduce((acc, curr) => {
    return acc + (curr.scheme.financialAssistanceAmount || 0);
  }, 0);

  const categories = [
    { id: 'Agriculture', title: 'Agriculture & Kisan', icon: Landmark, color: 'emerald' },
    { id: 'Healthcare', title: 'Healthcare & PM-JAY', icon: HeartHandshake, color: 'rose' },
    { id: 'Education', title: 'Education & Scholarships', icon: GraduationCap, color: 'blue' },
    { id: 'Housing', title: 'Housing (PMAY)', icon: Home, color: 'amber' },
    { id: 'Financial & MSME', title: 'Business & Mudra Loans', icon: Briefcase, color: 'indigo' },
    { id: 'Social Welfare', title: 'Social Security & Pension', icon: ShieldCheck, color: 'purple' }
  ];

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Direct Benefit Transfer (DBT) Ready • DigiLocker Linked
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Namaste, <span className="text-blue-300">{profile.name}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              SCHEMATRIX unified portal matched your profile as a <strong className="text-white">{profile.occupation}</strong> in <strong className="text-white">{profile.state}</strong> with government welfare initiatives. No multiple logins or redundant document uploads required.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aadhaar e-KYC: <strong className="text-emerald-300">Verified</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bank DBT: <strong className="text-emerald-300">{profile.bankName}</strong></span>
              </div>
              <button 
                onClick={onOpenProfileEditor}
                className="text-blue-300 hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                Change Profile Attributes
              </button>
            </div>
          </div>

          {/* Quick AI Sahayak Prompt Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/15 w-full lg:w-80 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 animate-bounce" />
                AI Sahayak Assistant
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-200 mb-4">
              Ask in your regional language or voice. "Am I eligible for loans or crop relief?"
            </p>
            <button
              onClick={onOpenAISahayak}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              <Mic className="w-4 h-4" />
              <span>Voice & AI Guidance Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Senior Mode Quick Large Banner if enabled */}
      {isSeniorMode && (
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xl">
              👴
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-950">Senior & Rural Citizen Mode is Active</h2>
              <p className="text-xs text-amber-900">Larger fonts, simplified instructions, and 1-click voice reading are enabled for your convenience.</p>
            </div>
          </div>
          <button 
            onClick={onOpenAISahayak}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm"
          >
            बोलकर पूछें (Ask Voice)
          </button>
        </div>
      )}

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigateTab('schemes')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Eligible Schemes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {eligibleSchemes.length}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            100% profile matched
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateTab('schemes')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Financial Coverage</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            ₹{totalAssistanceUnlocked.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grants, insurance & credit unlocked
          </p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigateTab('documents')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">DigiLocker Vault</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {documents.filter(d => d.verifiedStatus === 'verified').length} / {documents.length}
          </div>
          <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            Tamper-proof verified docs
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateTab('tracking')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Applications</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {applications.length}
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
            Real-time pipeline tracking
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Statutory Disclaimer - Never Guarantee Eligibility (Requirement: Never guarantee eligibility) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 shadow-2xs">
        <span className="text-amber-700 font-bold text-sm shrink-0 mt-0.5">⚠️</span>
        <div className="space-y-0.5">
          <p className="font-bold text-amber-900">
            {selectedLanguage === 'Telugu' ? 'ముందస్తు సమాచార హెచ్చరిక (Statutory Advisory):' : 'Statutory Notice on Welfare Matching:'}
          </p>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            {selectedLanguage === 'Telugu'
              ? 'స్కీమాట్రిక్స్ మీ వివరాల ఆధారంగా ప్రాథమిక అర్హతను మాత్రమే సూచిస్తుంది. ఇది తుది ఆమోదం కాదు; సంబంధిత ప్రభుత్వ శాఖల అధికారిక పరిశీలన అనంతరం మాత్రమే పథకాలు మంజూరు చేయబడతాయి. అర్హత ఎప్పుడూ ముందస్తు హామీ ఇవ్వబడదు.'
              : 'Schematrix calculates preliminary advisory eligibility matches based on user-entered profile parameters. Official sanctions, quota allocations, and DBT cash disbursements remain strictly subject to formal document and field verification by competent block or district nodal authorities. Eligibility is never unconditionally guaranteed.'}
          </p>
        </div>
      </div>

      {/* Nearby Office & MeeSeva Assistance Quick Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                {selectedLanguage === 'Telugu' ? 'సమీప పౌర సేవా కేంద్రాలు (మీసేవ & సచివాలయాలు)' : 'In-Person Assistance: MeeSeva & Ward Sachivalayam'}
              </h3>
              <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Assisted Desk
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {selectedLanguage === 'Telugu'
                ? 'పత్రాల అటెస్టేషన్, ఆధార్ లింకింగ్ మరియు ఆఫ్-లైన్ దరఖాస్తుల కోసం సమీప కేంద్రం వద్ద వాక్-ఇన్ స్లాట్ బుక్ చేసుకోండి.'
                : 'Need help with physical document attestation or Aadhaar updates? Find nearby verified centers and book walk-in tokens.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('centers')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
        >
          <span>{selectedLanguage === 'Telugu' ? 'కేంద్రాలు & మార్గదర్శక దశలు' : 'Locate Centers & Steps'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                AI Personalized Recommendations
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {eligibleSchemes.length} Matched for You
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified automatically using your demographic, occupation, and financial profile.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Schemes Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scheme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibleSchemes.slice(0, 3).map(({ scheme, evaluation }) => (
            <div
              key={scheme.id}
              className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {scheme.category}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {evaluation.matchScore}% Match
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors line-clamp-2">
                  {scheme.title}
                </h3>
                {scheme.titleHindi && (
                  <p className="text-xs text-slate-500 font-hindi mt-0.5">
                    {scheme.titleHindi}
                  </p>
                )}

                <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 text-xs font-semibold">
                  {scheme.benefitHighlight}
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {scheme.shortDescription}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Docs: {scheme.requiredDocuments.length} required</span>
                  <span>•</span>
                  <span>Approval: ~{scheme.processingDays} days</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
                >
                  Details & Criteria
                </button>
                <button
                  onClick={() => onApplyScheme(scheme)}
                  className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>1-Click Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Missing Criteria Scheme Suggestion */}
          {potentialSchemes.length > 0 && (
            <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Almost Eligible
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-700" />
                    {potentialSchemes[0].evaluation.matchScore}%
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {potentialSchemes[0].scheme.title}
                </h3>
                <p className="text-xs text-amber-900 mt-2 font-medium">
                  {potentialSchemes[0].evaluation.recommendationReason}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Check if an updated income or disability certificate qualifies your household.
                </p>
              </div>

              <button
                onClick={() => onSelectScheme(potentialSchemes[0].scheme)}
                className="mt-4 w-full py-2 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors"
              >
                Inspect Eligibility Rules
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Sector Shortcuts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Explore Services by Sector
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Government departments consolidated into single-window citizen access
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateTab('schemes')}
                className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 leading-snug">
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Tracking Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Application Radar
            </h2>
            <p className="text-xs text-slate-500">
              Transparent milestone updates without visiting administrative offices
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tracking')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => onNavigateTab('tracking')}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {app.schemeTitle}
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {app.applicationId}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Applied on {app.appliedDate} • Last Action: {app.lastUpdated}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    app.status === 'Disbursed' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {app.status === 'Disbursed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {app.status}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Stage {app.currentStage} of {app.totalStages}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
