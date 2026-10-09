import {
  CitizenProfile,
  DocumentItem,
  Scheme,
  ApplicationRecord,
  NotificationItem,
  GrievanceTicket,
  CitizenServiceCenter
} from '../types';

export const INITIAL_PERSONAS: CitizenProfile[] = [
  {
    id: 'persona-srinivasa',
    name: 'Srinivasa Rao (శ్రీనివాస రావు)',
    phone: '+91 94401 23890',
    email: 'srinivas.kisan@ap.gov.in',
    age: 49,
    gender: 'Male',
    occupation: 'Farmer',
    annualIncome: 95000,
    category: 'OBC',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    landholding: '1 - 2 Hectares',
    isBPL: true,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'Andhra Pragathi Grameena Bank',
    accountNumberMasked: '•••• •••• 9921',
    ifscCode: 'APGB0001042'
  },
  {
    id: 'persona-kavitha',
    name: 'Kavitha Reddy (కవితా రెడ్డి)',
    phone: '+91 98480 77123',
    email: 'kavitha.reddy@student.telangana.in',
    age: 20,
    gender: 'Female',
    occupation: 'Student',
    annualIncome: 140000,
    category: 'EWS',
    state: 'Telangana',
    district: 'Warangal',
    landholding: 'None',
    isBPL: false,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'State Bank of India (SBI)',
    accountNumberMasked: '•••• •••• 3418',
    ifscCode: 'SBIN0004120'
  },
  {
    id: 'persona-ramesh',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    email: 'ramesh.kisan@bharatmail.in',
    age: 52,
    gender: 'Male',
    occupation: 'Farmer',
    annualIncome: 110000,
    category: 'OBC',
    state: 'Gujarat',
    district: 'Anand',
    landholding: '1 - 2 Hectares',
    isBPL: true,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'State Bank of India (SBI)',
    accountNumberMasked: '•••• •••• 4092',
    ifscCode: 'SBIN0001024'
  },
  {
    id: 'persona-ananya',
    name: 'Ananya Sharma',
    phone: '+91 94123 55678',
    email: 'ananya.student@edu.in',
    age: 19,
    gender: 'Female',
    occupation: 'Student',
    annualIncome: 180000,
    category: 'EWS',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    landholding: 'None',
    isBPL: false,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'Punjab National Bank (PNB)',
    accountNumberMasked: '•••• •••• 8821',
    ifscCode: 'PUNB0123400'
  },
  {
    id: 'persona-sunita',
    name: 'Sunita Devi',
    phone: '+91 91234 99012',
    email: 'sunita.craft@gramin.org',
    age: 44,
    gender: 'Female',
    occupation: 'Rural Artisan / Daily Wage',
    annualIncome: 75000,
    category: 'SC',
    state: 'Bihar',
    district: 'Madhubani',
    landholding: 'None',
    isBPL: true,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'Bank of Baroda',
    accountNumberMasked: '•••• •••• 3144',
    ifscCode: 'BARB0MADHUB'
  },
  {
    id: 'persona-rajesh',
    name: 'Rajesh Kumar',
    phone: '+91 97110 88231',
    email: 'rajesh.vendor@delhicity.in',
    age: 29,
    gender: 'Male',
    occupation: 'Micro Entrepreneur',
    annualIncome: 210000,
    category: 'General',
    state: 'Delhi',
    district: 'East Delhi',
    landholding: 'None',
    isBPL: false,
    isDisability: false,
    isMinority: false,
    aadhaarLinked: true,
    bankAccountLinked: true,
    bankName: 'HDFC Bank',
    accountNumberMasked: '•••• •••• 6509',
    ifscCode: 'HDFC0000240'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-aadhaar',
    title: 'Aadhaar Identification Card',
    docType: 'Aadhaar',
    docNumber: 'XXXX-XXXX-4812',
    verifiedStatus: 'verified',
    issuedDate: '14 Feb 2018',
    expiryDate: 'Permanent (e-KYC Valid)',
    daysUntilExpiry: 999,
    isExpiringSoon: false,
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    qrToken: 'UIDAI-PKI-9843-SIGN',
    docSize: '412 KB',
    extractedDetails: {
      'DOB': '12/08/1972',
      'Address': 'Village Vasna, Taluka Borsad, Anand, Gujarat',
      'e-KYC Status': 'Biometrically Authenticated'
    }
  },
  {
    id: 'doc-pan',
    title: 'Permanent Account Number (PAN)',
    docType: 'PAN Card',
    docNumber: 'BPMPK8841F',
    verifiedStatus: 'verified',
    issuedDate: '22 Oct 2019',
    expiryDate: 'Permanent / Lifetime',
    daysUntilExpiry: 999,
    isExpiringSoon: false,
    issuingAuthority: 'Income Tax Department, Govt of India',
    qrToken: 'NSDL-PAN-VALID-4402',
    docSize: '298 KB',
    extractedDetails: {
      'Name': 'Ramesh Bhai Patel',
      'Father Name': 'Kantilal Patel',
      'Status': 'Active Individual'
    }
  },
  {
    id: 'doc-land',
    title: 'Village Land Record (7/12 Extract & 8A)',
    docType: 'Land Records (7/12)',
    docNumber: 'SURVEY-712-BORSAD-88',
    verifiedStatus: 'verified',
    issuedDate: '05 Jan 2024',
    expiryDate: '31 Mar 2027 (Kharif/Rabi Cycle)',
    daysUntilExpiry: 173,
    isExpiringSoon: false,
    issuingAuthority: 'Revenue Department, Govt of Gujarat (AnyRoR)',
    qrToken: 'REV-GUJ-712-882194',
    docSize: '1.2 MB',
    extractedDetails: {
      'Survey No': '482/2',
      'Area': '1.38 Hectares',
      'Crop': 'Wheat & Cotton',
      'Ownership': 'Sole Cultivator'
    }
  },
  {
    id: 'doc-ration',
    title: 'National Food Security (NFSA) Ration Card',
    docType: 'Ration Card',
    docNumber: 'NFSA-GJ-8820491',
    verifiedStatus: 'verified',
    issuedDate: '10 Aug 2021',
    expiryDate: '15 Nov 2026',
    daysUntilExpiry: 37,
    isExpiringSoon: true,
    issuingAuthority: 'Food & Civil Supplies Department',
    qrToken: 'NFSA-BPL-PRIORITY-019',
    docSize: '650 KB',
    extractedDetails: {
      'Category': 'BPL / Priority Household',
      'Family Members': '4 Persons',
      'Fair Price Shop': 'FPS Anand Ward 4',
      'Annual e-KYC': 'Due by 15 Nov 2026'
    }
  },
  {
    id: 'doc-income',
    title: 'Tehsildar Income Certificate (FY 2025-26)',
    docType: 'Income Certificate',
    docNumber: 'INC/2025/GJ/9931',
    verifiedStatus: 'verified',
    issuedDate: '18 Apr 2025',
    expiryDate: '28 Oct 2026',
    daysUntilExpiry: 19,
    isExpiringSoon: true,
    issuingAuthority: 'Revenue Taluka Office Borsad',
    qrToken: 'E-DISTRICT-INC-8819',
    docSize: '520 KB',
    extractedDetails: {
      'Declared Income': '₹1,10,000 per annum',
      'Validity Period': '6 Months Statutory',
      'Officer': 'Mamlatdar & Executive Magistrate'
    }
  },
  {
    id: 'doc-caste',
    title: 'Non-Creamy Layer OBC Certificate',
    docType: 'Caste Certificate',
    docNumber: 'OBC/GJ/2022/4119',
    verifiedStatus: 'verified',
    issuedDate: '11 Jul 2022',
    expiryDate: '11 Jul 2028',
    daysUntilExpiry: 640,
    isExpiringSoon: false,
    issuingAuthority: 'Social Justice & Empowerment Department',
    qrToken: 'SOCJUST-CERT-9092',
    docSize: '480 KB',
    extractedDetails: {
      'Community': 'Patidar / OBC recognized list',
      'Creamy Layer': 'Excluded'
    }
  },
  {
    id: 'doc-rejected-income',
    title: 'Previous Domicile & Income Declaration (2018)',
    docType: 'Income Certificate',
    docNumber: 'INC/2018/OLD/9041',
    verifiedStatus: 'rejected',
    rejectionReason: 'Certificate validity exceeded 3-year statutory window under Revenue Dept guidelines. Please obtain a fresh e-District certificate via MeeSeva or Ward Sachivalayam.',
    issuedDate: '10 Jan 2018',
    expiryDate: 'Expired 31 Mar 2021',
    daysUntilExpiry: 0,
    isExpiringSoon: false,
    issuingAuthority: 'Revenue Department (Legacy System)',
    qrToken: 'EXPIRED-LEGACY-REV-001',
    docSize: '410 KB',
    extractedDetails: {
      'Audit Status': 'Rejected on automated verification',
      'Action Required': 'Apply for renewal certificate'
    }
  },
  {
    id: 'doc-pending-udid',
    title: 'UDID Disability / Medical Board Card Request',
    docType: 'Caste Certificate',
    docNumber: 'UDID/APP/2026/89412',
    verifiedStatus: 'pending',
    issuedDate: '03 Oct 2026',
    expiryDate: 'Under Medical Board Review',
    daysUntilExpiry: 999,
    isExpiringSoon: false,
    issuingAuthority: 'Department of Empowerment of Persons with Disabilities',
    qrToken: 'PENDING-CIVIL-HOSPITAL-VERIFY',
    docSize: '620 KB',
    extractedDetails: {
      'Application Status': 'Biometrics submitted; awaiting CMO desk inspection',
      'Hospital Desk': 'District Government Civil Hospital'
    }
  }
];

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'scheme-pm-kisan',
    code: 'PM-KISAN-01',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    level: 'Central',
    shortDescription: 'Income support of ₹6,000 per year in three 4-monthly installments directly transferred to bank accounts.',
    fullDescription: 'Under the PM-KISAN scheme, all landholding farmer families who have cultivable land holding up to 2 hectares in their names are provided financial support of ₹6,000 per year, paid in three equal installments of ₹2,000 each every 4 months via Direct Benefit Transfer (DBT).',
    benefitHighlight: '₹6,000 / year Direct Cash Transfer',
    financialAssistanceAmount: 6000,
    benefitType: 'Direct Cash Transfer',
    eligibilityRules: {
      minAge: 18,
      maxAge: 75,
      allowedOccupations: ['Farmer'],
      allowedLandHolding: ['< 1 Hectare', '1 - 2 Hectares'],
      maxIncome: 300000,
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Land Records (7/12)', 'Bank Passbook'],
    applicationDeadline: 'Open Round the Year',
    processingDays: 7,
    officialPortalUrl: 'https://pmkisan.gov.in',
    tags: ['Farmers', 'Direct DBT', 'Crop Support', 'No Collateral']
  },
  {
    id: 'scheme-pmjay',
    code: 'PM-JAY-02',
    title: 'Ayushman Bharat (PM-JAY)',
    titleHindi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'Healthcare',
    level: 'Central',
    shortDescription: 'Free cashless health cover of up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.',
    fullDescription: 'Ayushman Bharat PM-JAY is the world’s largest health assurance scheme aimed at providing a health cover of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries). Provides cashless treatment across 28,000+ public and private empanelled hospitals.',
    benefitHighlight: '₹5,00,000 / year Cashless Hospitalization Cover',
    financialAssistanceAmount: 500000,
    benefitType: 'Health Insurance',
    eligibilityRules: {
      minAge: 0,
      maxAge: 100,
      requiresBPL: true,
      maxIncome: 250000,
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Ration Card'],
    applicationDeadline: 'Always Active',
    processingDays: 3,
    officialPortalUrl: 'https://pmjay.gov.in',
    tags: ['Health', 'Cashless Hospital', 'BPL', 'Family Cover']
  },
  {
    id: 'scheme-pmay',
    code: 'PMAY-G-03',
    title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin)',
    titleHindi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    ministry: 'Ministry of Rural Development',
    category: 'Housing',
    level: 'Central',
    shortDescription: 'Financial assistance of ₹1,20,000 (plains) to ₹1,30,000 (hilly) for construction of a pucca house with basic amenities.',
    fullDescription: 'PMAY-G aims to provide pucca houses with clean cooking fuel, electricity, water, and sanitation to all houseless families and those living in kutcha and dilapidated houses in rural areas. Financial assistance is directly credited to beneficiary accounts in phased construction installments.',
    benefitHighlight: '₹1,20,000 Direct Construction Assistance + Swachh Bharat Toilet Grant',
    financialAssistanceAmount: 120000,
    benefitType: 'Direct Cash Transfer',
    eligibilityRules: {
      minAge: 21,
      maxAge: 70,
      requiresBPL: true,
      maxIncome: 200000,
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Income Certificate', 'Bank Passbook', 'Ration Card'],
    applicationDeadline: 'Open',
    processingDays: 21,
    officialPortalUrl: 'https://pmayg.nic.in',
    tags: ['Pucca House', 'Rural Housing', 'BPL', 'Sanitation']
  },
  {
    id: 'scheme-nsp-postmatric',
    code: 'NSP-SCHOLAR-04',
    title: 'National Post-Matric Scholarship Scheme',
    titleHindi: 'राष्ट्रीय उत्तर-मैट्रिक छात्रवृत्ति योजना',
    ministry: 'Ministry of Social Justice & Empowerment',
    category: 'Education',
    level: 'Central',
    shortDescription: '100% tuition fee reimbursement plus annual maintenance allowance up to ₹50,000 for higher secondary & college students.',
    fullDescription: 'Provides financial assistance to eligible students from economically weaker and marginalized communities studying in Class 11, Class 12, undergraduate, postgraduate, and professional degree programs. Covers complete compulsory non-refundable fees charged by recognized colleges/universities.',
    benefitHighlight: '₹50,000 / year Fee Waiver & Study Allowance',
    financialAssistanceAmount: 50000,
    benefitType: 'Tuition Subsidy',
    eligibilityRules: {
      minAge: 15,
      maxAge: 28,
      allowedOccupations: ['Student'],
      allowedCategories: ['SC', 'ST', 'OBC', 'EWS'],
      maxIncome: 250000,
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Income Certificate', 'Caste Certificate', 'Marksheet', 'Bank Passbook'],
    applicationDeadline: '31 December 2026',
    processingDays: 14,
    officialPortalUrl: 'https://scholarships.gov.in',
    tags: ['College', 'Tuition Waiver', 'Students', 'SC/ST/OBC/EWS']
  },
  {
    id: 'scheme-mudra',
    code: 'PMMY-05',
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना',
    ministry: 'Ministry of Finance',
    category: 'Financial & MSME',
    level: 'Central',
    shortDescription: 'Collateral-free micro loans from ₹50,000 up to ₹10,00,000 for starting or expanding micro-enterprises and small shops.',
    fullDescription: 'PMMY provides loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises without requiring any collateral or third-party guarantee. Offered in three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5,00,000), and Tarun (₹5,00,000 to ₹10,00,000) at low interest rates with quick processing.',
    benefitHighlight: 'Up to ₹10,00,000 Collateral-Free Business Credit',
    financialAssistanceAmount: 200000,
    benefitType: 'Subsidized Loan',
    eligibilityRules: {
      minAge: 18,
      maxAge: 65,
      allowedOccupations: ['Micro Entrepreneur', 'Rural Artisan / Daily Wage', 'Unemployed Youth'],
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'PAN Card', 'Bank Passbook'],
    applicationDeadline: 'Always Open',
    processingDays: 10,
    officialPortalUrl: 'https://mudra.org.in',
    tags: ['Zero Collateral', 'Shopkeepers', 'Start Business', 'Credit']
  },
  {
    id: 'scheme-vishwakarma',
    code: 'PM-VISHWAKARMA-06',
    title: 'PM Vishwakarma Kaushal Samman Yojana',
    titleHindi: 'प्रधानमंत्री विश्वकर्मा योजना',
    ministry: 'Ministry of Micro, Small & Medium Enterprises (MSME)',
    category: 'Financial & MSME',
    level: 'Central',
    shortDescription: 'Free modern toolkit grant of ₹15,000, skill training stipend of ₹500/day, and collateral-free enterprise loan at 5% interest.',
    fullDescription: 'Dedicated to uplifting traditional artisans and craftspeople working with their hands and traditional tools (such as carpenters, blacksmiths, goldsmiths, potters, sculptors, cobblers, tailors, weavers, basket makers). Beneficiaries receive official Vishwakarma Certificate, ID Card, basic & advanced training with daily stipend, toolkit incentive of ₹15,000, and up to ₹3,00,000 in credit support.',
    benefitHighlight: '₹15,000 Modern Toolkit Voucher + ₹3,00,000 Low-Interest Credit',
    financialAssistanceAmount: 15000,
    benefitType: 'Subsidized Loan',
    eligibilityRules: {
      minAge: 18,
      maxAge: 65,
      allowedOccupations: ['Rural Artisan / Daily Wage', 'Micro Entrepreneur'],
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Bank Passbook', 'Caste Certificate'],
    applicationDeadline: 'Open',
    processingDays: 7,
    officialPortalUrl: 'https://pmvishwakarma.gov.in',
    tags: ['Artisans', 'Craftsmen', 'Free Toolkit', 'Skill Training']
  },
  {
    id: 'scheme-sukanya',
    code: 'SSY-BETI-07',
    title: 'Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)',
    titleHindi: 'सुकन्या समृद्धि योजना',
    ministry: 'Ministry of Women and Child Development',
    category: 'Women & Child',
    level: 'Central',
    shortDescription: 'Highest government sovereign interest rate (8.2%) with full tax exemption under 80C for securing daughter’s higher education.',
    fullDescription: 'A government-backed small deposit scheme designed exclusively for a girl child. An account can be opened by natural/legal guardians in the name of a girl child from her birth till she attains 10 years of age. Offers highest sovereign guaranteed returns, sovereign backing, and triple-tax-exempt (EEE) status.',
    benefitHighlight: '8.2% Guaranteed Sovereign Return + Tax Exemption',
    benefitType: 'Direct Cash Transfer',
    eligibilityRules: {
      minAge: 0,
      maxAge: 35,
      genderAllowed: 'Female'
    },
    requiredDocuments: ['Aadhaar', 'Bank Passbook'],
    applicationDeadline: 'Open',
    processingDays: 2,
    officialPortalUrl: 'https://wcd.nic.in',
    tags: ['Girl Child', 'High Interest', 'Education Savings', 'Triple Tax Free']
  },
  {
    id: 'scheme-atal-pension',
    code: 'APY-PENSION-08',
    title: 'Atal Pension Yojana (APY)',
    titleHindi: 'अटल पेंशन योजना',
    ministry: 'Ministry of Finance',
    category: 'Social Welfare',
    level: 'Central',
    shortDescription: 'Guaranteed government monthly pension of ₹1,000 to ₹5,000 after age 60 for citizens working in unorganized sectors.',
    fullDescription: 'Atal Pension Yojana provides a guaranteed monthly pension to workers in the unorganized sector. The subscriber can choose a monthly pension between ₹1,000 and ₹5,000 starting from the age of 60 years. The central government guarantees the pension amount regardless of market returns.',
    benefitHighlight: '₹5,000 / month Guaranteed Monthly Pension for Life',
    financialAssistanceAmount: 5000,
    benefitType: 'Pension',
    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
      allowedOccupations: ['Farmer', 'Rural Artisan / Daily Wage', 'Micro Entrepreneur', 'Unemployed Youth'],
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Bank Passbook'],
    applicationDeadline: 'Open',
    processingDays: 3,
    officialPortalUrl: 'https://npscra.nsdl.co.in',
    tags: ['Pension', 'Retirement', 'Unorganized Workers', 'Guaranteed by Govt']
  },
  {
    id: 'scheme-pmsvanidhi',
    code: 'SVANIDHI-09',
    title: 'PM SVANidhi (Street Vendor’s AtmaNirbhar Nidhi)',
    titleHindi: 'पीएम स्वनिधि योजना',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Financial & MSME',
    level: 'Central',
    shortDescription: 'Working capital loan starting at ₹10,000 up to ₹50,000 with 7% interest subsidy & digital transaction cashback.',
    fullDescription: 'PM SVANidhi empowers street vendors to restart and expand their livelihoods. Initial tranche of ₹10,000 collateral-free working capital loan; upon timely repayment, second tranche of ₹20,000 and third tranche of ₹50,000 is sanctioned with 7% interest subsidy and ₹1,200/year cashback on UPI transactions.',
    benefitHighlight: '₹50,000 Working Capital + 7% Interest Subsidy & Digital Cashback',
    financialAssistanceAmount: 50000,
    benefitType: 'Subsidized Loan',
    eligibilityRules: {
      minAge: 18,
      maxAge: 65,
      allowedOccupations: ['Micro Entrepreneur', 'Rural Artisan / Daily Wage'],
      genderAllowed: 'All'
    },
    requiredDocuments: ['Aadhaar', 'Bank Passbook'],
    applicationDeadline: 'Open',
    processingDays: 5,
    officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in',
    tags: ['Street Vendors', 'UPI Cashback', 'Working Capital', 'Instant Sanction']
  },
  {
    id: 'scheme-state-kisan-sahay',
    code: 'STATE-KISAN-10',
    title: 'Mukhyamantri Kisan Sahay Yojana (State Relief & Subsidy)',
    titleHindi: 'मुख्यमंत्री किसान सहाय योजना',
    ministry: 'State Department of Agriculture',
    category: 'Agriculture',
    level: 'State',
    stateSpecific: 'Gujarat',
    shortDescription: 'State-sponsored 0-premium crop damage assistance of up to ₹20,000/hectare for drought, flood, or unseasonal rain.',
    fullDescription: 'A direct flagship state initiative covering farmers against severe natural calamities without paying any premium. In case of crop loss of 33% to 60%, financial assistance of ₹20,000 per hectare (up to 4 hectares) is directly credited to the beneficiary bank account without surveyor delays.',
    benefitHighlight: '₹20,000 / hectare Zero-Premium Disaster Relief',
    financialAssistanceAmount: 20000,
    benefitType: 'Direct Cash Transfer',
    eligibilityRules: {
      minAge: 18,
      maxAge: 75,
      allowedOccupations: ['Farmer'],
      allowedLandHolding: ['< 1 Hectare', '1 - 2 Hectares', '> 2 Hectares']
    },
    requiredDocuments: ['Aadhaar', 'Land Records (7/12)', 'Bank Passbook'],
    applicationDeadline: 'Open for Kharif & Rabi cycles',
    processingDays: 10,
    officialPortalUrl: 'https://ikhedut.gujarat.gov.in',
    tags: ['State Scheme', 'Crop Insurance', 'Zero Premium', 'Gujarat']
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-001',
    applicationId: 'SCH-2026-99412',
    schemeId: 'scheme-pm-kisan',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    schemeCategory: 'Agriculture',
    appliedDate: '12 Jan 2026',
    status: 'Disbursed',
    currentStage: 5,
    totalStages: 5,
    dbtAmount: 2000,
    dbtReferenceId: 'DBT/RBI/2026/99104882190',
    lastUpdated: '02 Feb 2026',
    isDemoRecord: true,
    attachedDocuments: ['Aadhaar Identification Card', 'Village Land Record (7/12 Extract & 8A)', 'Bank Passbook'],
    timeline: [
      {
        title: 'Application Submitted Online',
        date: '12 Jan 2026',
        completed: true,
        officerDesignation: 'Citizen Self-Service Portal'
      },
      {
        title: 'Aadhaar e-KYC & Land Verification',
        date: '16 Jan 2026',
        completed: true,
        officerDesignation: 'Taluka Revenue Officer (Borsad)',
        remarks: 'Land record 7/12 matched with AnyRoR portal data.'
      },
      {
        title: 'State Nodal Officer Approval',
        date: '22 Jan 2026',
        completed: true,
        officerDesignation: 'Dept of Agriculture, Govt of Gujarat',
        remarks: 'Verified eligible under Marginal Farmer guidelines.'
      },
      {
        title: 'PFMS Bank Mandate Sanctioned',
        date: '28 Jan 2026',
        completed: true,
        officerDesignation: 'Public Financial Management System'
      },
      {
        title: 'Direct Benefit Transfer (DBT) Disbursed',
        date: '02 Feb 2026',
        completed: true,
        officerDesignation: 'Reserve Bank of India (RBI DBT Engine)',
        remarks: '₹2,000 credited to SBI A/C ending in 4092. UTR: 202699104882190.'
      }
    ]
  },
  {
    id: 'app-002',
    applicationId: 'SCH-2026-44189',
    schemeId: 'scheme-pmjay',
    schemeTitle: 'Ayushman Bharat (PM-JAY Golden Card)',
    schemeCategory: 'Healthcare',
    appliedDate: '24 Feb 2026',
    status: 'Document Verification',
    currentStage: 3,
    totalStages: 4,
    lastUpdated: '10 Mar 2026',
    isDemoRecord: true,
    attachedDocuments: ['Aadhaar Identification Card', 'National Food Security (NFSA) Ration Card'],
    timeline: [
      {
        title: 'Online Request for e-Golden Card',
        date: '24 Feb 2026',
        completed: true,
        officerDesignation: 'Schematrix Digital Desk'
      },
      {
        title: 'NFSA Ration Database Match',
        date: '01 Mar 2026',
        completed: true,
        officerDesignation: 'State Health Agency (SHA)',
        remarks: 'Family unit verified under Antyodaya/BPL register.'
      },
      {
        title: 'District Hospital Verification',
        date: '08 Mar 2026',
        completed: false,
        current: true,
        officerDesignation: 'Ayushman Mitra Desk, Anand Civil Hospital',
        remarks: 'Under final digital biometric verification queue.'
      },
      {
        title: 'Ayushman Card Generated & DigiLocker Delivery',
        date: 'Pending',
        completed: false,
        officerDesignation: 'National Health Authority'
      }
    ]
  },
  {
    id: 'app-003',
    applicationId: 'PMV-2026-MSME-10294',
    schemeId: 'scheme-vishwakarma',
    schemeTitle: 'PM Vishwakarma Toolkit & Skill Enterprise Grant',
    schemeCategory: 'Financial & MSME',
    appliedDate: '06 Oct 2026',
    status: 'Submitted',
    currentStage: 1,
    totalStages: 4,
    lastUpdated: '08 Oct 2026, 11:45 AM',
    isDemoRecord: true,
    attachedDocuments: ['Aadhaar Identification Card', 'Bank Passbook', 'Skill / Trade Affirmation'],
    timeline: [
      {
        title: 'Application Submitted via Citizen Portal',
        date: '06 Oct 2026',
        completed: true,
        officerDesignation: 'Citizen Digital Self-Service',
        remarks: 'Digital acknowledgment generated. Forwarded to Gram Panchayat / Ward Committee.'
      },
      {
        title: 'Gram Panchayat / ULB Verification',
        date: 'Pending',
        completed: false,
        current: true,
        officerDesignation: 'Ward Executive Officer & VLE',
        remarks: 'Physical trade verification scheduled within 7 working days.'
      },
      {
        title: 'District Implementation Committee (DIC) Screening',
        date: 'Pending',
        completed: false,
        officerDesignation: 'General Manager, District Industries Centre'
      },
      {
        title: 'Toolkit Voucher (₹15,000 e-RUPI) Sanctioned',
        date: 'Pending',
        completed: false,
        officerDesignation: 'Ministry of MSME'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'DBT Installment Credited',
    message: '₹2,000 has been credited to your Aadhaar-linked Bank Account under PM-KISAN 17th Installment.',
    type: 'dbt_credit',
    timestamp: '2 hours ago',
    isRead: false,
    schemeId: 'scheme-pm-kisan'
  },
  {
    id: 'notif-2',
    title: 'New Welfare Match Available',
    message: 'Based on your recent profile, you are 100% eligible for Mukhyamantri Kisan Sahay Yojana (₹20,000/hectare relief).',
    type: 'new_scheme',
    timestamp: 'Yesterday',
    isRead: false,
    schemeId: 'scheme-state-kisan-sahay'
  },
  {
    id: 'notif-3',
    title: 'DigiLocker Document Verification',
    message: 'Your Land Records (7/12 Extract) have been digitally validated by the Revenue Department with tamper-proof seal.',
    type: 'doc_alert',
    timestamp: '3 days ago',
    isRead: true
  }
];

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv-01',
    ticketNumber: 'GRV/2026/89401',
    applicationId: 'SCH-2026-44189',
    schemeTitle: 'Ayushman Bharat (PM-JAY Golden Card)',
    subject: 'Verification pending at District Civil Hospital desk for over 10 days',
    description: 'All documents including Ration card and Aadhaar are valid in Schematrix vault. Requesting expedited approval of Ayushman Golden Card.',
    status: 'In Review',
    filedDate: '02 Mar 2026',
    officerAssigned: 'District Grievance Redressal Officer, Anand',
    expectedResolutionDays: 3
  }
];

export const INITIAL_SERVICE_CENTERS: CitizenServiceCenter[] = [
  {
    id: 'center-1',
    name: 'MeeSeva Citizen Service Center - Gajuwaka',
    nameTelugu: 'మీసేవ పౌర సేవా కేంద్రం - గాజువాక',
    type: 'MeeSeva',
    address: 'Near Old Bus Stand, Gajuwaka Main Road',
    mandal: 'Gajuwaka',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530026',
    distanceKm: 1.4,
    contactPhone: '+91 891 2514092',
    timings: '09:00 AM - 06:00 PM (Mon-Sat)',
    officerInCharge: 'K. Venkateswara Rao (Center In-Charge)',
    servicesOffered: [
      'Aadhaar e-KYC Update',
      'Income Certificate Renewal',
      'Rythu Bharosa / PM-KISAN Seeding',
      'Caste & Nativity Certificate',
      'Ration Card NFSA Splitting'
    ]
  },
  {
    id: 'center-2',
    name: 'Grama / Ward Sachivalayam - Ward 14',
    nameTelugu: 'వార్డు సచివాలయం - వార్డు 14',
    type: 'Sachivalayam',
    address: 'Opposite Municipal High School, Seethammadhara',
    mandal: 'Visakhapatnam Urban',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530013',
    distanceKm: 2.8,
    contactPhone: '+91 891 2788910',
    timings: '10:00 AM - 05:00 PM (Govt Working Days)',
    officerInCharge: 'P. Lakshmi Narayana (Welfare Assistant)',
    servicesOffered: [
      'Welfare Schemes Physical Verification',
      'Pension Kanuka Assistance',
      'Aadhaar Card Biometrics',
      'Grievance Redressal (Spandana / CPGRAMS)'
    ]
  },
  {
    id: 'center-3',
    name: 'MeeSeva Digital Center - Warangal Fort',
    nameTelugu: 'మీసేవ డిజిటల్ కేంద్రం - వరంగల్ ఫోర్ట్',
    type: 'MeeSeva',
    address: 'Station Road, Beside Head Post Office',
    mandal: 'Warangal',
    district: 'Warangal',
    state: 'Telangana',
    pincode: '506002',
    distanceKm: 1.8,
    contactPhone: '+91 870 2445891',
    timings: '09:30 AM - 06:30 PM (Mon-Sat)',
    officerInCharge: 'M. Sridhar Reddy',
    servicesOffered: [
      'Rythu Bandhu Account Seeding',
      'Kalyana Lakshmi Application Filing',
      'EWS / Caste Verification',
      'Student Scholarship Endorsement'
    ]
  },
  {
    id: 'center-4',
    name: 'Taluka Mamlatdar & e-District Seva Sadan',
    nameTelugu: 'తాలూకా రెవెన్యూ & ఈ-సేవ సదన్',
    type: 'Tahsildar Office',
    address: 'Near Old Court Building, Borsad Taluka',
    mandal: 'Borsad',
    district: 'Anand',
    state: 'Gujarat',
    pincode: '388540',
    distanceKm: 3.2,
    contactPhone: '+91 2692 221040',
    timings: '10:30 AM - 05:30 PM (Weekdays)',
    officerInCharge: 'B. M. Solanki (Executive Magistrate)',
    servicesOffered: [
      'AnyRoR 7/12 Land Records Attestation',
      'PM-KISAN Physical Land Registry Verification',
      'Non-Creamy Layer OBC Issuance',
      'Stamp Duty & Domicile Endorsement'
    ]
  },
  {
    id: 'center-5',
    name: 'CSC Digital Seva Kendra - Connaught Place',
    nameTelugu: 'సి.ఎస్.సి డిజిటల్ సేవా కేంద్రం',
    type: 'CSC',
    address: 'Block B, Inner Circle, Connaught Place',
    mandal: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi',
    pincode: '110001',
    distanceKm: 4.1,
    contactPhone: '+91 11 23412090',
    timings: '09:00 AM - 07:00 PM',
    officerInCharge: 'Sunil Verma (CSC VLE)',
    servicesOffered: [
      'PM SVANidhi Vendor Registration',
      'Mudra Loan Application Facilitation',
      'Ayushman Bharat PVC Card Printing',
      'DigiLocker Assisted Desk'
    ]
  }
];
