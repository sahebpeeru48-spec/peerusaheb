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

// Get consolidated health summary
router.get('/summary', (req, res) => {
  try {
    const userId = getUserId(req);
    const user = db.getUserById(userId);
    const vitals = db.getVitals(userId);
    const medications = db.getMedications(userId);
    const allergies = db.getAllergies(userId);
    const symptomChecks = db.getSymptomChecks(userId);
    const appointments = db.getAppointments(userId);

    res.json({
      patient: {
        name: user?.name,
        age: user?.age,
        gender: user?.gender,
        bloodType: user?.bloodType,
        emergencyContact: user?.emergencyContact
      },
      vitals,
      medications,
      allergies,
      recentSymptomChecks: symptomChecks.slice(0, 3),
      upcomingAppointments: appointments.filter(a => a.status === 'Confirmed' || a.status === 'Requested')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vitals
router.get('/vitals', (req, res) => {
  const userId = getUserId(req);
  res.json({ vitals: db.getVitals(userId) });
});

router.post('/vitals', (req, res) => {
  const userId = getUserId(req);
  const { type, value, unit, status, notes } = req.body;
  if (!type || !value) {
    return res.status(400).json({ error: 'Vital type and value are required.' });
  }
  const newVital = db.addVital(userId, { type, value, unit: unit || '', status: status || 'Recorded', notes: notes || '' });
  res.status(201).json({ vital: newVital });
});

router.delete('/vitals/:id', (req, res) => {
  const userId = getUserId(req);
  db.deleteVital(userId, req.params.id);
  res.json({ message: 'Vital removed.' });
});

// Medications
router.get('/medications', (req, res) => {
  const userId = getUserId(req);
  res.json({ medications: db.getMedications(userId) });
});

router.post('/medications', (req, res) => {
  const userId = getUserId(req);
  const { name, dosage, frequency, purpose, prescriber, refillDate } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Medication name is required.' });
  }
  const newMed = db.addMedication(userId, { name, dosage, frequency, purpose, prescriber, refillDate });
  res.status(201).json({ medication: newMed });
});

router.put('/medications/:id', (req, res) => {
  const userId = getUserId(req);
  const updated = db.updateMedication(userId, req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Medication not found' });
  res.json({ medication: updated });
});

router.delete('/medications/:id', (req, res) => {
  const userId = getUserId(req);
  db.deleteMedication(userId, req.params.id);
  res.json({ message: 'Medication deleted.' });
});

// Allergies
router.get('/allergies', (req, res) => {
  const userId = getUserId(req);
  res.json({ allergies: db.getAllergies(userId) });
});

router.post('/allergies', (req, res) => {
  const userId = getUserId(req);
  const { allergen, severity, reaction, diagnosedYear } = req.body;
  if (!allergen) {
    return res.status(400).json({ error: 'Allergen name is required.' });
  }
  const newAllergy = db.addAllergy(userId, { allergen, severity: severity || 'Moderate', reaction, diagnosedYear });
  res.status(201).json({ allergy: newAllergy });
});

router.delete('/allergies/:id', (req, res) => {
  const userId = getUserId(req);
  db.deleteAllergy(userId, req.params.id);
  res.json({ message: 'Allergy deleted.' });
});

export default router;
