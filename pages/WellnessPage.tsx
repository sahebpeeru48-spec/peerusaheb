import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Moon,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Award,
  ShieldCheck,
  Smile,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHealth } from '../context/HealthContext';

export const WellnessPage: React.FC = () => {
  const { wellness, conditionsLibrary, incrementWater, decrementWater, toggleHabit, updateWellness } = useHealth();
  const [expandedCondition, setExpandedCondition] = useState<string | null>('cond-hypertension');
  const [sleepHours, setSleepHours] = useState(wellness?.sleepHours || 7.5);
  const [sleepQuality, setSleepQuality] = useState(wellness?.sleepQuality || 'Good');

  const habits = wellness?.habits || [
    { id: 'h1', name: 'Morning 15-min Stretch', completed: true },
    { id: 'h2', name: 'Take Daily Vitamin D', completed: true },
    { id: 'h3', name: 'Drink 2L Water', completed: false },
    { id: 'h4', name: 'No Screens 30m Before Bed', completed: false }
  ];

  const completedHabitsCount = habits.filter(h => h.completed).length;
  const habitsPercent = Math.round((completedHabitsCount / habits.length) * 100);

  const handleHabitClick = async (habitId: string) => {
    await toggleHabit(habitId);
    // Check if this action completes all habits
    if (completedHabitsCount + 1 === habits.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleSaveSleep = async (hours: number, quality: any) => {
    setSleepHours(hours);
    setSleepQuality(quality);
    await updateWellness({ sleepHours: hours, sleepQuality: quality });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Preventive Healthcare & Wellness</h1>
            <p className="text-xs text-slate-500">Daily health habits, hydration tracking, sleep hygiene, and evidence-based education</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 px-3.5 py-1.5 rounded-2xl border border-teal-200 text-health-teal-900 text-xs font-bold">
          <Award className="w-4 h-4 text-health-teal-600" />
          <span>Daily Wellness Score: {habitsPercent >= 75 ? '92% (Excellent)' : '78% (Good)'}</span>
        </div>
      </div>

      {/* Top Trackers Grid: Hydration & Sleep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Daily Hydration Log</h2>
                <p className="text-[11px] text-slate-500">Target: 8 glasses (approx. 2 liters)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              {wellness?.waterIntakeGlasses || 0} / {wellness?.waterTargetGlasses || 8} Glasses
            </span>
          </div>

          {/* Visual Glass Meter */}
          <div className="grid grid-cols-8 gap-2 py-3">
            {Array.from({ length: 8 }).map((_, idx) => {
              const filled = idx < (wellness?.waterIntakeGlasses || 0);
              return (
                <div
                  key={idx}
                  className={`h-12 rounded-xl border flex items-end justify-center pb-1 text-[10px] font-bold transition-all ${
                    filled
                      ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => decrementWater()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Minus className="w-3.5 h-3.5" /> Remove Cup
            </button>
            <button
              onClick={() => incrementWater()}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log 1 Cup (250ml)
            </button>
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Sleep & Recovery Log</h2>
                <p className="text-[11px] text-slate-500">Recommended: 7–9 hours for cellular restoration</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              {sleepHours} Hours ({sleepQuality})
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Duration Slept:</span>
                <span className="font-bold">{sleepHours} hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={e => handleSaveSleep(Number(e.target.value), sleepQuality)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <p className="text-xs text-slate-700 mb-1.5">Sleep Quality Rating:</p>
              <div className="grid grid-cols-4 gap-2">
                {['Poor', 'Fair', 'Good', 'Excellent'].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSaveSleep(sleepHours, q)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      sleepQuality === q
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Habits Checklist */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-health-teal-600" />
            <h2 className="font-bold text-slate-900 text-base">Daily Wellness Habit Tracker</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-health-teal-700 border border-teal-200">
            {completedHabitsCount} of {habits.length} Completed ({habitsPercent}%)
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-health-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${habitsPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {habits.map(habit => (
            <div
              key={habit.id}
              onClick={() => handleHabitClick(habit.id)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                habit.completed
                  ? 'bg-teal-50/60 border-teal-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                  habit.completed ? 'bg-health-teal-600 border-health-teal-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${habit.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {habit.name}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {habit.completed ? 'Done' : 'Tap to complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Condition Library */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Preventive Condition Education Library</h2>
            <p className="text-xs text-slate-500">Clinically vetted guides on prevalent chronic conditions and preventive lifestyle practices</p>
          </div>
        </div>

        <div className="space-y-3">
          {conditionsLibrary.map(cond => {
            const isExpanded = expandedCondition === cond.id;
            return (
              <div
                key={cond.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCondition(isExpanded ? null : cond.id)}
                  className="w-full p-4 sm:p-5 text-left bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-health-teal-800">
                      {cond.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{cond.title}</h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-white space-y-4 text-xs sm:text-sm border-t border-slate-100">
                    <p className="text-slate-600 leading-relaxed">{cond.overview}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <h4 className="font-bold text-slate-900 text-xs">Recognized Symptoms:</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                          {cond.symptoms.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2">
                        <h4 className="font-bold text-health-teal-900 text-xs">Evidence-Based Lifestyle Strategies:</h4>
                        <ul className="list-disc list-inside space-y-1 text-health-teal-800 text-xs">
                          {cond.lifestyleRecommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                      <strong>When to See a Physician: </strong>
                      {cond.whenToSeeDoctor}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
