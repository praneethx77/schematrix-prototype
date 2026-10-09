import React, { useState } from 'react';
import { 
  X, 
  MessageSquareWarning, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { ApplicationRecord, GrievanceTicket, CitizenProfile } from '../types';

interface GrievanceModalProps {
  application: ApplicationRecord | null;
  profile: CitizenProfile;
  onClose: () => void;
  onSubmitGrievance: (ticket: GrievanceTicket) => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  application,
  profile,
  onClose,
  onSubmitGrievance
}) => {
  if (!application) return null;

  const [subject, setSubject] = useState('Scrutiny delayed beyond standard SLA timeframe');
  const [description, setDescription] = useState(
    `Application has been under scrutiny stage for more than 10 business days. All documents in Schematrix DigiLocker vault are validated. Requesting departmental inspection and prompt DBT clearance.`
  );
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: GrievanceTicket = {
      id: `grv-${Date.now()}`,
      ticketNumber: `GRV/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      applicationId: application.applicationId,
      schemeTitle: application.schemeTitle,
      subject,
      description,
      status: 'Open',
      filedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      officerAssigned: 'District Grievance Redressal Officer (CPGRAMS)',
      expectedResolutionDays: 3
    };

    onSubmitGrievance(newTicket);
    setSubmittedTicket(newTicket);
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
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-400/20 flex items-center gap-1">
              <MessageSquareWarning className="w-3 h-3" />
              Direct Redressal Desk
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            File Citizen Grievance & Escalation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            CPGRAMS integrated ticketing for {application.schemeTitle}.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {!submittedTicket ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Linked Application</span>
                <p className="font-bold text-slate-800">{application.schemeTitle}</p>
                <p className="font-mono text-slate-500 text-[11px]">{application.applicationId}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Scrutiny delayed beyond standard SLA timeframe">Scrutiny delayed beyond standard SLA timeframe</option>
                  <option value="Direct Benefit Transfer (DBT) payment not credited to bank">Direct Benefit Transfer (DBT) payment not credited to bank</option>
                  <option value="Field inspection officer not visited">Field inspection officer not visited</option>
                  <option value="Clarification required on document rejection">Clarification required on document rejection</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Explanation</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Statutory 72-hour Service Level Agreement applies under Citizen Charter.</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Formal Grievance</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Grievance Lodged Successfully
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your ticket has been assigned to <strong className="text-slate-800">{submittedTicket.officerAssigned}</strong>.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-xs mx-auto text-left space-y-1 font-mono text-[11px]">
                <p><span className="text-slate-400">Ticket ID:</span> <strong className="text-slate-900">{submittedTicket.ticketNumber}</strong></p>
                <p><span className="text-slate-400">SLA Window:</span> <strong className="text-emerald-700">{submittedTicket.expectedResolutionDays} Working Days</strong></p>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
              >
                Close Desk
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
