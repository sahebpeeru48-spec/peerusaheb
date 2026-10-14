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

// Educational Condition Library Data
export const CONDITIONS_LIBRARY = [
  {
    id: 'cond-hypertension',
    title: 'Hypertension (High Blood Pressure)',
    category: 'Cardiovascular',
    overview: 'Often termed the "silent killer" because it typically exhibits no overt symptoms while straining arteries and the heart.',
    symptoms: ['Usually asymptomatic', 'Occasional morning headaches', 'Shortness of breath with mild exertion in advanced stages'],
    lifestyleRecommendations: [
      'Adopt the DASH diet (high in potassium, magnesium, calcium, low sodium)',
      'Aim for 150 minutes of moderate aerobic exercise weekly',
      'Manage stress through mindfulness or deep breathing exercises'
    ],
    whenToSeeDoctor: 'If readings consistently exceed 130/80 mmHg across multiple days. If readings exceed 180/120 mmHg with chest pain or vision changes, seek emergency care immediately.'
  },
  {
    id: 'cond-type2-diabetes',
    title: 'Type 2 Diabetes & Insulin Resistance',
    category: 'Metabolic',
    overview: 'A metabolic condition where the body resists the action of insulin or does not produce enough, leading to elevated blood glucose levels.',
    symptoms: ['Increased thirst (polydipsia)', 'Frequent urination (polyuria)', 'Unexplained fatigue', 'Blurred vision', 'Slow-healing cuts'],
    lifestyleRecommendations: [
      'Prioritize complex carbohydrates with high dietary fiber',
      'Engage in regular resistance/strength training to enhance glucose disposal',
      'Walk for 10-15 minutes after meals to blunt postprandial glucose spikes'
    ],
    whenToSeeDoctor: 'If fasting glucose is repeatedly over 100 mg/dL or you experience persistent unquenchable thirst and frequent urination.'
  },
  {
    id: 'cond-asthma',
    title: 'Asthma & Bronchial Hyperreactivity',
    category: 'Respiratory',
    overview: 'A chronic inflammatory disorder of the airways that causes periodic airflow obstruction, bronchospasm, and mucous production.',
    symptoms: ['Wheezing (whistling sound when exhaling)', 'Shortness of breath', 'Chest tightness', 'Nocturnal or early-morning coughing'],
    lifestyleRecommendations: [
      'Identify and minimize environmental triggers (dust mites, pet dander, cold air)',
      'Use a peak flow meter if recommended by your pulmonologist',
      'Ensure rescue inhaler is carried at all times and not expired'
    ],
    whenToSeeDoctor: 'If your rescue inhaler is needed more than twice a week for relief, or if peak flow readings drop below personal green zone.'
  },
  {
    id: 'cond-gerd',
    title: 'GERD & Acid Reflux',
    category: 'Digestive',
    overview: 'Occurs when stomach acid repeatedly surges back into the tube connecting your mouth and stomach (esophagus), irritating the lining.',
    symptoms: ['Burning chest pain after eating (heartburn)', 'Acid regurgitation', 'Difficulty swallowing', 'Sensation of a lump in the throat'],
    lifestyleRecommendations: [
      'Avoid lying down for at least 3 hours after finishing meals',
      'Elevate the head of your bed 6 inches (using bed risers or a wedge pillow)',
      'Limit trigger foods: citrus, tomatoes, chocolate, caffeine, mint, and fried foods'
    ],
    whenToSeeDoctor: 'If you take OTC antacids more than twice weekly or if you have difficulty or pain swallowing solid food.'
  },
  {
    id: 'cond-insomnia',
    title: 'Chronic Sleep Disruption & Insomnia',
    category: 'Neurological / Mental',
    overview: 'Difficulty falling asleep, staying asleep, or achieving restorative deep and REM sleep cycles.',
    symptoms: ['Lying awake for >30 minutes before sleep', 'Waking up frequently during the night', 'Daytime drowsiness and mood irritability'],
    lifestyleRecommendations: [
      'Maintain an unyielding wake-up time 7 days a week',
      'Step outside into bright natural daylight within 30 minutes of waking',
      'Reserve the bed solely for sleep and intimacy to reinforce subconscious conditioning'
    ],
    whenToSeeDoctor: 'If sleep disturbances persist for >3 months or significantly impair daytime functioning and occupational safety.'
  }
];

// Get user's wellness metrics & habits
router.get('/', (req, res) => {
  const userId = getUserId(req);
  const wellness = db.getWellness(userId);
  res.json({
    wellness,
    library: CONDITIONS_LIBRARY
  });
});

// Update wellness metrics (water, sleep, steps, habits)
router.post('/update', (req, res) => {
  try {
    const userId = getUserId(req);
    const updates = req.body;
    const updatedWellness = db.updateWellness(userId, updates);
    res.json({ wellness: updatedWellness });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment water intake
router.post('/water/increment', (req, res) => {
  try {
    const userId = getUserId(req);
    const current = db.getWellness(userId);
    const newCount = (current.waterIntakeGlasses || 0) + 1;
    const updated = db.updateWellness(userId, { waterIntakeGlasses: newCount });
    res.json({ wellness: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Decrement water intake
router.post('/water/decrement', (req, res) => {
  try {
    const userId = getUserId(req);
    const current = db.getWellness(userId);
    const newCount = Math.max(0, (current.waterIntakeGlasses || 0) - 1);
    const updated = db.updateWellness(userId, { waterIntakeGlasses: newCount });
    res.json({ wellness: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle habit completion
router.post('/habit/toggle', (req, res) => {
  try {
    const userId = getUserId(req);
    const { habitId } = req.body;
    const current = db.getWellness(userId);
    const habits = (current.habits || []).map(h => {
      if (h.id === habitId) {
        return { ...h, completed: !h.completed };
      }
      return h;
    });
    const updated = db.updateWellness(userId, { habits });
    res.json({ wellness: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
