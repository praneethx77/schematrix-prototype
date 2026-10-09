import React from 'react';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  UserCheck, 
  Bell, 
  Eye, 
  Sparkles,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { CitizenProfile } from '../types';

interface NavbarProps {
  currentProfile: CitizenProfile;
  personas: CitizenProfile[];
  onSelectPersona: (persona: CitizenProfile) => void;
  onOpenProfileEditor: () => void;
  isSeniorMode: boolean;
  onToggleSeniorMode: () => void;
  isMobileDeviceView: boolean;
  onToggleDeviceView: () => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAISahayak: () => void;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिन्दी' },
  { code: 'Tamil', label: 'தமிழ்' },
  { code: 'Telugu', label: 'తెలుగు' },
  { code: 'Bengali', label: 'বাংলা' },
  { code: 'Gujarati', label: 'ગુજરાતી' },
  { code: 'Marathi', label: 'मराठी' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  personas,
  onSelectPersona,
  onOpenProfileEditor,
  isSeniorMode,
  onToggleSeniorMode,
  isMobileDeviceView,
  onToggleDeviceView,
  selectedLanguage,
  onSelectLanguage,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAISahayak
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Gov Header Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-100">SCHEMATRIX</span>
          <span className="hidden sm:inline text-slate-400">| Unified Digital Gateway for Citizen Government Services & DBT</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Senior / Easy Mode Toggle */}
          <button
            onClick={onToggleSeniorMode}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors font-medium ${
              isSeniorMode 
                ? 'bg-amber-400 text-amber-950 font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Simplified high-contrast display for senior citizens and rural users"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isSeniorMode ? 'Senior/Rural Mode: Active' : 'Senior / Rural Mode'}</span>
          </button>

          {/* Device Preview Mode Switch */}
          <button
            onClick={onToggleDeviceView}
            className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle between Mobile App shell view and Full Desktop layout"
          >
            {isMobileDeviceView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile App View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-blue-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-blue-900/10 border border-blue-400/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                SCHEMATRIX
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                GovTech 3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              One Nation • One Digital Service Platform
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border-0 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Persona Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-semibold px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-600" />
              Citizen Persona:
            </span>
            <select
              value={currentProfile.id}
              onChange={(e) => {
                const found = personas.find((p) => p.id === e.target.value);
                if (found) onSelectPersona(found);
              }}
              className="text-xs bg-white text-slate-800 font-semibold py-1 px-2.5 rounded-md border border-slate-300 shadow-2xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name} ({persona.occupation} • {persona.state})
                </option>
              ))}
            </select>
          </div>

          {/* AI Sahayak Direct Trigger Button */}
          <button
            onClick={onOpenAISahayak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-semibold shadow-xs shadow-blue-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Sahayak</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile & Parameter Quick Editor Trigger */}
          <button
            onClick={onOpenProfileEditor}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors"
            title="Edit profile & eligibility factors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
              {currentProfile.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentProfile.name}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {currentProfile.occupation}
              </p>
            </div>
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
