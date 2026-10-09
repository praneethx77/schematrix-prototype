import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Info, 
  Building2, 
  Landmark, 
  Tag, 
  Check, 
  FileCheck2,
  FileQuestion,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { CitizenProfile, Scheme, DocumentItem } from '../types';
import { evaluateEligibility } from '../utils/eligibilityEngine';
import { useVoiceToText } from '../hooks/useVoiceToText';

interface SchemesCatalogProps {
  profile: CitizenProfile;
  schemes: Scheme[];
  documents: DocumentItem[];
  onSelectScheme: (scheme: Scheme) => void;
  onApplyScheme: (scheme: Scheme) => void;
  isSeniorMode: boolean;
  selectedLanguage?: string;
}

export const SchemesCatalog: React.FC<SchemesCatalogProps> = ({
  profile,
  schemes,
  documents,
  onSelectScheme,
  onApplyScheme,
  isSeniorMode,
  selectedLanguage = 'English'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Central' | 'State'>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible_only' | 'high_match'>('all');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Voice-to-Text integration using Web Speech API
  const {
    isListening,
    interimTranscript,
    isSupported: isSpeechSupported,
    toggleListening,
    stopListening
  } = useVoiceToText({
    language: selectedLanguage,
    onResult: (transcriptChunk, isFinal) => {
      setSearchQuery(transcriptChunk);
      if (isFinal) {
        setVoiceNotice(`Searched for: "${transcriptChunk}"`);
        setTimeout(() => setVoiceNotice(null), 4000);
      }
    },
    onError: (err) => {
      setVoiceNotice(err);
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  });

  const verifiedDocTitles = useMemo(() => {
    return documents
      .filter((d) => d.verifiedStatus === 'verified')
      .map((d) => d.docType);
  }, [documents]);

  const categories = ['All', 'Agriculture', 'Healthcare', 'Education', 'Housing', 'Financial & MSME', 'Social Welfare', 'Women & Child'];

  // Evaluate each scheme against citizen
  const evaluatedSchemes = useMemo(() => {
    return schemes.map((scheme) => {
      const evaluation = evaluateEligibility(profile, scheme, verifiedDocTitles);
      return { scheme, evaluation };
    });
  }, [schemes, profile, verifiedDocTitles]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter(({ scheme, evaluation }) => {
      // Search filter
      const matchesSearch =
        scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scheme.titleHindi && scheme.titleHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;

      // Level filter
      const matchesLevel = selectedLevel === 'All' || scheme.level === selectedLevel;

      // Eligibility filter
      let matchesEligibility = true;
      if (eligibilityFilter === 'eligible_only') {
        matchesEligibility = evaluation.isEligible;
      } else if (eligibilityFilter === 'high_match') {
        matchesEligibility = evaluation.matchScore >= 60;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesEligibility;
    });
  }, [evaluatedSchemes, searchQuery, selectedCategory, selectedLevel, eligibilityFilter]);

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Search & Intelligence Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Unified Government Schemes Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live automated eligibility matching based on citizen persona: <strong className="text-slate-800">{profile.name} ({profile.occupation}, {profile.state})</strong>
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {evaluatedSchemes.filter(s => s.evaluation.isEligible).length} Eligible for You
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              {schemes.length} Total Services
            </span>
          </div>
        </div>

        {/* Search Bar with Web Speech Voice-to-Text */}
        <div className="space-y-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isListening ? `Listening in ${selectedLanguage}... speak now...` : "Search by scheme name, keywords (e.g. kisan, loan, scholarship, health, pucca house)..."}
              value={isListening && interimTranscript ? interimTranscript : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-28 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                isListening 
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-200' 
                  : 'bg-slate-50/50 hover:bg-white focus:bg-white border-slate-300'
              }`}
            />

            {/* Right Action Icons (Clear + Voice-to-Text) */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && !isListening && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md transition-colors"
                  title="Clear search"
                >
                  Clear
                </button>
              )}

              {/* Voice-to-Text Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                }`}
                title={isListening ? "Stop voice listening" : `Voice Search in ${selectedLanguage} (Click to speak)`}
                aria-label="Search schemes by voice"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 animate-bounce" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Voice Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Voice Listening Animation & Status */}
          {isListening && (
            <div className="p-3 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 shadow-xs animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <span className="font-semibold">
                  Listening in <strong>{selectedLanguage}</strong>:
                </span>
                <span className="italic font-medium text-slate-800">
                  {interimTranscript ? `"${interimTranscript}"` : 'Please speak your keyword (e.g., "Kisan Loan", "Ayushman Card", "Scholarship")...'}
                </span>
              </div>
              <button
                onClick={stopListening}
                className="text-xs font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 ml-2"
              >
                Done
              </button>
            </div>
          )}

          {/* Voice Notice (searched transcript confirmation or permission notice) */}
          {voiceNotice && !isListening && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {voiceNotice}
              </span>
              <button
                onClick={() => setVoiceNotice(null)}
                className="text-blue-500 hover:text-blue-800 text-[11px] font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Statutory Notice: Never Guarantee Eligibility */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
            <span className="text-amber-700 font-bold text-xs shrink-0 mt-0.5">⚠️</span>
            <p className="leading-relaxed text-[11px]">
              <strong>Statutory Notice:</strong> Schemes directory calculates preliminary eligibility matches based on declared profile parameters. Official sanctions, quota prioritization, and funds disbursement remain subject to statutory verification by the respective nodal authority. <em>Eligibility is never unconditionally guaranteed.</em>
            </p>
          </div>
        </div>

        {/* Quick Tag Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" /> Quick filters:
          </span>
          {['Farmers', 'Cashless Hospital', 'Zero Collateral', 'Tuition Waiver', 'Girl Child', 'State Scheme'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Sector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Controls (Level & Match filter) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Central / State */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Jurisdictions</option>
              <option value="Central">Central Govt Schemes</option>
              <option value="State">State Govt Schemes</option>
            </select>

            {/* Eligibility filter */}
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value as any)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                eligibilityFilter === 'eligible_only'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <option value="all">Show All Schemes</option>
              <option value="eligible_only">✓ 100% Eligible For Me</option>
              <option value="high_match">★ High Match (&gt;=60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching schemes found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clear category filters, or switch citizen profile in the top bar.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
              setEligibilityFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map(({ scheme, evaluation }) => {
            const isFullyEligible = evaluation.isEligible;
            const isHighMatch = !isFullyEligible && evaluation.matchScore >= 60;

            return (
              <div
                key={scheme.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden group ${
                  isFullyEligible
                    ? 'border-emerald-300/80 hover:border-emerald-500 ring-1 ring-emerald-500/10'
                    : isHighMatch
                    ? 'border-amber-200 hover:border-amber-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Corner Pill (Requirement: Never guarantee eligibility) */}
                {isFullyEligible && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Criteria Met (Prelim)
                  </div>
                )}

                <div>
                  {/* Category & Scope header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {scheme.level === 'State' ? `State (${scheme.stateSpecific || 'Regional'})` : 'National / Central'}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {scheme.title}
                  </h2>
                  {scheme.titleHindi && (
                    <p className="text-xs text-slate-500 font-hindi mt-0.5">
                      {scheme.titleHindi}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {scheme.ministry}
                  </p>

                  {/* Benefit Banner */}
                  <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-900 text-xs font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{scheme.benefitHighlight}</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {scheme.shortDescription}
                  </p>

                  {/* Eligibility Reason Pill */}
                  <div className="mt-4 p-2.5 rounded-lg text-xs font-medium border flex items-start gap-2 bg-slate-50 border-slate-200">
                    {isFullyEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : isHighMatch ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-slate-700 text-[11px] leading-snug">
                      <span className="font-bold">
                        {evaluation.matchScore}% Match:{' '}
                      </span>
                      <span>{evaluation.recommendationReason}</span>
                    </div>
                  </div>

                  {/* Required Documents Checklist Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Linked Vault Documents:</span>
                      <span className="text-slate-400 font-normal">
                        {scheme.requiredDocuments.filter((d) => verifiedDocTitles.includes(d as any)).length} of {scheme.requiredDocuments.length} ready
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scheme.requiredDocuments.map((docName) => {
                        const hasDoc = verifiedDocTitles.includes(docName as any);
                        return (
                          <span
                            key={docName}
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              hasDoc
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {hasDoc ? <FileCheck2 className="w-2.5 h-2.5 text-emerald-600" /> : <FileQuestion className="w-2.5 h-2.5 text-slate-400" />}
                            {docName}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Official Government Portal Link */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>Official Ministry Portal:</span>
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>Criteria</span>
                  </button>
                  <button
                    onClick={() => onApplyScheme(scheme)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 ${
                      isFullyEligible
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    }`}
                  >
                    <span>1-Click Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
