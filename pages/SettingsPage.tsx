import React, { useState } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Phone,
  Download,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '34');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'A+');
  const [height, setHeight] = useState(user?.height || '168 cm');
  const [weight, setWeight] = useState(user?.weight || '64 kg');

  // Emergency Contact Form State
  const [contactName, setContactName] = useState(user?.emergencyContact?.name || 'David Jenkins');
  const [contactRelation, setContactRelation] = useState(user?.emergencyContact?.relation || 'Spouse');
  const [contactPhone, setContactPhone] = useState(user?.emergencyContact?.phone || '+1 (555) 234-5678');

  // Privacy Consent
  const [consentGiven, setConsentGiven] = useState(user?.consentGiven ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      age: Number(age) || 30,
      bloodType,
      height,
      weight,
      emergencyContact: {
        name: contactName,
        relation: contactRelation,
        phone: contactPhone
      },
      consentGiven
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    window.open('/api/user/export', '_blank');
  };

  const handlePurge = async () => {
    await api.purgeAllData();
    setPurgeConfirmOpen(false);
    setPurgeSuccess(true);
    setTimeout(() => {
      logout();
    }, 2000);
  };

  const handleResetDemo = async () => {
    await api.resetDemo();
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-3.5 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Profile, Privacy & Settings</h1>
          <p className="text-xs text-slate-500">Manage clinical profile, emergency contacts, consent, and data rights</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and privacy preferences saved successfully.</span>
        </div>
      )}

      {purgeSuccess && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>All health records deleted. Logging out...</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Patient Demographics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <User className="w-4 h-4 text-health-teal-600" />
            <span>Patient Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Account identifier)</label>
              <input
                type="email"
                value={user?.email || 'patient@example.com'}
                disabled
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Type</label>
              <select
                value={bloodType}
                onChange={e => setBloodType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height</label>
              <input
                type="text"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 168 cm"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 64 kg"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Phone className="w-4 h-4 text-red-600" />
            <span>Emergency Contact Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="e.g. David Jenkins"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={contactRelation}
                onChange={e => setContactRelation(e.target.value)}
                placeholder="e.g. Spouse / Parent / Sibling"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Privacy & AI Safety Consent */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-health-teal-600" />
            <span>AI Processing Consent & Privacy Disclosure</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>Data Protection Guarantee:</strong> HealthAI processes health records exclusively within your secure session. Your personal records are never shared with public LLMs or advertising networks without explicit encryption.
            </p>
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="rounded text-health-teal-600 focus:ring-health-teal-500 w-4 h-4 mt-0.5"
              />
              <span className="text-slate-800 font-medium">
                I consent to HealthAI using my entered vitals and symptoms to provide informational triage and health guidance.
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-card transition-colors"
            >
              Save Profile & Settings
            </button>
          </div>
        </div>
      </form>

      {/* Patient Data Rights (GDPR) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Data Portability & Patient Rights</h3>
        <p className="text-xs text-slate-500">
          You maintain full ownership of your health records. Export your full medical file in open JSON format or permanently erase all stored records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-health-teal-600" /> Download All Health Data (JSON)
          </button>

          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-health-blue-600" /> Reset Demo Patient (Sarah Jenkins)
          </button>

          <button
            type="button"
            onClick={() => setPurgeConfirmOpen(true)}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Purge / Delete All My Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal: Purge */}
      {purgeConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-red-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Data Erasure</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete all your health records, vitals, medication schedules, and symptom triage history? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPurgeConfirmOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurge}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Yes, Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
