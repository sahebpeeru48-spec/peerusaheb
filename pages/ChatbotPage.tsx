import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  AlertTriangle,
  Info,
  Copy,
  Check,
  PhoneCall,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useAuth } from '../context/AuthContext';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

interface ChatbotPageProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ initialPrompt, onClearInitialPrompt }) => {
  const { user } = useAuth();
  const { chatHistory, sendChatMessage, clearChat } = useHealth();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Explain normal blood pressure numbers',
    'What is the difference between viral and bacterial infections?',
    'What foods help stabilize blood sugar naturally?',
    'How many hours of sleep do adults need for cellular recovery?',
    'What are electrolytes and when are supplements needed?'
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isSending]);

  // Handle initial quick prompt from Dashboard
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendPrompt(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isSending) return;
    setInputText('');
    setIsSending(true);
    try {
      await sendChatMessage(text);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-in fade-in">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-health-teal-600 to-health-blue-500 text-white flex items-center justify-center shadow-card">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base">HealthAI Assistant</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Online & Safe
              </span>
            </div>
            <p className="text-xs text-slate-500">General health education • Preventive care • Medical terminology</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && (
            <button
              onClick={() => clearChat()}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <MedicalDisclaimer compact={true} />
        </div>
      </div>

      {/* Safety Notice Bar */}
      <div className="px-6 py-2 bg-teal-50/60 border-b border-teal-100 flex items-center justify-between text-[11px] text-health-teal-900">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-health-teal-600" />
          HealthAI answers are for informational guidance. Not a substitute for a licensed doctor's diagnosis.
        </span>
        <span className="hidden sm:inline text-slate-400">Context: {user?.name || 'Patient'}</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-health-teal-600 flex items-center justify-center shadow-soft">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">How can I support your health today?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Ask questions about physical wellness, common symptoms, diagnostic tests, or preventive habits.
              </p>
            </div>

            {/* Suggested Prompts Pills */}
            <div className="w-full space-y-2 pt-2 text-left">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Suggested Questions to Start
              </p>
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(prompt)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-health-teal-50 hover:border-health-teal-200 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all flex items-center justify-between group"
                >
                  <span>"{prompt}"</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-health-teal-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map(msg => {
            const isUser = msg.role === 'user';
            const isEmergencyAlert = msg.isEmergency;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                    isEmergencyAlert ? 'bg-red-600' : 'bg-health-teal-600'
                  }`}>
                    {isEmergencyAlert ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs space-y-2 ${
                  isUser
                    ? 'bg-health-teal-600 text-white rounded-tr-none'
                    : isEmergencyAlert
                    ? 'bg-red-50 border-2 border-red-300 text-red-950 rounded-tl-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/70'
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] font-medium opacity-80 mb-1">
                    <span>{isUser ? 'You' : (isEmergencyAlert ? '🚨 Medical Emergency Triage' : 'HealthAI Assistant')}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Emergency Quick Action Pill */}
                  {isEmergencyAlert && (
                    <div className="pt-2">
                      <a
                        href="tel:911"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" /> Call 911 / 112 Immediately
                      </a>
                    </div>
                  )}

                  {/* Suggested follow-up buttons */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/60 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Explore Follow-Up Questions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendPrompt(fu)}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 rounded-lg text-[11px] font-medium transition-colors"
                          >
                            + {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy message button */}
                  {!isUser && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors text-[10px] flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-xl bg-health-teal-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-health-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-health-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-health-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] font-medium text-slate-600">Analyzing clinical guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type your health question (e.g. 'What is the role of HDL cholesterol?')..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-health-teal-500 shadow-xs"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 bg-health-teal-600 hover:bg-health-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-card flex items-center justify-center"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
