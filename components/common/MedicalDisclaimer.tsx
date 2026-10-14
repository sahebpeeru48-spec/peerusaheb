import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const MedicalDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [showModal, setShowModal] = useState(false);

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-health-teal-700 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Medical Disclaimer</span>
        </button>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5 text-health-teal-700">
                  <ShieldAlert className="w-6 h-6 text-health-teal-600" />
                  <h3 className="font-bold text-lg text-slate-900">Medical & AI Safety Disclaimer</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>HealthAI is an informational assistant powered by artificial intelligence.</strong> It is designed to assist you in organizing health information, understanding medical terminology, and preparing for medical consultations.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <strong>Not a Medical Diagnosis:</strong> Information provided by HealthAI does NOT constitute professional clinical diagnosis, prescription, or clinical decision-making. Always consult a licensed physician or specialist for medical concerns.
                </div>
                <p>
                  <strong>Emergency Situations:</strong> If you or someone around you experiences severe or sudden symptoms (such as chest pain, numbness, or difficulty breathing), contact emergency services (911 / 112) immediately.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-health-teal-600 hover:bg-health-teal-700 text-white font-medium rounded-xl text-sm transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs text-slate-600">
      <Info className="w-4 h-4 text-health-teal-600 mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-semibold text-slate-800">Medical Notice: </span>
        HealthAI offers general health guidance for informational purposes only. It is not a substitute for professional medical diagnosis or clinical care. For emergencies, contact local emergency services immediately.
      </div>
    </div>
  );
};
