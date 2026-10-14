import React from 'react';
import {
  Activity,
  Sparkles,
  Stethoscope,
  MapPin,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  const { loginDemo } = useAuth();

  const handleDemoClick = async () => {
    await loginDemo();
    onExploreDemo();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-health-teal-100/70 border border-health-teal-200 text-health-teal-800 text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in slide-in-from-top-3">
              <Sparkles className="w-4 h-4 text-health-teal-600" />
              <span>AI-Powered Healthcare Assistance & Safety Triage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Health<span className="text-health-teal-600">AI</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-700 mt-2">
                Your Smart, Accessible Healthcare Assistant
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Empowering individuals with reliable health education, intelligent symptom triage with emergency red-flag detection, local facility discovery, and organized personal wellness records.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-health-teal-600 hover:bg-health-teal-700 text-white font-bold text-sm sm:text-base shadow-card flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Sign In / Create Account</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-health-teal-600" />
                <span>Zero Hallucination Emergency Detection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-health-blue-600" />
                <span>Verified Facilities Directory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Patient Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 z-20">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-soft flex items-start gap-3.5 text-amber-900 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold">Medical Informational Disclaimer</h4>
            <p className="text-amber-800 leading-relaxed">
              HealthAI provides evidence-based health guidance and triage suggestions for informational purposes only. It does not provide medical diagnoses or replace licensed physicians. If you suspect an acute life-threatening emergency, call 911 or visit an emergency room immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Comprehensive Clinical & Wellness Capabilities</h2>
          <p className="text-sm text-slate-600 mt-2">Designed for hackathon demonstration with real-world healthcare impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Health Chatbot</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ask questions about lab results, medical terminology, and preventive habits. Powered by safe clinical NLP with Gemini API integration.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Symptom Checker & Triage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Input symptoms, severity, and duration. Detects emergency red flags immediately without delay, providing safe next steps and differential options.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-health-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Healthcare Finder & Maps</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interactive Leaflet OpenStreetMap locating nearby 24/7 hospitals, walk-in urgent care clinics, pharmacies, and diagnostic laboratories with driving distance.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personal Health Records</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Keep track of blood pressure, blood glucose, active medications, and allergies. Generate a clean clinical summary export for your doctor's visit.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Daily Wellness & Habits</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hydration tracking, sleep hygiene logging, daily wellness goals, and an evidence-based library for managing chronic conditions like hypertension and asthma.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Appointment Assistance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Record preferred consultation dates, physicians, and specialties. Clear distinction between Requested vs Confirmed appointments.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">HealthAI – Your Smart Healthcare Assistant</p>
        <p>Built for Hackathon Demonstration • Secure, Accessible, Responsible AI</p>
        <p className="text-[11px] text-slate-400">Emergency Services: Call 911 (US/Canada), 112 (EU), 999 (UK)</p>
      </footer>
    </div>
  );
};
