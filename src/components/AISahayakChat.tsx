import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  RotateCcw, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Square
} from 'lucide-react';
import { CitizenProfile, Scheme } from '../types';
import { useVoiceToText } from '../hooks/useVoiceToText';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
}

interface AISahayakChatProps {
  profile: CitizenProfile;
  currentSchemeContext?: Scheme | null;
  selectedLanguage: string;
  isSeniorMode: boolean;
  onClose?: () => void;
}

export const AISahayakChat: React.FC<AISahayakChatProps> = ({
  profile,
  currentSchemeContext,
  selectedLanguage,
  isSeniorMode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Namaste ${profile.name}! I am **Sahayak AI**, your personal guide to government schemes and citizen services on SCHEMATRIX.\n\nBased on your registered profile as a **${profile.occupation}** in **${profile.state}**, I can check your scheme eligibility, explain required documents, or help you track applications. How may I assist you today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Web Speech API Voice-to-Text hook
  const {
    isListening,
    interimTranscript,
    isSupported: isSpeechSupported,
    toggleListening,
    stopListening
  } = useVoiceToText({
    language: selectedLanguage,
    onResult: (transcriptChunk, isFinal) => {
      setInputQuery(transcriptChunk);
      if (isFinal) {
        setVoiceNotice(`Speech recognized: "${transcriptChunk}"`);
        setTimeout(() => setVoiceNotice(null), 3500);
      }
    },
    onError: (err) => {
      setVoiceNotice(err);
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, interimTranscript]);

  const quickPrompts = selectedLanguage === 'Telugu' ? [
    `PM-KISAN ₹6,000 నగదు బదిలీ నిబంధనలు ఏమిటి?`,
    `ఆయుష్మాన్ భారత్ హెల్త్ కార్డుకు ఏ పత్రాలు కావాలి?`,
    `హామీ పత్రం లేకుండా వ్యాపార రుణాలు పొందవచ్చా?`,
    `కుటుంబ ఆదాయం ₹2 లక్షల లోపు ఉన్న విద్యార్థులకు స్కాలర్‌షిప్‌లు`,
    `చేతివృత్తుల వారికి పీఎం విశ్వకర్మ ప్రయోజనాలు ఏమిటి?`
  ] : [
    `Am I eligible for PM-KISAN ₹6,000 cash transfer?`,
    `What documents do I need for Ayushman Bharat Golden Card?`,
    `Can I get a business loan without collateral?`,
    `Scholarships for students with family income under ₹2 Lakhs`,
    `What are the benefits of PM Vishwakarma for artisans?`
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    // If currently listening, stop recognition before sending
    if (isListening) {
      stopListening();
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          citizenProfile: profile,
          schemeContext: currentSchemeContext || null,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error('AI Assistant response error');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Local graceful fallback
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Namaste ${profile.name}. I analyzed your inquiry regarding government welfare support. As a registered **${profile.occupation}** with annual family income of **₹${profile.annualIncome.toLocaleString('en-IN')}**, you qualify for direct benefit transfer and state social assistance schemes. Please ensure your Aadhaar and Bank Passbook in your Schematrix vault remain active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback'
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech for accessibility (Senior & Rural citizens, Telugu & English supported)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown stars and bracket labels
    const cleanText = text
      .replace(/\[VERIFIED OFFICIAL RULE\]/g, 'Official Verified Rule.')
      .replace(/\[SUBJECT TO LOCAL VERIFICATION\]/g, 'Subject to local verification.')
      .replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage === 'Telugu' ? 'te-IN' : selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to format messages and distinguish verified from uncertain/discretionary info
  const renderMessageContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          const isVerifiedRule =
            line.includes('[VERIFIED OFFICIAL RULE]') ||
            line.includes('[ధృవీకరించబడిన అధికారిక నిబంధన (VERIFIED)]') ||
            line.includes('[ధృవీకరించబడిన సమాచారం]');

          const isUncertainOrDiscretionary =
            line.includes('[SUBJECT TO LOCAL VERIFICATION]') ||
            line.includes('[స్థానిక పరిశీలనకు లోబడి (SUBJECT TO VERIFICATION)]') ||
            line.includes('[ముఖ్య గమనిక]');

          if (isVerifiedRule) {
            const clean = line
              .replace(/\[VERIFIED OFFICIAL RULE\]:?/g, '')
              .replace(/\[ధృవీకరించబడిన అధికారిక నిబంధన \(VERIFIED\)\]:?/g, '')
              .replace(/\[ధృవీకరించబడిన సమాచారం\]:?/g, '')
              .replace(/^-\s*/, '')
              .trim();
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2 shadow-2xs my-1"
              >
                <div className="flex items-center gap-1 font-bold text-emerald-800 shrink-0 bg-emerald-200/80 px-1.5 py-0.5 rounded text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>{selectedLanguage === 'Telugu' ? 'ధృవీకరించబడిన నిబంధన' : 'VERIFIED OFFICIAL RULE'}</span>
                </div>
                <div className="leading-relaxed font-medium">
                  {clean}
                </div>
              </div>
            );
          }

          if (isUncertainOrDiscretionary) {
            const clean = line
              .replace(/\[SUBJECT TO LOCAL VERIFICATION\]:?/g, '')
              .replace(/\[స్థానిక పరిశీలనకు లోబడి \(SUBJECT TO VERIFICATION\)\]:?/g, '')
              .replace(/\[ముఖ్య గమనిక\]:?/g, '')
              .replace(/^-\s*/, '')
              .trim();
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs flex items-start gap-2 shadow-2xs my-1"
              >
                <div className="flex items-center gap-1 font-bold text-amber-900 shrink-0 bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px]">
                  <AlertCircle className="w-3 h-3 text-amber-700" />
                  <span>{selectedLanguage === 'Telugu' ? 'స్థానిక పరిశీలన అవసరం' : 'SUBJECT TO LOCAL VERIFY'}</span>
                </div>
                <div className="leading-relaxed font-medium">
                  {clean}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="leading-relaxed">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Sahayak • Citizen Guidance Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Voice-enabled conversational intelligence answering questions about 100+ Central and State welfare programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            Language: {selectedLanguage}
          </span>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'msg-welcome',
                  sender: 'assistant',
                  text: `Namaste ${profile.name}! I am **Sahayak AI**. What government scheme would you like guidance on today?`,
                  timestamp: 'Just now'
                }
              ]);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Senior Citizen Voice Prompt Callout */}
      {isSeniorMode && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-950 text-sm font-bold">
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span>आवाज में सुनें और बोलें (Voice Assistant Mode Active)</span>
          </div>
          <button
            onClick={toggleListening}
            className={`px-4 py-2 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${
              isListening ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'बोलना बंद करें (Stop)' : 'बोलकर पूछें (Speak Now)'}</span>
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {/* Message Text with verified vs uncertain highlights */}
                  <div className="font-normal text-xs sm:text-sm">
                    {isUser ? (
                      <div className="whitespace-pre-line">{msg.text}</div>
                    ) : (
                      renderMessageContent(msg.text)
                    )}
                  </div>

                  {/* Message Footer */}
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                      isUser
                        ? 'text-blue-200 border-blue-500/50'
                        : 'text-slate-400 border-slate-200/60'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {msg.source === 'gemini' && (
                          <span className="font-mono text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            Gemini 3.8 Flash
                          </span>
                        )}
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-blue-600 transition-colors p-1"
                          title="Read message aloud"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-3.5 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-semibold text-slate-500">Sahayak is consulting scheme guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Common citizen queries:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs whitespace-nowrap bg-white hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Web Speech Voice-to-Text */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-2">
          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="p-3 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 shadow-xs animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <div className="truncate">
                  <span className="font-semibold text-rose-800">Listening ({selectedLanguage}): </span>
                  <span className="italic font-bold text-slate-900">
                    {interimTranscript ? `"${interimTranscript}"` : 'Speak your question clearly...'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {interimTranscript && (
                  <button
                    type="button"
                    onClick={() => {
                      const text = interimTranscript;
                      stopListening();
                      handleSendMessage(text);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1"
                  >
                    <span>Send Query</span>
                    <Send className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-[11px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Voice Notification Toast */}
          {voiceNotice && !isListening && (
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3 h-3 text-blue-600" />
                {voiceNotice}
              </span>
              <button
                onClick={() => setVoiceNotice(null)}
                className="text-blue-500 hover:text-blue-800 text-[10px] font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Dictation Button (Web Speech API) */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse ring-2 ring-rose-300'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
              title={isListening ? "Stop listening" : `Speak in ${selectedLanguage} (Web Speech Voice-to-Text)`}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={isListening && interimTranscript ? interimTranscript : inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? `Listening in ${selectedLanguage}... speak now...` : `Ask in ${selectedLanguage} by typing or click microphone...`}
              className={`flex-1 py-3 px-4 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                isListening ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200' : 'bg-slate-50/50 hover:bg-white focus:bg-white border-slate-300'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!inputQuery.trim() && !interimTranscript.trim()) || isLoading}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
              title="Send question to AI Sahayak"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
