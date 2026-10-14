import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-sm border-b border-red-700">
      <div className="flex items-center space-x-2.5 max-w-5xl mx-auto">
        <span className="bg-red-800/80 p-1 rounded text-red-100 flex-shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <span>
          <strong>Emergency Safety Notice:</strong> If you are experiencing crushing chest pain, difficulty breathing, slurred speech, or a severe allergic reaction, do not wait—<strong>call 911 / 112</strong> immediately.
        </span>
        <a
          href="tel:911"
          className="ml-2 inline-flex items-center gap-1 bg-white text-red-700 px-2 py-0.5 rounded font-bold hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <PhoneCall className="w-3 h-3" /> Dial 911
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-red-200 hover:text-white p-1 rounded hover:bg-red-700 transition-colors"
        title="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
