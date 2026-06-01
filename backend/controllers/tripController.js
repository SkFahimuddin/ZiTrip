const Groq = require('groq-sdk');
const Trip = require('../models/Trip');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildPrompt = ({ destination, days, budget, travelDate }) => {
  const hasDays = days && !isNaN(days);
  const hasBudget = budget && budget.trim() !== '';

  let prompt = `You are an expert travel planner. A user wants to travel to "${destination}".`;

  if (travelDate) prompt += ` Travel date: ${travelDate}.`;
  if (hasDays) prompt += ` Duration: ${days} days.`;
  if (hasBudget) prompt += ` Budget: ${budget}.`;

  prompt += `

Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks. Just raw JSON.

The JSON must have this exact structure:
{
  "overview": "2-3 sentences about the destination — why it's great, vibe, best season",
  "tourist_spots": [
    {
      "name": "Spot name",
      "description": "2 sentences about the spot",
      "best_time": "Morning / Evening / Anytime",
      "category": "Nature / History / Adventure / Culture / Beach / Food / Shopping"
    }
  ],
  "famous_food": [
    {
      "name": "Food item name",
      "description": "One sentence about it"
    }
  ],
  "special_info": "What makes this place truly special — local customs, hidden gems, tips"${hasDays ? `,
  "itinerary": [
    {
      "day": 1,
      "title": "Day title e.g. Arrival & City Exploration",
      "slots": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Brief description"
        }
      ]
    }
  ]` : ''}
}

Include at least 6 tourist spots and 5 famous foods. ${hasDays ? `Create a complete ${days}-day itinerary with 4-5 time slots per day. ${hasBudget ? `Keep the plan within a ${budget} budget.` : ''}` : 'Do not include itinerary field.'}`;

  return prompt;
};

const planTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelDate } = req.body;

    if (!destination || destination.trim() === '') {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const prompt = buildPrompt({ destination, days, budget, travelDate });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert AI. Always respond with valid JSON only. No markdown, no explanation, no backticks. Just raw JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const raw = completion.choices[0].message.content.trim();

    // Clean any accidental markdown fences
    const cleaned = raw.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/```$/, '').trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error:', cleaned.substring(0, 300));
      return res.status(500).json({ message: 'AI returned invalid response. Please try again.' });
    }

    // Save to DB
    const trip = await Trip.create({
      userId: req.user._id,
      destination: destination.trim(),
      days: days || null,
      budget: budget || null,
      travelDate: travelDate || null,
      result
    });

    res.json({ trip });
  } catch (err) {
    console.error('planTrip error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { planTrip, getMyTrips, getTripById, deleteTrip };
