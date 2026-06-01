# ✦ VoyagerAI — AI Trip Planner
### Built with ♥ by Fahim MindWorks

A full MERN stack AI-powered travel planner using the Groq API (LLaMA 3.3 70B).

---

## 📁 Project Structure

```
trip-planner/
├── backend/          → Node.js + Express API
└── frontend/         → React app
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=any_random_secret_string
GROQ_API_KEY=your_groq_api_key_here
```

Get your free MongoDB URI from: https://cloud.mongodb.com  
Get your Groq API key from: https://console.groq.com

Start the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

App runs at: http://localhost:3000

---

## 🚀 Features

- **Auth** — Register/Login with JWT
- **Trip Planning** — Enter destination (+ optional days, budget, date)
- **AI Response** — Tourist spots, famous food, local tips, day-by-day itinerary
- **Trip History** — All past trips saved to MongoDB, viewable on dashboard
- **Dark Theme** — Full dark UI with Syne + DM Sans fonts

## 🔗 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/trip/plan | Yes | Generate AI trip plan |
| GET | /api/trip/my | Yes | Get all user trips |
| GET | /api/trip/:id | Yes | Get single trip |
| DELETE | /api/trip/:id | Yes | Delete a trip |

## 🌐 Deployment

**Backend → Render.com**
- Set environment variables in Render dashboard
- Build command: `npm install`
- Start command: `node server.js`

**Frontend → Vercel**
- Set `REACT_APP_API_URL` to your Render backend URL
- Build command: `npm run build`

---

*Fahim MindWorks — 2025*
