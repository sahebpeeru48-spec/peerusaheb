import express from 'express';
import { searchFacilities, FACILITIES_DATABASE } from '../services/facilityData.js';

const router = express.Router();

// Search facilities
router.get('/search', (req, res) => {
  try {
    const { query, type, emergencyOnly, lat, lng } = req.query;

    const data = searchFacilities({
      query,
      type,
      emergencyOnly,
      userLat: lat,
      userLng: lng
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get facility by ID
router.get('/:id', (req, res) => {
  try {
    const facility = FACILITIES_DATABASE.find(f => f.id === req.params.id);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json({ facility });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
