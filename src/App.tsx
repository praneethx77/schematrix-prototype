import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileCheck2, 
  Clock, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  Heart,
  MapPin
} from 'lucide-react';

import { 
  CitizenProfile, 
  Scheme, 
  DocumentItem, 
  ApplicationRecord, 
  NotificationItem, 
  GrievanceTicket,
  CitizenServiceCenter 
} from './types';
import { 
  INITIAL_PERSONAS, 
  INITIAL_DOCUMENTS, 
  SCHEMES_DATABASE, 
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_GRIEVANCES,
  INITIAL_SERVICE_CENTERS 
} from './data/initialData';
import { TRANSLATIONS } from './utils/translations';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SchemesCatalog } from './components/SchemesCatalog';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { ApplicationModal } from './components/ApplicationModal';
import { DocumentVault } from './components/DocumentVault';
import { DocumentScannerModal } from './components/DocumentScannerModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ServiceCentersView } from './components/ServiceCentersView';
import { AISahayakChat } from './components/AISahayakChat';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileEditorModal } from './components/ProfileEditorModal';
import { GrievanceModal } from './components/GrievanceModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schemes' | 'documents' | 'tracking' | 'centers' | 'ai-assistant'>('dashboard');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Core Data state
  const [personas, setPersonas] = useState<CitizenProfile[]>(INITIAL_PERSONAS);
  const [currentProfile, setCurrentProfile] = useState<CitizenProfile>(INITIAL_PERSONAS[0]);
  const [schemes, setSchemes] = useState<Scheme[]>(SCHEMES_DATABASE);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);
  const [serviceCenters, setServiceCenters] = useState<CitizenServiceCenter[]>(INITIAL_SERVICE_CENTERS);

  // Translations helper
  const t = TRANSLATIONS[selectedLanguage === 'Telugu' ? 'Telugu' : 'English'];

  // Modals state
  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState<Scheme | null>(null);
  const [selectedSchemeForApplication, setSelectedSchemeForApplication] = useState<Scheme | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedAppForGrievance, setSelectedAppForGrievance] = useState<ApplicationRecord | null>(null);

  // Handlers
  const handleSelectPersona = (persona: CitizenProfile) => {
    setCurrentProfile(persona);
    // Add toast or notification for persona switch
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Citizen Persona Switched',
        message: `Switched to ${persona.name} (${persona.occupation}, ${persona.state}). Scheme recommendations recalculated.`,
        type: 'new_scheme',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleUpdateDocumentStatus = (docId: string, status: DocumentItem['verifiedStatus']) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, verifiedStatus: status } : d))
    );
  };

  const handleSaveProfile = (updated: CitizenProfile) => {
    setCurrentProfile(updated);
    setPersonas((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Eligibility Factors Updated',
        message: `Updated income to ₹${updated.annualIncome.toLocaleString('en-IN')} and occupation to ${updated.occupation}. All scheme scores recomputed.`,
        type: 'new_scheme',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleDocumentAdded = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Document Verified in Vault',
        message: `${newDoc.title} verified with cryptographic seal (${newDoc.qrToken}). Ready for 1-click scheme linking.`,
        type: 'doc_alert',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmitApplication = (newApp: ApplicationRecord) => {
    setApplications((prev) => [newApp, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Application Submitted Successfully',
        message: `Tracking ID ${newApp.applicationId} for ${newApp.schemeTitle} is now under scrutiny.`,
        type: 'status_update',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleSubmitGrievance = (ticket: GrievanceTicket) => {
    setGrievances((prev) => [ticket, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Grievance Registered',
        message: `Ticket ${ticket.ticketNumber} registered under CPGRAMS. SLA response due within 3 days.`,
        type: 'status_update',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Render view content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            profile={currentProfile}
            schemes={schemes}
            documents={documents}
            applications={applications}
            onNavigateTab={setActiveTab}
            onSelectScheme={(scheme) => setSelectedSchemeForDetail(scheme)}
            onApplyScheme={(scheme) => setSelectedSchemeForApplication(scheme)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenAISahayak={() => setActiveTab('ai-assistant')}
            onOpenProfileEditor={() => setIsProfileEditorOpen(true)}
            isSeniorMode={isSeniorMode}
            selectedLanguage={selectedLanguage}
          />
        );
      case 'schemes':
        return (
          <SchemesCatalog
            profile={currentProfile}
            schemes={schemes}
            documents={documents}
            onSelectScheme={(scheme) => setSelectedSchemeForDetail(scheme)}
            onApplyScheme={(scheme) => setSelectedSchemeForApplication(scheme)}
            isSeniorMode={isSeniorMode}
            selectedLanguage={selectedLanguage}
          />
        );
      case 'documents':
        return (
          <DocumentVault
            documents={documents}
            profile={currentProfile}
            onOpenScanner={() => setIsScannerOpen(true)}
            onDeleteDocument={handleDeleteDocument}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            isSeniorMode={isSeniorMode}
          />
        );
      case 'tracking':
        return (
          <ApplicationTracker
            applications={applications}
            profile={currentProfile}
            onOpenGrievance={(app) => setSelectedAppForGrievance(app)}
            isSeniorMode={isSeniorMode}
          />
        );
      case 'centers':
        return (
          <ServiceCentersView
            centers={serviceCenters}
            selectedLanguage={selectedLanguage}
            isSeniorMode={isSeniorMode}
            onNavigateTab={setActiveTab}
          />
        );
      case 'ai-assistant':
        return (
          <AISahayakChat
            profile={currentProfile}
            currentSchemeContext={selectedSchemeForDetail}
            selectedLanguage={selectedLanguage}
            isSeniorMode={isSeniorMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Top Main Navigation Bar */}
      <Navbar
        currentProfile={currentProfile}
        personas={personas}
        onSelectPersona={handleSelectPersona}
        onOpenProfileEditor={() => setIsProfileEditorOpen(true)}
        isSeniorMode={isSeniorMode}
        onToggleSeniorMode={() => setIsSeniorMode(!isSeniorMode)}
        isMobileDeviceView={isMobileDeviceView}
        onToggleDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        unreadNotificationsCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAISahayak={() => setActiveTab('ai-assistant')}
      />

      {/* Main Container View (Either Mobile App Simulator or Full Desktop Dashboard) */}
      {isMobileDeviceView ? (
        <MobileFrameWrapper
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
          onToggleDeviceView={() => setIsMobileDeviceView(false)}
        >
          {renderTabContent()}
        </MobileFrameWrapper>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Statutory Advisory Notice Ribbon (Requirement: Never guarantee eligibility) */}
          <div className="bg-amber-50/90 border border-amber-300 p-3 sm:p-3.5 rounded-2xl flex items-start gap-3 shadow-2xs text-xs text-amber-950">
            <span className="text-amber-700 font-bold text-sm shrink-0 mt-0.5">⚠️</span>
            <p className="leading-relaxed">
              <strong>{selectedLanguage === 'Telugu' ? 'ముందస్తు సమాచార హెచ్చరిక: ' : 'Statutory Notice: '}</strong>
              {t.disclaimerBanner}
            </p>
          </div>

          {/* Desktop Secondary Sub-Nav Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.dashboardTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('schemes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'schemes'
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>{t.schemesTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{t.vaultTab}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                  {documents.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('tracking')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'tracking'
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t.trackingTab}</span>
                {applications.length > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                    {applications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('centers')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'centers'
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{t.centersTab}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  {serviceCenters.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ai-assistant')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'ai-assistant'
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.aiTab}</span>
              </button>
            </div>

            {/* Quick Helpline Info */}
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 pr-3">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Toll-Free: <strong>1800-11-2026</strong></span>
            </div>
          </div>

          {/* Active View Render */}
          {renderTabContent()}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                🇮🇳
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  SCHEMATRIX • Smart Unified Citizen Government Services Platform
                </p>
                <p className="text-[11px] text-slate-500">
                  Built to eliminate fragmented websites, streamline document verification, and deliver direct citizen welfare.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="hover:text-blue-600 cursor-pointer">Digital India Initiative</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer">DigiLocker Integration</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer">CPGRAMS Redressal</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 Schematrix Digital Architecture Prototype. Conforming to Web Content Accessibility Guidelines (WCAG 2.1) & GIGW.</p>
            <p className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for inclusive, transparent citizen service delivery.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {selectedSchemeForDetail && (
        <SchemeDetailModal
          scheme={selectedSchemeForDetail}
          profile={currentProfile}
          documents={documents}
          onClose={() => setSelectedSchemeForDetail(null)}
          onApply={(scheme) => {
            setSelectedSchemeForDetail(null);
            setSelectedSchemeForApplication(scheme);
          }}
          onAskAISahayak={(scheme) => {
            setSelectedSchemeForDetail(null);
            setActiveTab('ai-assistant');
          }}
        />
      )}

      {selectedSchemeForApplication && (
        <ApplicationModal
          scheme={selectedSchemeForApplication}
          profile={currentProfile}
          documents={documents}
          onClose={() => setSelectedSchemeForApplication(null)}
          onSubmitApplication={handleSubmitApplication}
          onNavigateToTracking={() => {
            setSelectedSchemeForApplication(null);
            setActiveTab('tracking');
          }}
        />
      )}

      {isScannerOpen && (
        <DocumentScannerModal
          profile={currentProfile}
          onClose={() => setIsScannerOpen(false)}
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      {isProfileEditorOpen && (
        <ProfileEditorModal
          profile={currentProfile}
          onClose={() => setIsProfileEditorOpen(false)}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onSelectNotificationScheme={(schemeId) => {
            const found = schemes.find((s) => s.id === schemeId);
            if (found) setSelectedSchemeForDetail(found);
          }}
        />
      )}

      {selectedAppForGrievance && (
        <GrievanceModal
          application={selectedAppForGrievance}
          profile={currentProfile}
          onClose={() => setSelectedAppForGrievance(null)}
          onSubmitGrievance={handleSubmitGrievance}
        />
      )}
    </div>
  );
}
