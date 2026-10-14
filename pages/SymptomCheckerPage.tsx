import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle2,
  PhoneCall,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Plus,
  X,
  FileCheck,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { SymptomTriageResult } from '../types';
import { useHealth } from '../context/HealthContext';

interface SymptomCheckerProps {
  onFindHealthcare?: () => void;
}

export const SymptomCheckerPage: React.FC<SymptomCheckerProps> = ({ onFindHealthcare }) => {
  const { addSymptomCheckRecord } = useHealth();

  // Wizard state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('2-3 Days');
  const [severity, setSeverity] = useState(4);
  const [ageGroup, setAgeGroup] = useState('Adult (18-64)');
  const [preExisting, setPreExisting] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Results state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomTriageResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commonSymptomPills = [
    'Chest Pain / Pressure',
    'Shortness of Breath',
    'Cough (Dry or Productive)',
    'Throat Irritation / Sore Throat',
    'Headache / Temple Pressure',
    'Fever or Chills',
    'Fatigue / Exhaustion',
    'Nausea or Stomach Cramps',
    'Mild Dizziness',
    'Joint or Lower Back Ache'
  ];

  const durationOptions = [
    'Just started (< 2 hours)',
    'Today (2–24 hours)',
    '2–3 Days',
    '4–7 Days',
    '1–2 Weeks',
    'Chronic (> 1 month)'
  ];

  const handleToggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select or enter at least one symptom.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await api.analyzeSymptoms({
        symptoms: selectedSymptoms,
        duration,
        severity,
        ageGroup,
        preExistingConditions: preExisting,
        additionalDetails: additionalNotes
      });

      setResult(res.result);
      if (res.savedRecord) {
        addSymptomCheckRecord(res.savedRecord);
        setSavedSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis could not be completed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setDuration('2-3 Days');
    setSeverity(4);
    setPreExisting('');
    setAdditionalNotes('');
    setResult(null);
    setSavedSuccess(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Symptom Triage</h1>
            <p className="text-xs text-slate-500">Evidence-based triage, red-flag emergency detection, and next-step guidance</p>
          </div>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start New Check
          </button>
        )}
      </div>

      {/* EMERGENCY MODAL / BANNER (Shown immediately if emergency detected!) */}
      {result && result.isEmergency && (
        <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-700 space-y-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white text-red-600 rounded-2xl shadow-lg flex-shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest uppercase bg-red-800/80 px-2.5 py-1 rounded">
                CRITICAL EMERGENCY WARNING
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Immediate Emergency Medical Evaluation Required
              </h2>
              <p className="text-sm text-red-100 font-medium">
                {result.emergencyDetails?.flag || 'Potential acute life-threatening symptom detected.'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/20 text-sm leading-relaxed space-y-2">
            <p className="font-bold text-white text-base">Recommended Immediate Action:</p>
            <p>{result.emergencyDetails?.action || 'Call 911 / 112 immediately. Do not drive yourself.'}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href="tel:911"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>DIAL 911 / 112 NOW</span>
            </a>

            {onFindHealthcare && (
              <button
                onClick={onFindHealthcare}
                className="w-full sm:w-auto px-5 py-3.5 bg-red-800 hover:bg-red-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Find Nearest Emergency Room
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Form (if not yet analyzed or running) */}
      {!result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Select Symptoms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-health-teal-100 text-health-teal-800 text-xs flex items-center justify-center font-extrabold">1</span>
                What symptoms are you experiencing?
              </label>
              <span className="text-xs text-slate-400">Select all that apply</span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2">
              {commonSymptomPills.map((symptom, idx) => {
                const isSelected = selectedSymptoms.includes(symptom);
                const isEmergencyIndicator = symptom.includes('Chest') || symptom.includes('Shortness of Breath');

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleSymptom(symptom)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-health-teal-600 text-white shadow-sm'
                        : isEmergencyIndicator
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{symptom}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                placeholder="Or type a specific symptom (e.g. ear fullness, calf pain)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* Selected Symptoms Badges */}
            {selectedSymptoms.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Currently Selected Symptoms ({selectedSymptoms.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-health-teal-900 rounded-full text-xs font-bold"
                    >
                      <span>{sym}</span>
                      <button
                        onClick={() => handleToggleSymptom(sym)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Step 2: Duration & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-health-teal-100 text-health-teal-800 text-xs flex items-center justify-center font-extrabold">2</span>
                How long have symptoms lasted?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                      duration === opt
                        ? 'bg-health-teal-50 border-health-teal-500 text-health-teal-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-health-teal-100 text-health-teal-800 text-xs flex items-center justify-center font-extrabold">3</span>
                  Severity Level (1 to 10)
                </label>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  severity <= 3 ? 'bg-emerald-100 text-emerald-800' : severity <= 6 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  Level {severity}: {severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-health-teal-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 (Barely noticeable)</span>
                <span>5 (Moderate discomfort)</span>
                <span>10 (Debilitating)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                <p><strong>Mild (1-3):</strong> Does not interfere with normal daily tasks.</p>
                <p><strong>Moderate (4-6):</strong> Impairs focus or physical activity.</p>
                <p><strong>Severe (7-10):</strong> Substantially debilitating or intolerable.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Step 3: Additional Clinical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={e => setAgeGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-teal-500"
              >
                <option value="Child (0-12)">Child (0-12 years)</option>
                <option value="Adolescent (13-17)">Adolescent (13-17 years)</option>
                <option value="Adult (18-64)">Adult (18-64 years)</option>
                <option value="Senior (65+)">Senior (65+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pre-existing Conditions (Optional)</label>
              <input
                type="text"
                value={preExisting}
                onChange={e => setPreExisting(e.target.value)}
                placeholder="e.g. Asthma, Hypertension, Diabetes"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-teal-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Responses are analyzed with evidence-based clinical heuristics.</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || selectedSymptoms.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 bg-health-teal-600 hover:bg-health-teal-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-card transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              {isAnalyzing ? (
                <span>Evaluating Symptoms...</span>
              ) : (
                <>
                  <span>Run Clinical Triage Analysis</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS REPORT VIEW (When analysis finishes) */}
      {result && !result.isEmergency && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-8 animate-in fade-in">
          {/* Triage Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            result.urgencyColor === 'orange'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : result.urgencyColor === 'blue'
              ? 'bg-sky-50 border-sky-200 text-sky-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                Recommended Triage Category
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{result.triageLevel}</h2>
              <p className="text-xs sm:text-sm font-medium mt-1">
                ⏱️ <strong>Recommended Timeframe:</strong> {result.recommendedTimeframe}
              </p>
            </div>

            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs flex-shrink-0">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Saved to Records
              </span>
            )}
          </div>

          {/* Differential Explanations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-health-teal-600" />
              <h3 className="text-base font-bold text-slate-900">Possible General Explanations</h3>
            </div>
            <p className="text-xs text-slate-500">
              *The following possibilities are clinical considerations for educational reference only. They do NOT replace a physician's diagnostic evaluation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.possibleExplanations.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{exp.condition}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-health-teal-800">
                      {exp.likelihood}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended Clinical Next Steps
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {result.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flag Warning Signs */}
          {result.redFlagsToWatch && result.redFlagsToWatch.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-xs text-red-900">
              <h4 className="font-bold flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Warning Signs That Require Immediate Medical Care:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-red-800">
                {result.redFlagsToWatch.map((rf, idx) => (
                  <li key={idx}>{rf}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Questions for your Physician */}
          {result.followUpQuestions && result.followUpQuestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-health-blue-600" /> Helpful Questions to Ask Your Doctor:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.followUpQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                    💬 "{q}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              ← Test Another Symptom Profile
            </button>

            {onFindHealthcare && (
              <button
                onClick={onFindHealthcare}
                className="px-6 py-3 bg-health-teal-600 hover:bg-health-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-card transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Find Nearest Healthcare Facility
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
