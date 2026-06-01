const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    default: null
  },
  budget: {
    type: String,
    default: null
  },
  travelDate: {
    type: String,
    default: null
  },
  result: {
    tourist_spots: [
      {
        name: String,
        description: String,
        best_time: String,
        category: String
      }
    ],
    famous_food: [
      {
        name: String,
        description: String
      }
    ],
    special_info: String,
    overview: String,
    itinerary: [
      {
        day: Number,
        title: String,
        slots: [
          {
            time: String,
            activity: String,
            description: String
          }
        ]
      }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
