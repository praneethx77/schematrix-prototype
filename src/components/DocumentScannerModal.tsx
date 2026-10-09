import React, { useState } from 'react';
import { 
  X, 
  ScanLine, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  Camera,
  RefreshCw
} from 'lucide-react';
import { DocumentItem, CitizenProfile } from '../types';

interface DocumentScannerModalProps {
  profile: CitizenProfile;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
}

interface SampleCert {
  title: string;
  docType: DocumentItem['docType'];
  docNumber: string;
  authority: string;
  size: string;
  sampleDetails: Record<string, string>;
}

const SAMPLE_CERTIFICATES: SampleCert[] = [
  {
    title: 'Disability Certificate (UDID)',
    docType: 'Caste Certificate',
    docNumber: 'UDID-GJ-8820419',
    authority: 'Department of Empowerment of Persons with Disabilities',
    size: '890 KB',
    sampleDetails: {
      'Disability Type': 'Locomotor (45%)',
      'Valid Till': 'Permanent',
      'Medical Board': 'Civil Hospital Anand'
    }
  },
  {
    title: 'Domicile / Residence Certificate',
    docType: 'Income Certificate',
    docNumber: 'DOM-GJ-2024-9102',
    authority: 'Office of the District Magistrate & Collector',
    size: '640 KB',
    sampleDetails: {
      'Domicile State': 'Gujarat',
      'Period of Stay': '25+ Years',
      'Verification': 'Verified via Electoral Roll'
    }
  },
  {
    title: 'Degree & Marksheet Certificate',
    docType: 'Marksheet',
    docNumber: 'CBSE-XII-2024-8841',
    authority: 'Central Board of Secondary Education (CBSE)',
    size: '720 KB',
    sampleDetails: {
      'Roll Number': '1294821',
      'Passing Year': '2024',
      'Aggregate Score': '84.6% Distinction'
    }
  }
];

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  profile,
  onClose,
  onDocumentAdded
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_CERTIFICATES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'select' | 'scanning' | 'verified'>('select');
  const [verifiedPayload, setVerifiedPayload] = useState<DocumentItem | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setScanStep('scanning');

    // Simulate OCR Laser Processing
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: selectedTemplate.title,
        docType: selectedTemplate.docType,
        docNumber: selectedTemplate.docNumber,
        verifiedStatus: 'verified',
        issuedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        issuingAuthority: selectedTemplate.authority,
        qrToken: `SCHEMATRIX-OCR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        docSize: selectedTemplate.size,
        extractedDetails: {
          'Holder Name': profile.name,
          ...selectedTemplate.sampleDetails
        }
      };

      setVerifiedPayload(newDoc);
      setIsScanning(false);
      setScanStep('verified');
    }, 1800);
  };

  const handleSaveToVault = () => {
    if (verifiedPayload) {
      onDocumentAdded(verifiedPayload);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Smart OCR Scanner
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            AI Automated Document Verification
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Extracts name, UID, issuer seal, and cryptographically checks against central state registries.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {scanStep === 'select' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-700">
                Choose a document to scan or verify into {profile.name}'s vault:
              </p>

              <div className="space-y-2.5">
                {SAMPLE_CERTIFICATES.map((cert) => (
                  <div
                    key={cert.title}
                    onClick={() => setSelectedTemplate(cert)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedTemplate.title === cert.title
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        selectedTemplate.title === cert.title
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{cert.title}</p>
                        <p className="text-[11px] text-slate-500">{cert.authority}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {cert.docNumber}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upload Dropzone Simulation */}
              <div 
                onClick={startScan}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-800">
                  Click to start Camera / File OCR Scan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PDF, JPEG, or DigiLocker XML token supported
                </p>
              </div>
            </div>
          )}

          {scanStep === 'scanning' && (
            <div className="py-8 text-center space-y-4">
              {/* Laser Scanning Graphic */}
              <div className="relative w-48 h-32 mx-auto rounded-xl border-2 border-blue-400 bg-blue-950/90 overflow-hidden shadow-inner flex items-center justify-center">
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                <div className="text-center text-blue-200 text-xs font-mono space-y-1">
                  <ScanLine className="w-8 h-8 mx-auto text-blue-300 animate-pulse" />
                  <p>OCR PARSING ACTIVE</p>
                  <p className="text-[10px] text-emerald-400">Verifying PKI signature...</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Scanning {selectedTemplate.title}...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comparing document credentials against official state department databases.
                </p>
              </div>
            </div>
          )}

          {scanStep === 'verified' && verifiedPayload && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Cryptographically Verified (Score: 99.2%): </span>
                  Issuer authenticity confirmed. Matching citizen: {profile.name}.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Title:</span>
                  <span className="font-bold text-slate-800">{verifiedPayload.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document ID:</span>
                  <span className="font-mono font-bold text-slate-900">{verifiedPayload.docNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Digital Seal:</span>
                  <span className="font-mono text-emerald-700 font-bold">{verifiedPayload.qrToken}</span>
                </div>
                {verifiedPayload.extractedDetails && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    {Object.entries(verifiedPayload.extractedDetails).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-semibold text-slate-700">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>

          {scanStep === 'select' && (
            <button
              onClick={startScan}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Start Scan & Verification</span>
            </button>
          )}

          {scanStep === 'verified' && (
            <button
              onClick={handleSaveToVault}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Add to DigiLocker Vault</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
