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

// Get user profile & settings
router.get('/profile', (req, res) => {
  const userId = getUserId(req);
  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userSafe } = user;
  res.json({ user: userSafe });
});

// Update profile & emergency contacts
router.put('/profile', (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, age, gender, bloodType, height, weight, emergencyContact, consentGiven } = req.body;
    
    const updated = db.updateUser(userId, {
      name,
      age: age ? Number(age) : undefined,
      gender,
      bloodType,
      height,
      weight,
      emergencyContact,
      consentGiven
    });

    if (!updated) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userSafe } = updated;
    res.json({ message: 'Profile updated successfully', user: userSafe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export all user health data (JSON export for portability / patient rights)
router.get('/export', (req, res) => {
  try {
    const userId = getUserId(req);
    const user = db.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      platform: 'HealthAI – Your Smart Healthcare Assistant',
      disclaimer: 'This export contains personal health and wellness data recorded in the HealthAI application. It is for patient reference and clinical discussion with healthcare providers.',
      patientProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        bloodType: user.bloodType,
        height: user.height,
        weight: user.weight,
        emergencyContact: user.emergencyContact
      },
      vitalsHistory: db.getVitals(userId),
      medications: db.getMedications(userId),
      allergies: db.getAllergies(userId),
      appointments: db.getAppointments(userId),
      wellnessRecord: db.getWellness(userId),
      symptomCheckHistory: db.getSymptomChecks(userId)
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=HealthAI_Export_${user.name.replace(/\s+/g, '_')}.json`);
    res.json(exportPayload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete / Purge all user health records (GDPR Right to Erasure)
router.delete('/purge', (req, res) => {
  try {
    const userId = getUserId(req);
    db.deleteUserData(userId);
    res.json({ message: 'All personal health records and account data have been permanently deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset demo patient data
router.post('/reset-demo', (req, res) => {
  try {
    db.resetDemo();
    res.json({ message: 'Demo environment reset to initial seed state.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
