export type OccupationType =
  | 'Farmer'
  | 'Student'
  | 'Rural Artisan / Daily Wage'
  | 'Unemployed Youth'
  | 'Micro Entrepreneur'
  | 'Salaried Worker'
  | 'Senior Citizen'
  | 'Homemaker';

export type CategoryType = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type GenderType = 'Male' | 'Female' | 'Other';

export type LandHoldingType = 'None' | '< 1 Hectare' | '1 - 2 Hectares' | '> 2 Hectares';

export interface CitizenProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: GenderType;
  occupation: OccupationType;
  annualIncome: number; // in INR
  category: CategoryType;
  state: string;
  district: string;
  landholding: LandHoldingType;
  isBPL: boolean;
  isDisability: boolean;
  isMinority: boolean;
  aadhaarLinked: boolean;
  bankAccountLinked: boolean;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  docType: 'Aadhaar' | 'PAN Card' | 'Income Certificate' | 'Caste Certificate' | 'Land Records (7/12)' | 'Ration Card' | 'Marksheet' | 'Bank Passbook';
  docNumber: string;
  verifiedStatus: 'verified' | 'pending' | 'rejected' | 'action_required';
  rejectionReason?: string;
  issuedDate: string;
  expiryDate?: string; // e.g. '28 Oct 2026' or 'Permanent'
  daysUntilExpiry?: number; // e.g. 19
  isExpiringSoon?: boolean;
  issuingAuthority: string;
  qrToken: string;
  docSize: string;
  extractedDetails?: Record<string, string>;
}

export interface Scheme {
  id: string;
  code: string;
  title: string;
  titleHindi?: string;
  titleTelugu?: string;
  ministry: string;
  category: 'Agriculture' | 'Healthcare' | 'Education' | 'Housing' | 'Financial & MSME' | 'Social Welfare' | 'Women & Child';
  level: 'Central' | 'State';
  stateSpecific?: string;
  shortDescription: string;
  fullDescription: string;
  benefitHighlight: string;
  financialAssistanceAmount?: number;
  benefitType: 'Direct Cash Transfer' | 'Health Insurance' | 'Subsidized Loan' | 'Tuition Subsidy' | 'Infrastructure' | 'Pension';
  eligibilityRules: {
    minAge?: number;
    maxAge?: number;
    allowedOccupations?: OccupationType[];
    maxIncome?: number;
    allowedCategories?: CategoryType[];
    requiresBPL?: boolean;
    requiresDisability?: boolean;
    allowedLandHolding?: LandHoldingType[];
    genderAllowed?: 'All' | 'Female' | 'Male';
  };
  requiredDocuments: string[];
  applicationDeadline?: string;
  processingDays: number;
  officialPortalUrl: string;
  tags: string[];
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Scrutiny'
  | 'Document Verification'
  | 'Field Inspection'
  | 'Sanctioned'
  | 'Disbursed'
  | 'Action Needed';

export interface ApplicationTimelineStep {
  title: string;
  date: string;
  completed: boolean;
  current?: boolean;
  remarks?: string;
  officerDesignation?: string;
}

export interface ApplicationRecord {
  id: string;
  applicationId: string;
  schemeId: string;
  schemeTitle: string;
  schemeCategory: string;
  appliedDate: string;
  status: ApplicationStatus;
  currentStage: number;
  totalStages: number;
  timeline: ApplicationTimelineStep[];
  attachedDocuments: string[];
  dbtAmount?: number;
  dbtReferenceId?: string;
  lastUpdated: string;
  isDemoRecord?: boolean;
}

export interface CitizenServiceCenter {
  id: string;
  name: string;
  nameTelugu: string;
  type: 'MeeSeva' | 'Sachivalayam' | 'CSC' | 'Tahsildar Office' | 'District Collectorate';
  address: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  distanceKm: number;
  contactPhone: string;
  timings: string;
  officerInCharge: string;
  servicesOffered: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'dbt_credit' | 'new_scheme' | 'doc_alert' | 'status_update';
  timestamp: string;
  isRead: boolean;
  schemeId?: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  applicationId: string;
  schemeTitle: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Review' | 'Resolved';
  filedDate: string;
  officerAssigned: string;
  expectedResolutionDays: number;
}
