import React, { useState } from 'react';
import {
  ClipboardList,
  Activity,
  Pill,
  ShieldAlert,
  Plus,
  Trash2,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Heart,
  X
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useAuth } from '../context/AuthContext';
import { VitalSign, Medication, Allergy } from '../types';

export const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    vitals,
    medications,
    allergies,
    symptomChecks,
    addVital,
    deleteVital,
    addMedication,
    deleteMedication,
    addAllergy,
    deleteAllergy
  } = useHealth();

  // Modals state
  const [showVitalModal, setShowVitalModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // New Vital Form
  const [vitalType, setVitalType] = useState<'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'weight'>('blood_pressure');
  const [vitalValue, setVitalValue] = useState('');
  const [vitalNotes, setVitalNotes] = useState('');

  // New Medication Form
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medPurpose, setMedPurpose] = useState('');
  const [medPrescriber, setMedPrescriber] = useState('');

  // New Allergy Form
  const [allergen, setAllergen] = useState('');
  const [allergySeverity, setAllergySeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening'>('Moderate');
  const [allergyReaction, setAllergyReaction] = useState('');

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vitalValue.trim()) return;

    let unit = 'mmHg';
    let status: VitalSign['status'] = 'Normal';

    if (vitalType === 'heart_rate') unit = 'bpm';
    if (vitalType === 'blood_glucose') unit = 'mg/dL';
    if (vitalType === 'weight') unit = 'kg';

    await addVital({
      type: vitalType,
      value: vitalValue.trim(),
      unit,
      status,
      notes: vitalNotes.trim()
    });

    setVitalValue('');
    setVitalNotes('');
    setShowVitalModal(false);
  };

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    await addMedication({
      name: medName.trim(),
      dosage: medDosage.trim() || 'As directed',
      frequency: medFrequency.trim() || 'Daily',
      purpose: medPurpose.trim() || 'General Care',
      prescriber: medPrescriber.trim() || 'Primary Care Physician',
      active: true
    });

    setMedName('');
    setMedDosage('');
    setMedFrequency('');
    setMedPurpose('');
    setMedPrescriber('');
    setShowMedModal(false);
  };

  const handleAddAllergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergen.trim()) return;

    await addAllergy({
      allergen: allergen.trim(),
      severity: allergySeverity,
      reaction: allergyReaction.trim() || 'Adverse response'
    });

    setAllergen('');
    setAllergyReaction('');
    setShowAllergyModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Personal Health Records</h1>
            <p className="text-xs text-slate-500">Secure log of vitals, active medications, allergies, and clinical notes</p>
          </div>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-card flex-shrink-0"
        >
          <FileText className="w-4 h-4" /> Export Doctor's Summary
        </button>
      </div>

      {/* Grid: 3 Main Cards (Vitals, Medications, Allergies) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Vitals Log */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-health-teal-600" />
              <h2 className="font-bold text-slate-900 text-sm">Vital Signs Log</h2>
            </div>
            <button
              onClick={() => setShowVitalModal(true)}
              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-health-teal-700 transition-colors"
              title="Add Vital"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {vitals.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No vitals logged yet.</p>
            ) : (
              vitals.map(v => (
                <div key={v.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {v.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => deleteVital(v.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900">{v.value}</span>
                    <span className="text-xs text-slate-500">{v.unit}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>{v.notes || 'Routine check'}</span>
                    <span>{new Date(v.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Medications & Prescriptions */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-health-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">Medications & Rx</h2>
            </div>
            <button
              onClick={() => setShowMedModal(true)}
              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-health-blue-700 transition-colors"
              title="Add Medication"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {medications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No medications logged.</p>
            ) : (
              medications.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900">{m.name}</h3>
                      <p className="text-xs font-semibold text-health-teal-700">{m.dosage}</p>
                    </div>
                    <button
                      onClick={() => deleteMedication(m.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p>🕒 {m.frequency}</p>
                    <p>🎯 For: {m.purpose}</p>
                    {m.prescriber && <p className="text-slate-400 text-[10px]">Prescriber: {m.prescriber}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Allergies & Sensitivities */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h2 className="font-bold text-slate-900 text-sm">Allergies & Alerts</h2>
            </div>
            <button
              onClick={() => setShowAllergyModal(true)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
              title="Add Allergy"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {allergies.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No known drug or environmental allergies logged.</p>
            ) : (
              allergies.map(a => (
                <div key={a.id} className="p-3.5 bg-red-50/50 border border-red-100 rounded-2xl space-y-1.5 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-red-950">{a.allergen}</h3>
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1 ${
                        a.severity === 'Severe' || a.severity === 'Life-Threatening'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteAllergy(a.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-red-900">Reaction: {a.reaction}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Log Vital */}
      {showVitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Record New Vital Reading</h3>
              <button onClick={() => setShowVitalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVital} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vital Type</label>
                <select
                  value={vitalType}
                  onChange={e => setVitalType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="blood_pressure">Blood Pressure (mmHg)</option>
                  <option value="heart_rate">Heart Rate (bpm)</option>
                  <option value="blood_glucose">Fasting Blood Glucose (mg/dL)</option>
                  <option value="weight">Body Weight (kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Measurement Value ({vitalType === 'blood_pressure' ? 'e.g. 120/80' : vitalType === 'heart_rate' ? 'e.g. 72' : 'e.g. 95'})
                </label>
                <input
                  type="text"
                  value={vitalValue}
                  onChange={e => setVitalValue(e.target.value)}
                  placeholder="Enter reading value"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Context Notes</label>
                <input
                  type="text"
                  value={vitalNotes}
                  onChange={e => setVitalNotes(e.target.value)}
                  placeholder="e.g. Morning fasting reading, after 10m rest"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVitalModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-health-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Vital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Medication */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Add Medication / Supplement</h3>
              <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMed} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  value={medName}
                  onChange={e => setMedName(e.target.value)}
                  placeholder="e.g. Lisinopril, Vitamin D3"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={medDosage}
                    onChange={e => setMedDosage(e.target.value)}
                    placeholder="e.g. 10 mg, 2 puffs"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={medFrequency}
                    onChange={e => setMedFrequency(e.target.value)}
                    placeholder="e.g. Once daily morning"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Condition</label>
                <input
                  type="text"
                  value={medPurpose}
                  onChange={e => setMedPurpose(e.target.value)}
                  placeholder="e.g. Blood pressure control, Asthma"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  value={medPrescriber}
                  onChange={e => setMedPrescriber(e.target.value)}
                  placeholder="e.g. Dr. Robert Chen"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMedModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-health-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Allergy */}
      {showAllergyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Record Known Allergy</h3>
              <button onClick={() => setShowAllergyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAllergy} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergen</label>
                <input
                  type="text"
                  value={allergen}
                  onChange={e => setAllergen(e.target.value)}
                  placeholder="e.g. Penicillin, Shellfish, Latex"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={allergySeverity}
                  onChange={e => setAllergySeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Mild">Mild (Rash, itching)</option>
                  <option value="Moderate">Moderate (Hives, localized swelling)</option>
                  <option value="Severe">Severe (Respiratory, systemic)</option>
                  <option value="Life-Threatening">Life-Threatening (Anaphylaxis risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reaction Description</label>
                <input
                  type="text"
                  value={allergyReaction}
                  onChange={e => setAllergyReaction(e.target.value)}
                  placeholder="e.g. Severe facial hives and throat tightness"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllergyModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Allergy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Doctor's Clinical Summary */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-health-teal-700">
                  HealthAI Personal Summary
                </span>
                <h2 className="text-xl font-bold text-slate-900">Physician Visit Clinical Summary</h2>
                <p className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Patient Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700">
              <div>
                <p className="text-slate-400 text-[10px]">Patient Name</p>
                <p className="font-bold text-slate-900">{user?.name || 'Sarah Jenkins'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Age / Sex</p>
                <p className="font-bold text-slate-900">{user?.age || 34} yrs • {user?.gender || 'Female'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Blood Type</p>
                <p className="font-bold text-slate-900">{user?.bloodType || 'A+'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Emergency Contact</p>
                <p className="font-bold text-slate-900">{user?.emergencyContact?.phone || '+1 (555) 234-5678'}</p>
              </div>
            </div>

            {/* Allergies Notice */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-red-900">⚠️ Known Allergies & Sensitivities:</p>
              <p className="text-red-800">
                {allergies.length > 0
                  ? allergies.map(a => `${a.allergen} (${a.severity}: ${a.reaction})`).join('; ')
                  : 'No known allergies reported.'}
              </p>
            </div>

            {/* Active Meds */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Medications</h4>
              <div className="divide-y divide-slate-100 text-xs text-slate-700">
                {medications.map(m => (
                  <div key={m.id} className="py-2 flex justify-between">
                    <span className="font-semibold text-slate-900">{m.name} ({m.dosage})</span>
                    <span className="text-slate-500">{m.frequency} • {m.purpose}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Vitals */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Vital Signs</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {vitals.slice(0, 4).map(v => (
                  <div key={v.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 capitalize">{v.type.replace('_', ' ')}</p>
                    <p className="font-bold text-slate-900">{v.value} {v.unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 leading-relaxed">
              *Disclaimer: This clinical summary is generated by the patient using HealthAI for personal healthcare management. All measurements and medical history must be verified by licensed clinical staff.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
