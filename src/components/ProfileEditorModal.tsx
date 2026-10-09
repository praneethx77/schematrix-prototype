import React, { useState } from 'react';
import { 
  X, 
  User, 
  SlidersHorizontal, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Briefcase,
  IndianRupee,
  Layers
} from 'lucide-react';
import { CitizenProfile, OccupationType, CategoryType, GenderType, LandHoldingType } from '../types';

interface ProfileEditorModalProps {
  profile: CitizenProfile;
  onClose: () => void;
  onSaveProfile: (updatedProfile: CitizenProfile) => void;
}

const INDIAN_STATES = [
  'Gujarat',
  'Uttar Pradesh',
  'Bihar',
  'Maharashtra',
  'Delhi',
  'Madhya Pradesh',
  'Rajasthan',
  'Tamil Nadu',
  'Karnataka',
  'West Bengal',
  'Andhra Pradesh',
  'Telangana',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Kerala'
];

const OCCUPATIONS: OccupationType[] = [
  'Farmer',
  'Student',
  'Rural Artisan / Daily Wage',
  'Micro Entrepreneur',
  'Unemployed Youth',
  'Salaried Worker',
  'Senior Citizen',
  'Homemaker'
];

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  profile,
  onClose,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<CitizenProfile>({ ...profile });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
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
              <SlidersHorizontal className="w-3 h-3" />
              Dynamic Eligibility Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Citizen Profile & Criteria Editor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify any demographic or financial parameter to see live re-computation of scheme eligibility across Central & State ministries.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                min={1}
                max={110}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900"
                required
              />
            </div>
          </div>

          {/* Gender & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Occupation / Livelihood</label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value as OccupationType })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
              >
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Annual Family Income Slider / Number */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Annual Household Income
              </label>
              <span className="font-mono font-extrabold text-blue-700 text-sm">
                ₹{formData.annualIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={30000}
              max={1200000}
              step={10000}
              value={formData.annualIncome}
              onChange={(e) => setFormData({ ...formData, annualIncome: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹30,000 (BPL)</span>
              <span>₹2.5 Lakhs (Scholarship Cap)</span>
              <span>₹12 Lakhs</span>
            </div>
          </div>

          {/* Category, State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Social Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">State / UT Domicile</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">District / Mandal</label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Visakhapatnam, Anand..."
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
                required
              />
            </div>
          </div>

          {/* Statutory Disclaimer - Never Guarantee Eligibility */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-950">
            <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">⚠️</span>
            <p className="leading-relaxed">
              <strong>Statutory Advisory:</strong> Schematrix calculates preliminary eligibility based on self-reported demographics. Final sanction, quota prioritization, and Direct Benefit Transfers (DBT) require formal verification by the block or district nodal authority. <em>Eligibility is never unconditionally guaranteed.</em>
            </p>
          </div>

          {/* Land Holding */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Cultivable Agricultural Landholding</label>
            <select
              value={formData.landholding}
              onChange={(e) => setFormData({ ...formData, landholding: e.target.value as LandHoldingType })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-white"
            >
              <option value="None">None (Landless / Urban / Non-Farmer)</option>
              <option value="< 1 Hectare">&lt; 1 Hectare (Marginal Farmer)</option>
              <option value="1 - 2 Hectares">1 - 2 Hectares (Small Farmer)</option>
              <option value="> 2 Hectares">&gt; 2 Hectares (Medium / Large Farmer)</option>
            </select>
          </div>

          {/* Vulnerability Checkboxes */}
          <div className="pt-2 space-y-2 border-t border-slate-200">
            <span className="font-bold text-slate-700 block">Special Classifications:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBPL}
                  onChange={(e) => setFormData({ ...formData, isBPL: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800 font-semibold">BPL / Ration Card Holder</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDisability}
                  onChange={(e) => setFormData({ ...formData, isDisability: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800 font-semibold">Differently Abled (PwD / UDID)</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Update Profile & Re-Evaluate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
