import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token-')) {
    return authHeader.replace('Bearer token-', '').trim();
  }
  return req.body?.userId || req.query?.userId || 'demo-user-123';
}

// Get user appointments
router.get('/', (req, res) => {
  const userId = getUserId(req);
  res.json({ appointments: db.getAppointments(userId) });
});

// Book / Request new appointment
router.post('/', (req, res) => {
  try {
    const userId = getUserId(req);
    const { providerName, specialty, facility, dateTime, type, reason, notes } = req.body;

    if (!providerName || !dateTime) {
      return res.status(400).json({ error: 'Provider name and date/time are required.' });
    }

    const newAppt = db.createAppointment(userId, {
      providerName,
      specialty: specialty || 'General Healthcare',
      facility: facility || 'Local Healthcare Center',
      dateTime,
      type: type || 'In-Person',
      reason: reason || 'Consultation',
      notes: notes || '',
      status: 'Requested' // Clearly marks as Requested until confirmed
    });

    res.status(201).json({
      message: 'Appointment request submitted. Status is Requested.',
      appointment: newAppt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment status (e.g. Confirmed, Completed, Cancelled)
router.patch('/:id/status', (req, res) => {
  try {
    const userId = getUserId(req);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = db.updateAppointmentStatus(userId, req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete appointment
router.delete('/:id', (req, res) => {
  const userId = getUserId(req);
  db.deleteAppointment(userId, req.params.id);
  res.json({ message: 'Appointment deleted.' });
});

export default router;
