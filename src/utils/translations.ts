export interface TranslationDictionary {
  appName: string;
  tagline: string;
  disclaimerBanner: string;
  dashboardTab: string;
  schemesTab: string;
  vaultTab: string;
  trackingTab: string;
  aiTab: string;
  centersTab: string;
  eligibleSchemes: string;
  totalCoverage: string;
  verifiedDocs: string;
  activeApps: string;
  searchPlaceholder: string;
  voiceSearch: string;
  oneClickApply: string;
  detailsCriteria: string;
  renew: string;
  expiringNotice: string;
  demoRecordBadge: string;
  fileGrievance: string;
  receiptDownload: string;
  findNearbyCenter: string;
  askVoice: string;
  seniorMode: string;
}

export const TRANSLATIONS: Record<'English' | 'Telugu', TranslationDictionary> = {
  English: {
    appName: 'SCHEMATRIX',
    tagline: 'Unified Citizen Government Services Platform',
    disclaimerBanner: 'Provisional Algorithmic Matching: Schematrix provides preliminary eligibility assessments based on declared citizen inputs. Final sanction and approvals are never guaranteed and remain subject to official verification by the competent government authority.',
    dashboardTab: 'Dashboard',
    schemesTab: 'Schemes Directory',
    vaultTab: 'Document Vault (Demo)',
    trackingTab: 'Application Tracker',
    aiTab: 'AI Sahayak Guide',
    centersTab: 'Nearby Office Assistance',
    eligibleSchemes: 'Preliminary Matched Schemes',
    totalCoverage: 'Potential Financial Coverage',
    verifiedDocs: 'Documents in Vault',
    activeApps: 'Tracked Applications',
    searchPlaceholder: 'Search schemes by keyword (e.g. kisan, scholarship, loan, health)...',
    voiceSearch: 'Voice Search',
    oneClickApply: '1-Click Guided Apply',
    detailsCriteria: 'Details & Rules',
    renew: 'Renew Certificate',
    expiringNotice: 'Document Expiration Alert',
    demoRecordBadge: 'DEMO PROTOTYPE RECORD',
    fileGrievance: 'File Grievance',
    receiptDownload: 'Acknowledgment Slip',
    findNearbyCenter: 'Locate Nearest MeeSeva / Sachivalayam',
    askVoice: 'Ask by Voice',
    seniorMode: 'Senior & Rural Citizen Mode'
  },
  Telugu: {
    appName: 'స్కీమాట్రిక్స్ (SCHEMATRIX)',
    tagline: 'సమగ్ర పౌర ప్రభుత్వ సేవల వేదిక',
    disclaimerBanner: 'ముందస్తు సమాచార హెచ్చరిక: స్కీమాట్రిక్స్ మీ వివరాల ఆధారంగా ప్రాథమిక అర్హతను మాత్రమే సూచిస్తుంది. ఇది తుది ఆమోదం కాదు; సంబంధిత ప్రభుత్వ శాఖల అధికారిక పరిశీలన అనంతరం మాత్రమే పథకాలు మంజూరు చేయబడతాయి.',
    dashboardTab: 'డాష్‌బోర్డ్',
    schemesTab: 'ప్రభుత్వ పథకాలు',
    vaultTab: 'పత్రాల వాల్ట్ (డెమో)',
    trackingTab: 'దరఖాస్తు ట్రాకింగ్',
    aiTab: 'ఏఐ సహాయక్ (AI Sahayak)',
    centersTab: 'సమీప మీసేవ / సచివాలయాలు',
    eligibleSchemes: 'ప్రాథమికంగా సరిపోలిన పథకాలు',
    totalCoverage: 'అంచనా వేసిన ఆర్థిక ప్రయోజనం',
    verifiedDocs: 'వాల్ట్‌లోని పత్రాలు',
    activeApps: 'నమోదైన దరఖాస్తులు',
    searchPlaceholder: 'పథకాల పేరు లేదా కీలకపదాలతో వెతకండి (ఉదా: రైతు, స్కాలర్‌షిప్, లోన్, ఆరోగ్యం)...',
    voiceSearch: 'వాయిస్ శోధన',
    oneClickApply: 'ఒక్క క్లిక్‌తో దరఖాస్తు',
    detailsCriteria: 'వివరాలు & నిబంధనలు',
    renew: 'పునరుద్ధరణ (Renew)',
    expiringNotice: 'గడువు ముగింపు హెచ్చరిక',
    demoRecordBadge: 'డెమో రికార్డు (DEMO)',
    fileGrievance: 'ఫిర్యాదు నమోదు (Grievance)',
    receiptDownload: 'రశీదు డౌన్‌లోడ్',
    findNearbyCenter: 'సమీప మీసేవ / సచివాలయం కనుగొనండి',
    askVoice: 'నోటితో మాట్లాడి అడగండి',
    seniorMode: 'సీనియర్ & గ్రామీణ పౌరుల మోడ్'
  }
};
