import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Navigation, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Landmark,
  Layers,
  HelpCircle
} from 'lucide-react';
import { CitizenServiceCenter } from '../types';
import { useVoiceToText } from '../hooks/useVoiceToText';

interface ServiceCentersViewProps {
  centers: CitizenServiceCenter[];
  selectedLanguage: string;
  isSeniorMode: boolean;
  onNavigateTab?: (tab: 'dashboard' | 'schemes' | 'documents' | 'tracking' | 'centers' | 'ai-assistant') => void;
}

export const ServiceCentersView: React.FC<ServiceCentersViewProps> = ({
  centers,
  selectedLanguage,
  isSeniorMode,
  onNavigateTab
}) => {
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeCenterForRoute, setActiveCenterForRoute] = useState<CitizenServiceCenter | null>(null);
  const [bookedSlot, setBookedSlot] = useState<{ centerId: string; centerName: string; tokenNumber: string; time: string } | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const isTelugu = selectedLanguage === 'Telugu';

  // Voice search for centers
  const {
    isListening,
    interimTranscript,
    isSupported: isSpeechSupported,
    toggleListening,
    stopListening
  } = useVoiceToText({
    language: selectedLanguage,
    onResult: (transcriptChunk, isFinal) => {
      setSearchDistrict(transcriptChunk);
      if (isFinal) {
        setVoiceNotice(isTelugu ? `శోధించిన ప్రాంతం: "${transcriptChunk}"` : `Area recognized: "${transcriptChunk}"`);
        setTimeout(() => setVoiceNotice(null), 3500);
      }
    },
    onError: (err) => {
      setVoiceNotice(err);
      setTimeout(() => setVoiceNotice(null), 3500);
    }
  });

  const types = ['All', 'MeeSeva', 'Sachivalayam', 'Tahsildar Office', 'CSC'];

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
      center.nameTelugu.includes(searchDistrict) ||
      center.district.toLowerCase().includes(searchDistrict.toLowerCase()) ||
      center.mandal.toLowerCase().includes(searchDistrict.toLowerCase()) ||
      center.address.toLowerCase().includes(searchDistrict.toLowerCase());

    const matchesType = selectedType === 'All' || center.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleBookSlot = (center: CitizenServiceCenter) => {
    const token = `MS-SLOT-${Math.floor(100 + Math.random() * 900)}`;
    setBookedSlot({
      centerId: center.id,
      centerName: center.name,
      tokenNumber: token,
      time: 'Tomorrow, 10:30 AM'
    });
  };

  const guidedSteps = isTelugu ? [
    {
      step: 1,
      title: 'అర్హతను సరిచూడండి',
      desc: 'మీ వయస్సు, ఆదాయం, వృత్తిని నమోదు చేసి 100+ కేంద్ర, రాష్ట్ర పథకాలకు సరిపోలండి.',
      icon: Sparkles,
      action: () => onNavigateTab?.('schemes'),
      actionLabel: 'పథకాలు చూడండి'
    },
    {
      step: 2,
      title: 'పత్రాలను సిద్ధం చేయండి',
      desc: 'ఆధార్, ఆదాయ మరియు భూమి రికార్డులను స్కీమాట్రిక్స్ వాల్ట్‌లో భద్రపరుచుకోండి.',
      icon: FileCheck2,
      action: () => onNavigateTab?.('documents'),
      actionLabel: 'వాల్ట్ తెరవండి'
    },
    {
      step: 3,
      title: 'ఆన్‌లైన్ లేదా మీసేవ ద్వారా దరఖాస్తు',
      desc: '1-క్లిక్‌తో ఆన్‌లైన్ దరఖాస్తు చేయండి లేదా సమీప మీసేవ / సచివాలయంలో సహాయం పొందండి.',
      icon: Landmark,
      action: () => {},
      actionLabel: 'కేంద్రాలు కింద ఉన్నాయి'
    },
    {
      step: 4,
      title: 'దరఖాస్తు స్థితిని ట్రాక్ చేయండి',
      desc: 'అధికారుల పరిశీలన మరియు దస్త్రం కదలికలను రియల్-టైమ్‌లో పర్యవేక్షించండి.',
      icon: Clock,
      action: () => onNavigateTab?.('tracking'),
      actionLabel: 'ట్రాకర్ చూడండి'
    },
    {
      step: 5,
      title: 'నగదు బదిలీ (DBT) పొందండి',
      desc: 'మంజూరైన ఆర్థిక సహాయం నేరుగా మీ బ్యాంకు ఖాతాలో జమ అవుతుంది.',
      icon: CheckCircle2,
      action: () => onNavigateTab?.('tracking'),
      actionLabel: 'DBT స్థితి'
    }
  ] : [
    {
      step: 1,
      title: '1. Discover & Check Eligibility',
      desc: 'Enter age, income, and occupation to dynamically compute matching Central and State schemes.',
      icon: Sparkles,
      action: () => onNavigateTab?.('schemes'),
      actionLabel: 'Explore Schemes'
    },
    {
      step: 2,
      title: '2. Prepare Vault Documents',
      desc: 'Pre-link and verify your Aadhaar, income, and land records without repetitive re-uploads.',
      icon: FileCheck2,
      action: () => onNavigateTab?.('documents'),
      actionLabel: 'Open Vault'
    },
    {
      step: 3,
      title: '3. Online 1-Click or Assisted Filing',
      desc: 'Submit directly online or walk in to your nearest verified MeeSeva / Ward Sachivalayam.',
      icon: Landmark,
      action: () => {},
      actionLabel: 'View Centers Below'
    },
    {
      step: 4,
      title: '4. Multi-Stage SLA Tracking',
      desc: 'Monitor block verification, field inspection, and executive sanctions with milestone timestamps.',
      icon: Clock,
      action: () => onNavigateTab?.('tracking'),
      actionLabel: 'Open Tracker'
    },
    {
      step: 5,
      title: '5. Direct Benefit Transfer (DBT)',
      desc: 'Financial grants and subsidies credit straight to your Aadhaar-seeded bank account.',
      icon: CheckCircle2,
      action: () => onNavigateTab?.('tracking'),
      actionLabel: 'View DBT Radar'
    }
  ];

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isTelugu ? 'పౌర సేవలు & సమీప కార్యాలయాల సహాయం' : 'Public Services & Nearby Office Assistance'}
            </h1>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
              MeeSeva & Sachivalayam
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isTelugu
              ? 'ఆన్‌లైన్ దరఖాస్తులు, ఆధార్ లింకింగ్, మరియు పత్రాల పరిశీలన కోసం ధృవీకరించబడిన ప్రభుత్వ సేవా కేంద్రాలను గుర్తించండి.'
              : 'Guided steps for welfare delivery, plus verified MeeSeva, Grama/Ward Sachivalayam, and Tahsildar offices for assisted filing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{centers.length} Centers Online</span>
        </div>
      </div>

      {/* Guided Steps for Public Services Delivery (Requirement: Guided Steps) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{isTelugu ? 'పౌర సేవల మార్గదర్శక దశలు (5 సులభమైన దశలు)' : 'Guided Steps for Citizen Welfare Delivery (5 Steps)'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTelugu
                ? 'ప్రభుత్వ సేవలను సులభంగా పొందడానికి ఈ క్రింది పద్ధతిని అనుసరించండి.'
                : 'Follow this streamlined process to discover schemes, link documents, and receive entitlements.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {guidedSteps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">
                    {stepItem.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                {stepItem.actionLabel && (
                  <button
                    onClick={stepItem.action}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-1 border-t border-slate-200/60"
                  >
                    <span>{stepItem.actionLabel}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filters with Voice-to-Text */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={isListening && interimTranscript ? interimTranscript : searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              placeholder={
                isListening
                  ? (isTelugu ? 'వినబడుతోంది... మాట్లాడండి...' : 'Listening... speak area or district name...')
                  : (isTelugu
                    ? 'జిల్లా, మండలం లేదా ఊరి పేరుతో వెతకండి (ఉదా: Visakhapatnam, Warangal, Gajuwaka, Delhi)...'
                    : 'Search by District, Mandal or Area (e.g. Visakhapatnam, Warangal, Borsad, Delhi)...')
              }
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {/* Voice Search Button */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title={isListening ? 'Stop listening' : 'Search by Voice'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'All' ? (isTelugu ? 'అన్నీ' : 'All') : t}
              </button>
            ))}
          </div>
        </div>

        {voiceNotice && (
          <p className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
            {voiceNotice}
          </p>
        )}
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    center.type === 'MeeSeva'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : center.type === 'Sachivalayam'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {center.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {center.name}
                  </h3>
                  {center.nameTelugu && (
                    <p className="text-xs text-slate-500 font-medium font-sans">
                      {center.nameTelugu}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 inline-flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-blue-600" />
                    {center.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Address & Timings */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{center.address}, {center.mandal}, {center.district}, {center.state} - {center.pincode}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {center.timings}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {center.contactPhone}
                  </span>
                </div>
              </div>

              {/* Officer In-Charge */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>In-Charge: <strong className="text-slate-800">{center.officerInCharge}</strong></span>
              </div>

              {/* Services Offered Chips */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  {isTelugu ? 'అందించే పౌర సేవలు:' : 'Key Public Services Offered:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {center.servicesOffered.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setActiveCenterForRoute(center)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>{isTelugu ? 'మార్గం చూడండి' : 'Directions & Route'}</span>
              </button>
              <button
                onClick={() => handleBookSlot(center)}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isTelugu ? 'స్లాట్ బుక్ చేయండి' : 'Book Walk-In Slot'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Directions / Route Modal */}
      {activeCenterForRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Navigation & Transit Route
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeCenterForRoute.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCenterForRoute(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Simulated Route Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>ESTIMATED TRAVEL TIME:</span>
                <span>~6 MINS ({activeCenterForRoute.distanceKm} KM)</span>
              </div>
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <p>1. Head North from current location towards Main Road (400m)</p>
                <p>2. Turn right onto Mandal Office Junction (800m)</p>
                <p>3. Destination will be on your left: {activeCenterForRoute.address}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Operating Hours: {activeCenterForRoute.timings}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveCenterForRoute(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(activeCenterForRoute.name + ' ' + activeCenterForRoute.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Booked Slot Confirmation */}
      {bookedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isTelugu ? 'టోకెన్ విజయవంతంగా జారీ చేయబడింది' : 'Walk-In Token Confirmed'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTelugu
                  ? 'మీసేవ / గ్రామ సచివాలయం సహాయకుడి వద్ద ఈ టోకెన్ నంబర్ చూపించండి.'
                  : 'Present this token at the MeeSeva / Sachivalayam verification desk.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-xs text-left">
              <p><span className="text-slate-400">Center:</span> <strong className="text-slate-800">{bookedSlot.centerName}</strong></p>
              <p><span className="text-slate-400">Token ID:</span> <strong className="text-blue-700 text-sm">{bookedSlot.tokenNumber}</strong></p>
              <p><span className="text-slate-400">Slot Time:</span> <strong className="text-slate-800">{bookedSlot.time}</strong></p>
            </div>

            <button
              onClick={() => setBookedSlot(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              {isTelugu ? 'పూర్తయింది' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
