import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Sparkles,
  ArrowRight,
  Calendar,
  Pill,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Bot,
  AlertTriangle,
  Flame,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onQuickChatPrompt?: (prompt: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab, onQuickChatPrompt }) => {
  const { user } = useAuth();
  const { vitals, medications, appointments, wellness, symptomChecks, chatHistory, incrementWater } = useHealth();
  const [quickPrompt, setQuickPrompt] = useState('');

  // Extract latest vitals
  const latestBP = vitals.find(v => v.type === 'blood_pressure') || { value: '118/76', unit: 'mmHg', status: 'Normal' };
  const latestHR = vitals.find(v => v.type === 'heart_rate') || { value: '72', unit: 'bpm', status: 'Optimal' };
  const latestGlucose = vitals.find(v => v.type === 'blood_glucose') || { value: '94', unit: 'mg/dL', status: 'Normal' };
  const latestWeight = vitals.find(v => v.type === 'weight') || { value: '64.0', unit: 'kg', status: 'Stable' };

  const handleQuickChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    if (onQuickChatPrompt) {
      onQuickChatPrompt(quickPrompt);
    }
    setActiveTab('chat');
  };

  const upcomingAppts = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested');
  const recentCheck = symptomChecks[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-health-teal-700 via-health-teal-600 to-health-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>HealthAI Active Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Patient'} 👋
          </h1>
          <p className="text-teal-50 text-sm sm:text-base leading-relaxed">
            Your vitals and medication schedule are up to date. How can HealthAI assist your well-being today?
          </p>

          {/* Prominent AI Chat Input */}
          <form onSubmit={handleQuickChatSubmit} className="pt-2">
            <div className="relative flex items-center max-w-2xl bg-white rounded-2xl shadow-lg p-1.5 focus-within:ring-4 focus-within:ring-white/30 transition-all">
              <div className="pl-3 text-slate-400">
                <Bot className="w-5 h-5 text-health-teal-600" />
              </div>
              <input
                type="text"
                value={quickPrompt}
                onChange={e => setQuickPrompt(e.target.value)}
                placeholder="Ask HealthAI anything (e.g. 'What is a normal blood pressure range?')"
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-health-teal-600 hover:bg-health-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute right-0 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-48 h-48 bg-health-blue-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Summary Vitals Metric Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-health-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Current Health Metrics</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              User Recorded
            </span>
          </div>
          <button
            onClick={() => setActiveTab('records')}
            className="text-xs font-semibold text-health-teal-600 hover:text-health-teal-700 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BP Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Blood Pressure</span>
              <Activity className="w-4 h-4 text-health-teal-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{latestBP.value}</span>
              <span className="text-xs text-slate-500">{latestBP.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700">{latestBP.status}</span>
            </div>
          </div>

          {/* Heart Rate Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Resting Heart Rate</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{latestHR.value}</span>
              <span className="text-xs text-slate-500">{latestHR.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700">{latestHR.status}</span>
            </div>
          </div>

          {/* Fasting Glucose Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Fasting Glucose</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{latestGlucose.value}</span>
              <span className="text-xs text-slate-500">{latestGlucose.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-700">{latestGlucose.status}</span>
            </div>
          </div>

          {/* Daily Water Tracker Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Hydration Today</span>
              <Droplets className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {wellness?.waterIntakeGlasses || 0}
                </span>
                <span className="text-xs text-slate-500">/ {wellness?.waterTargetGlasses || 8} glasses</span>
              </div>
              <button
                onClick={() => incrementWater()}
                className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors"
                title="Log 1 cup"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (((wellness?.waterIntakeGlasses || 0) / (wellness?.waterTargetGlasses || 8)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Column (Medications & Appointments), Right Column (Symptom Check & Quick Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Two Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Medications & Reminders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-health-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Medications & Supplements</h3>
              </div>
              <button
                onClick={() => setActiveTab('records')}
                className="text-xs font-semibold text-health-teal-600 hover:text-health-teal-700"
              >
                Manage Meds
              </button>
            </div>

            <div className="space-y-3">
              {medications.length > 0 ? (
                medications.map(med => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100/70 text-health-teal-700 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-slate-800">{med.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">No medications logged yet.</p>
              )}
            </div>
          </div>

          {/* Upcoming Consultations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-health-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Appointments & Consultations</h3>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-semibold text-health-blue-600 hover:text-health-blue-700"
              >
                Book Appointment
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAppts.length > 0 ? (
                upcomingAppts.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{apt.providerName}</span>
                        <span className="text-[11px] text-slate-500">• {apt.specialty}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {apt.facility} • {new Date(apt.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {apt.status === 'Confirmed' ? '✓ Confirmed' : '⏳ Requested (Pending)'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">No upcoming appointments scheduled.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Triage Insight & Emergency Access */}
        <div className="space-y-6">
          {/* Recent AI Symptom Triage */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-health-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Latest Symptom Triage</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                AI Generated
              </span>
            </div>

            {recentCheck ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {recentCheck.symptoms.join(', ')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(recentCheck.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    {recentCheck.triageLevel}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {recentCheck.summary}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('symptoms')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Start New Symptom Check</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500">No symptoms reported recently.</p>
                <button
                  onClick={() => setActiveTab('symptoms')}
                  className="px-4 py-2 bg-health-teal-600 text-white rounded-xl text-xs font-bold hover:bg-health-teal-700 transition-colors"
                >
                  Run Symptom Checker
                </button>
              </div>
            )}
          </div>

          {/* Quick Nearby Healthcare Access */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-teal-400">
              <Activity className="w-5 h-5" />
              <h3 className="font-bold text-sm">Need In-Person Care?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Find verified 24/7 emergency rooms, urgent care clinics, and nearby community pharmacies on an interactive map.
            </p>
            <button
              onClick={() => setActiveTab('facilities')}
              className="w-full py-2.5 bg-health-teal-500 hover:bg-health-teal-400 text-slate-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Nearby Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
