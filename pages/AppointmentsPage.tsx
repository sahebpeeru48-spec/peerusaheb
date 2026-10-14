import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Video,
  Building,
  CalendarCheck,
  X,
  MapPin
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Appointment } from '../types';

export const AppointmentsPage: React.FC = () => {
  const { appointments, createAppointment, updateAppointmentStatus, deleteAppointment } = useHealth();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [providerName, setProviderName] = useState('');
  const [specialty, setSpecialty] = useState('Primary Care & Preventive Medicine');
  const [facility, setFacility] = useState('Metropolitan Medical Center');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState<'In-Person' | 'Telehealth'>('In-Person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !dateTime) return;

    setIsSubmitting(true);
    try {
      await createAppointment({
        providerName: providerName.trim(),
        specialty,
        facility: facility.trim(),
        dateTime,
        type,
        reason: reason.trim() || 'General health consultation',
        notes: notes.trim()
      });

      setProviderName('');
      setDateTime('');
      setReason('');
      setNotes('');
      setShowModal(false);
    } catch (err) {
      console.error('Error creating appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Requested' ? 'Confirmed' : currentStatus === 'Confirmed' ? 'Completed' : 'Requested';
    await updateAppointmentStatus(id, nextStatus);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-health-teal-600 flex items-center justify-center font-bold shadow-soft">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Assistance</h1>
            <p className="text-xs text-slate-500">Coordinate and schedule preferred dates with healthcare providers</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-card flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Request New Appointment
        </button>
      </div>

      {/* Status Notice Banner */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-sky-950 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold">Appointment Confirmation Indicator: </span>
          New appointments are logged as <strong>Requested</strong> until verified by your provider or clinic reception. Confirmed visits are designated with a green checkmark badge.
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No appointments scheduled</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Plan your next routine wellness checkup, specialist review, or follow-up visit.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-health-teal-600 text-white font-bold rounded-xl text-xs hover:bg-health-teal-700 transition-colors"
            >
              Book First Appointment
            </button>
          </div>
        ) : (
          appointments.map(appt => {
            const isConfirmed = appt.status === 'Confirmed';
            const isRequested = appt.status === 'Requested';
            const isCompleted = appt.status === 'Completed';

            return (
              <div
                key={appt.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isRequested
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isConfirmed ? '✓ Confirmed' : isRequested ? '⏳ Requested (Pending)' : 'Completed'}
                    </span>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                      {appt.type === 'Telehealth' ? <Video className="w-3 h-3 text-health-blue-600" /> : <Building className="w-3 h-3 text-slate-500" />}
                      {appt.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{appt.providerName}</h3>
                    <p className="text-xs font-semibold text-health-teal-700">{appt.specialty}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(appt.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {appt.facility}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    Reason: "{appt.reason}"
                  </p>
                </div>

                {/* Status Toggle & Delete Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleStatusToggle(appt.id, appt.status)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    title="Cycle status: Requested -> Confirmed -> Completed"
                  >
                    Change Status
                  </button>

                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Cancel Appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Request New Appointment */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Request Appointment</h3>
                <p className="text-xs text-slate-500">Log preferred consultation details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Provider or Doctor Name</label>
                <input
                  type="text"
                  value={providerName}
                  onChange={e => setProviderName(e.target.value)}
                  placeholder="e.g. Dr. Jennifer Adams"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty / Department</label>
                  <select
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Primary Care & Preventive Medicine">Primary Care</option>
                    <option value="Pulmonology & Respiratory Care">Pulmonology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Behavioral & Mental Health">Mental Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Format</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="In-Person">In-Person Clinic Visit</option>
                    <option value="Telehealth">Video Telehealth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Facility Name</label>
                <input
                  type="text"
                  value={facility}
                  onChange={e => setFacility(e.target.value)}
                  placeholder="e.g. Metropolitan Medical Center"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Annual wellness bloodwork review and medication check"
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-teal-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                *Submissions will appear as <strong>Requested</strong> until confirmed by clinic staff.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-health-teal-600 hover:bg-health-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
