import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI Assistant endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { message, citizenProfile, schemeContext, language = 'English' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are 'Sahayak AI', the official citizen assistance engine on SCHEMATRIX - India's unified government services and welfare discovery platform.
The user profile is:
- Name: ${citizenProfile?.name || 'Citizen'}
- Age: ${citizenProfile?.age || 'Unspecified'}
- Occupation: ${citizenProfile?.occupation || 'Unspecified'}
- Annual Income: ₹${citizenProfile?.annualIncome || 'Unspecified'}
- Category: ${citizenProfile?.category || 'General'}
- State/UT: ${citizenProfile?.state || 'National'}
- Landholding: ${citizenProfile?.landholding || 'None'}
- Special attributes: ${citizenProfile?.isDisability ? 'Persons with Disability (PwD), ' : ''}${citizenProfile?.isBPL ? 'Below Poverty Line (BPL), ' : ''}${citizenProfile?.gender || 'All'}

CRITICAL TRUST & INTEGRITY GUIDELINES:
1. Ground your answers strictly in authentic Indian Central and State government welfare schemes (PM-KISAN, Rythu Bharosa, Ayushman Bharat PM-JAY, PMAY, Mudra, Post-Matric Scholarships, PM Vishwakarma, Kalyana Lakshmi, Sukanya Samriddhi).
2. CLEARLY DISTINGUISH VERIFIED INFORMATION FROM UNCERTAIN INFORMATION:
   - Format established, gazetted criteria with: **[VERIFIED OFFICIAL RULE]**
   - Format localized, state-discretionary, or changing deadlines/budget quotas with: **[SUBJECT TO LOCAL VERIFICATION]**
   - NEVER guarantee scheme eligibility or funds disbursement. State clearly that final approval rests with the respective verification officer / department.
3. Language: Respond in ${language} (if Telugu or Hindi is requested, provide authentic, clear regional language with key technical terms in English/Telugu).
4. Be concise, respectful, and citizen-friendly.`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nCitizen Query: "${message}"\n\n${schemeContext ? `Active Scheme Being Viewed: ${JSON.stringify(schemeContext)}` : ''}`
        });

        const reply = response.text || 'I could not generate an answer right now. Please try asking again.';
        return res.json({ reply, source: 'gemini' });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local knowledge engine:', geminiError);
      }
    }

    // Knowledge-base fallback responses
    const lower = message.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('agriculture') || lower.includes('land') || lower.includes('రైతు')) {
      if (language === 'Telugu') {
        fallbackReply = `🌾 **వ్యవసాయ సంక్షేమ పథకాలు (PM-KISAN & వై.ఎస్.ఆర్ రైతు భరోసా)**:
- **[ధృవీకరించబడిన అధికారిక నిబంధన (VERIFIED)]**: అర్హులైన చిన్న/సన్నకారు రైతులకు సంవత్సరానికి ₹6,000 కేంద్ర వాటా (3 విడతలలో ₹2,000 చొప్పున) ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతాకు నేరుగా జమ చేయబడుతుంది.
- **[స్థానిక పరిశీలనకు లోబడి (SUBJECT TO VERIFICATION)]**: ఆంధ్రప్రదేశ్‌లో రైతు భరోసాతో కలిపి మొత్తం ₹13,500 వరకు అందుతుంది. 2 హెక్టార్ల లోపు సాగుభూమి కలిగి ఉండాలి.
- **కావలసిన పత్రాలు**: ఆధార్ కార్డ్, పట్టాదారు పాస్ పుస్తకం (1-B / అడంగల్), బ్యాంక్ పాస్‌బుక్.
- **ముఖ్య గమనిక**: తుది మంజూరు గ్రామ వ్యవసాయ సహాయకులు (VAA) క్షేత్రస్థాయి పరిశీలనపై ఆధారపడి ఉంటుంది. అర్హత ఎప్పుడూ ముందస్తు హామీ ఇవ్వబడదు.`;
      } else {
        fallbackReply = `🌾 **Agricultural Welfare Support (PM-KISAN & Rythu Bharosa)**:
- **[VERIFIED OFFICIAL RULE]**: ₹6,000 annually credited in 3 equal installments (₹2,000 each) via Direct Benefit Transfer (DBT) to Aadhaar-seeded accounts.
- **[SUBJECT TO LOCAL VERIFICATION]**: Eligible landholding is capped at 2 hectares. In states like Andhra Pradesh, additional state top-up (Rythu Bharosa) provides up to ₹13,500 total, subject to active e-Panta land portal entry.
- **Required Documents**: Aadhaar Card, Land Ownership Records (1-B/7-12 extract), and Bank Passbook.
- **Disclaimer**: Schematrix provides preliminary advisory matching; final disbursement is never guaranteed and requires Village Revenue / Agriculture Officer clearance.`;
      }
    } else if (lower.includes('health') || lower.includes('ayushman') || lower.includes('medical') || lower.includes('hospital') || lower.includes('ఆరోగ్య') || lower.includes('ఆయుష్మాన్')) {
      if (language === 'Telugu') {
        fallbackReply = `🏥 **ఆరోగ్య భరోసా (ఆయుష్మాన్ భారత్ PM-JAY & ఆరోగ్యశ్రీ)**:
- **[ధృవీకరించబడిన అధికారిక నిబంధన (VERIFIED)]**: నిరుపేద కుటుంబాలకు ద్వితీయ మరియు తృతీయ చికిత్సల కోసం సంవత్సరానికి గరిష్టంగా ₹5,00,000 వరకు ఉచిత నగదు రహిత ఆసుపత్రి కవరేజ్.
- **[స్థానిక పరిశీలనకు లోబడి (SUBJECT TO VERIFICATION)]**: రేషన్ కార్డు (NFSA) లేదా SECC 2011 డేటాబేస్‌లో కుటుంబం నమోదై ఉండాలి. నెట్‌వర్క్ ఆసుపత్రులలో మాత్రమే వర్తిస్తుంది.
- **కావలసిన పత్రాలు**: బియ్యం కార్డు / ఆహార భద్రత కార్డు, ఆధార్ కార్డు.`;
      } else {
        fallbackReply = `🏥 **Healthcare Assurance (Ayushman Bharat PM-JAY)**:
- **[VERIFIED OFFICIAL RULE]**: Cashless health cover up to ₹5,00,000 per family per year for secondary & tertiary inpatient hospitalization across 28,000+ empanelled hospitals.
- **[SUBJECT TO LOCAL VERIFICATION]**: Beneficiary family must be indexed in SECC 2011 deprivation criteria or active NFSA BPL Ration Card lists. State coverage lists vary.
- **Required Proofs**: NFSA Ration Card, Aadhaar Card. Golden e-Card issued following district hospital biometric match.`;
      }
    } else if (lower.includes('student') || lower.includes('scholarship') || lower.includes('education') || lower.includes('college') || lower.includes('విద్యార్థి') || lower.includes('స్కాలర్‌షిప్')) {
      if (language === 'Telugu') {
        fallbackReply = `🎓 **జాతీయ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & విద్యా దీవెన**:
- **[ధృవీకరించబడిన అధికారిక నిబంధన (VERIFIED)]**: SC/ST/BC/EWS విద్యార్థులకు ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు మెయింటెనెన్స్ అలవెన్స్.
- **[స్థానిక పరిశీలనకు లోబడి (SUBJECT TO VERIFICATION)]**: తల్లిదండ్రుల వార్షిక ఆదాయం ₹2.5 లక్షల లోపు ఉండాలి. కనీసం 75% కళాశాల హాజరు తప్పనిసరి.
- **కావలసిన పత్రాలు**: మార్కుల పత్రం, ప్రస్తుత సంవత్సర ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, ఆధార్.`;
      } else {
        fallbackReply = `🎓 **National Post-Matric Scholarships & Educational Aid**:
- **[VERIFIED OFFICIAL RULE]**: Compulsory tuition fee waiver and monthly study maintenance allowance for higher secondary, college, and professional degree programs.
- **[SUBJECT TO LOCAL VERIFICATION]**: Family annual income must be under ₹2,50,000/year (for SC/ST/OBC/EWS). Institutional verification and minimum 75% biometric attendance required.
- **Required Proofs**: Previous marksheet, updated Income certificate (<6 months old), Caste certificate, Bonafide certificate.`;
      }
    } else if (lower.includes('loan') || lower.includes('business') || lower.includes('mudra') || lower.includes('startup') || lower.includes('artisan') || lower.includes('రుణం')) {
      fallbackReply = `💼 **Micro-Enterprise & Artisan Support (PMMY Mudra & PM Vishwakarma)**:
- **[VERIFIED OFFICIAL RULE]**: Collateral-free business credit under Shishu (up to ₹50,000), Kishore (up to ₹5 Lakhs), and Tarun (up to ₹10 Lakhs). PM Vishwakarma provides ₹15,000 free toolkit voucher.
- **[SUBJECT TO LOCAL VERIFICATION]**: Bank loan sanctions depend on credit score (CIBIL), project viability, and bank branch discretion. Eligibility matching does not guarantee bank sanction.
- **Required Proofs**: Aadhaar, PAN Card, Udyam Registration (for business), 6-month Bank statement.`;
    } else if (lower.includes('house') || lower.includes('awas') || lower.includes('home') || lower.includes('shelter') || lower.includes('ఇల్లు')) {
      fallbackReply = `🏠 **Housing Assistance (Pradhan Mantri Awas Yojana - PMAY)**:
- **[VERIFIED OFFICIAL RULE]**: Direct financial grant of ₹1,20,000 to ₹1,30,000 in rural areas for pucca house construction in phased milestone disbursements.
- **[SUBJECT TO LOCAL VERIFICATION]**: Applicant or family members must not own a pucca house anywhere in India. Subject to Gram Sabha priority waitlists and Geo-tagged verification.
- **Required Proofs**: Aadhaar of all family members, Bank passbook, Land possession certificate.`;
    } else {
      if (language === 'Telugu') {
        fallbackReply = `నమస్కారం! నేను స్కీమాట్రిక్స్ (SCHEMATRIX) ఏఐ సహాయక్‌ని:
- **[ధృవీకరించబడిన సమాచారం]**: మీ ప్రొఫైల్ ఆధారంగా మీరు అర్హులయ్యే సంక్షేమ పథకాలను గుర్తించగలను.
- **[ముఖ్య గమనిక]**: మా సిఫార్సులు ప్రాథమిక మార్గదర్శకత్వం మాత్రమే. ప్రభుత్వ నిబంధనల ప్రకారం తుది అర్హతను సంబంధిత శాఖాధికారులు మాత్రమే ఖరారు చేస్తారు.
- మీకు రైతు పథకాలు, ఆయుష్మాన్ భారత్, స్కాలర్‌షిప్‌లు లేదా ముద్ర రుణాల గురించి సమాచారం కావాలా?`;
      } else {
        fallbackReply = `Namaste! As your Schematrix AI Sahayak:
- **[VERIFIED OFFICIAL RULE]**: We cross-reference gazetted central and state government welfare eligibility criteria against your declared profile.
- **[SUBJECT TO LOCAL VERIFICATION]**: Notice: Schematrix provides preliminary assessment only. Sanctions, approvals, and fund transfers are never guaranteed and require departmental field verification.
- Would you like detailed criteria for agriculture (PM-KISAN/Rythu Bharosa), healthcare (Ayushman Bharat), scholarships, or business micro-credit?`;
      }
    }

    return res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (err: any) {
    console.error('Error in /api/ai-assistant:', err);
    return res.status(500).json({ error: 'Internal server error while answering query.' });
  }
});

