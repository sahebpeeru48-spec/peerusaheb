import express from 'express';
import { db } from '../services/db.js';
import { analyzeSymptoms } from '../services/clinicalAi.js';

const router = express.Router();

function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token-')) {
    return authHeader.replace('Bearer token-', '').trim();
  }
  return req.body?.userId || req.query?.userId || 'demo-user-123';
}

// Get user's past symptom checks
router.get('/history', (req, res) => {
  try {
    const userId = getUserId(req);
    const checks = db.getSymptomChecks(userId);
    res.json({ checks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze symptoms
router.post('/analyze', (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      symptoms,
      duration,
      severity,
      ageGroup,
      preExistingConditions,
      additionalDetails,
      saveToHistory = true
    } = req.body;

    if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
      return res.status(400).json({ error: 'At least one symptom must be provided.' });
    }

    const analysisResult = analyzeSymptoms({
      symptoms,
      duration: duration || 'Not specified',
      severity: severity || 5,
      ageGroup: ageGroup || 'Adult (18-64)',
      preExistingConditions,
      additionalDetails
    });

    // Save to user history if requested
    let savedRecord = null;
    if (saveToHistory && userId) {
      savedRecord = db.addSymptomCheck(userId, {
        symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
        duration: duration || '1-3 days',
        severity: Number(severity) || 5,
        triageLevel: analysisResult.triageLevel,
        isEmergency: analysisResult.isEmergency,
        summary: analysisResult.summary || `${analysisResult.triageLevel}. Evaluated ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}.`,
        recommendations: analysisResult.nextSteps
      });
    }

    res.json({
      result: analysisResult,
      savedRecord
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
