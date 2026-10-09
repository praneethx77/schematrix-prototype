import React from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  LayoutDashboard, 
  FolderKanban, 
  FileCheck2, 
  Clock, 
  Sparkles, 
  MapPin, 
  Smartphone, 
  Monitor 
} from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'schemes' | 'documents' | 'tracking' | 'centers' | 'ai-assistant';
  onNavigateTab: (tab: 'dashboard' | 'schemes' | 'documents' | 'tracking' | 'centers' | 'ai-assistant') => void;
  onToggleDeviceView: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  activeTab,
  onNavigateTab,
  onToggleDeviceView
}) => {
  return (
    <div className="py-6 px-2 sm:px-4 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-900/95">
      {/* Device Switcher Ribbon */}
      <div className="mb-4 flex items-center gap-3 bg-slate-800 text-slate-300 text-xs px-4 py-2 rounded-full border border-slate-700 shadow-lg">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <Smartphone className="w-3.5 h-3.5" />
          Flutter Cross-Platform Mobile App Simulation
        </span>
        <span className="text-slate-500">|</span>
        <button
          onClick={onToggleDeviceView}
          className="hover:text-white text-slate-300 font-medium underline underline-offset-2 flex items-center gap-1"
        >
          <Monitor className="w-3.5 h-3.5 text-sky-400" />
          Switch to Full Desktop View
        </button>
      </div>

      {/* Phone Hardware Mockup */}
      <div className="relative w-full max-w-[430px] h-[880px] bg-slate-950 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="w-28 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <span className="w-2 h-2 rounded-full bg-blue-500/40" />
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="h-8 pt-1 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-200 z-40 select-none bg-slate-900">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport with Scroll */}
        <div className="flex-1 bg-slate-50 overflow-y-auto scrollbar-none pb-20">
          <div className="p-3">
            {children}
          </div>
        </div>

        {/* Flutter Styled Bottom Navigation Bar */}
        <div className="absolute bottom-3 inset-x-3 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 rounded-b-[40px] px-1 flex items-center justify-around z-40 shadow-lg">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'dashboard' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            onClick={() => onNavigateTab('schemes')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'schemes' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span className="text-[9px]">Schemes</span>
          </button>

          {/* Center Floating AI Sahayak Button */}
          <button
            onClick={() => onNavigateTab('ai-assistant')}
            className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-700/30 border-2 border-white hover:scale-105 active:scale-95 transition-all"
            title="Ask AI Sahayak"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>

          <button
            onClick={() => onNavigateTab('centers')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'centers' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[9px]">Centers</span>
          </button>

          <button
            onClick={() => onNavigateTab('tracking')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === 'tracking' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[9px]">Track</span>
          </button>
        </div>

        {/* Home Indicator bar */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none z-50">
          <div className="w-32 h-1 bg-slate-400/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
