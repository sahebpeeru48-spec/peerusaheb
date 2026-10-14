import express from 'express';
import { db } from '../services/db.js';
import { generateChatResponse } from '../services/clinicalAi.js';

const router = express.Router();

function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token-')) {
    return authHeader.replace('Bearer token-', '').trim();
  }
  return req.body?.userId || req.query?.userId || 'demo-user-123';
}

// Get chat history for user
router.get('/history', (req, res) => {
  try {
    const userId = getUserId(req);
    const history = db.getChatHistory(userId);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message to AI Health Chatbot
router.post('/message', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    // Save user message to DB
    const userMsg = db.addChatMessage(userId, {
      role: 'user',
      text: text.trim(),
      isAi: false
    });

    // Get conversation history & user clinical profile context
    const history = db.getChatHistory(userId);
    const user = db.getUserById(userId);
    const meds = db.getMedications(userId);
    const allergies = db.getAllergies(userId);

    const userContext = {
      name: user?.name,
      age: user?.age,
      conditions: meds.map(m => m.purpose).join(', ') || 'None stated',
      allergies: allergies.map(a => a.allergen).join(', ')
    };

    // Generate response using clinical AI or configured LLM
    const aiResponse = await generateChatResponse({
      messages: history.map(h => ({ role: h.role, text: h.text })),
      userContext
    });

    // Save AI response to DB
    const assistantMsg = db.addChatMessage(userId, {
      role: 'assistant',
      text: aiResponse.text,
      isAi: true,
      isEmergency: aiResponse.isEmergency || false,
      suggestedFollowUps: aiResponse.suggestedFollowUps || []
    });

    res.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      disclaimer: 'AI responses are informational and not a substitute for professional medical advice.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear chat history
router.delete('/history', (req, res) => {
  try {
    const userId = getUserId(req);
    db.clearChatHistory(userId);
    res.json({ message: 'Chat history cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