// Document Verification Simulation API
app.post('/api/verify-document', async (req, res) => {
  try {
    const { docType, docNumber, citizenName } = req.body;
    // Simulate high-security automated cryptographic/API verification against government databases (UIDAI, NSDL, DigiLocker, Revenue Dept)
    const isValidNumber = Boolean(docNumber && docNumber.trim().length >= 4);

    return res.json({
      success: true,
      verificationStatus: isValidNumber ? 'VERIFIED' : 'ACTION_REQUIRED',
      verificationScore: isValidNumber ? 98.4 : 45.0,
      issuer: docType === 'Aadhaar' ? 'Unique Identification Authority of India (UIDAI)'
             : docType === 'PAN' ? 'Income Tax Department (NSDL/UTIITSL)'
             : docType === 'Ration Card' ? 'Department of Food & Public Distribution'
             : docType === 'Land Record' ? 'State Revenue & Land Records Portal'
             : 'Authorized State Issuing Authority',
      verifiedTimestamp: new Date().toISOString(),
      qrSignature: `SCHEMATRIX-VERIFIED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      metadataExtracted: {
        holderName: citizenName || 'Verified Citizen',
        documentId: docNumber || 'N/A',
        validity: 'Lifetime / Valid for Current FY'
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Verification failed' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Schematrix Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
