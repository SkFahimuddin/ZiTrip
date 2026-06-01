const express = require('express');
const router = express.Router();
const { planTrip, getMyTrips, getTripById, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.post('/plan', protect, planTrip);
router.get('/my', protect, getMyTrips);
router.get('/:id', protect, getTripById);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
