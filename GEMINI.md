# RoamLog — Agent & Development Context (`GEMINI.md`)

This guide provides immediate architectural context, conventions, and operational instructions for AI agents (and developers) working on the **RoamLog** project.

---

## 🧭 Project Identity & Core Rules

1. **Application Name**: **RoamLog**
   - Tagline: *"Every journey, remembered."*
   - Never use or reintroduce legacy names such as `TravelMemory`. The project is solely **RoamLog**.
2. **Repository Architecture**: Monorepo with two decoupled subprojects:
   - `backend/`: Express.js + Mongoose REST API server.
   - `frontend/`: React 18 SPA (React Router v6, Bootstrap 5.3).
3. **Environment**:
   - Operating System: Windows. Always format shell commands for PowerShell.
   - When searching files, **always exclude** `node_modules`, `build`, `dist`, and `.git` directories to prevent command timeouts.

---

## 📂 Project Structure Overview

```text
RoamLog/
├── backend/
│   ├── controllers/
│   │   └── trip.controller.js      # CRUD operations for Trip resources
│   ├── models/
│   │   └── trip.model.js           # Mongoose Trip schema & validation
│   ├── routes/
│   │   └── trip.routes.js          # REST routes mapped to /trip
│   ├── conn.js                     # MongoDB connection with error logging
│   ├── index.js                    # Express app bootstrap & CORS config
│   ├── package.json                # roamlog-backend dependencies
│   ├── GEMINI.md                   # Backend-specific agent context
│   └── .env                        # PORT=3001, MONGO_URI=...
├── frontend/
│   ├── public/
│   │   ├── index.html              # HTML shell & Bootstrap CDN imports
│   │   └── manifest.json           # PWA metadata for RoamLog
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Home.js              # Feed with time-buckets & search
│   │   │   │   ├── AddExperience.js     # Form with live preview & validations
│   │   │   │   └── ExperienceDetails.js # Single journey detail & story view
│   │   │   └── UIC/
│   │   │       ├── Header.js            # Sticky brand navbar
│   │   │       ├── Card.js              # Standard journey card
│   │   │       └── FeaturedCard.js      # Highlighted featured journey card
│   │   ├── App.js                  # createBrowserRouter client routing
│   │   ├── index.js                # React 18 createRoot bootstrap
│   │   ├── url.js                  # API base URL resolver (PORT 3001 default)
│   │   └── App.css                 # Custom styles & badge themes
│   ├── package.json                # roamlog-frontend dependencies
│   ├── GEMINI.md                   # Frontend-specific agent context
│   └── .env                        # REACT_APP_BACKEND_URL (optional)
├── AGENTS.md                       # Multi-agent collaboration guide
├── GEMINI.md                       # This root context file
└── README.md                       # Main project documentation
```

---

## ⚙️ Environment & Configuration

### Backend (`backend/.env`)
```env
PORT=3001
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority
```
> **Notice**: MongoDB passwords with special characters (e.g. `@`, `#`, `$`, `%`) must be URL-encoded (e.g., `@` becomes `%40`).

### Frontend (`frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

---

## 🚀 Common Commands

### Backend
```powershell
cd backend
npm install       # Install dependencies
npm start         # Run production server (node index.js)
npm run dev       # Run dev server with nodemon
```

### Frontend
```powershell
cd frontend
npm install       # Install dependencies
npm start         # Start webpack dev server on http://localhost:3000
npm run build     # Compile production build to frontend/build/
```

---

## 📡 REST API & Schema Reference

### Mongoose Schema (`backend/models/trip.model.js`)
| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `tripName` | `String` | Yes | 1 to 50 characters, trimmed |
| `startDateOfJourney` | `String` | Yes | Format: `YYYY-MM-DD` |
| `endDateOfJourney` | `String` | Yes | Format: `YYYY-MM-DD` |
| `nameOfHotels` | `String` | No | Free-text hotel names |
| `placesVisited` | `String` | No | Comma-separated or free text |
| `totalCost` | `Number` | No | Non-negative integer or float |
| `tripType` | `String` | No | Enum: `backpacking`, `leisure`, `business` |
| `experience` | `String` | No | Full narrative/story of the journey |
| `image` | `String` | No | Valid image URL |
| `shortDescription` | `String` | Yes | Card teaser snippet |
| `featured` | `Boolean` | No | Defaults to `false` |
| `createdAt` | `Date` | Auto | Managed by Mongoose timestamps |

### Endpoints
- `GET /hello` — Healthcheck endpoint
- `GET /trip` — Fetch all trips
- `GET /trip/:id` — Fetch trip by MongoDB ObjectId
- `POST /trip` — Create new trip (validates required fields)
- `DELETE /trip/:id` — Delete trip by MongoDB ObjectId

---

## 🎨 UI Conventions & Time Categorization

The home page (`frontend/src/components/pages/Home.js`) dynamically groups journeys based on `startDateOfJourney` into four sections:
1. **Last Month**: Journeys within the past 30 days.
2. **Last 6 Month**: Journeys between 30 and 180 days ago.
3. **Last Year**: Journeys between 180 and 365 days ago.
4. **Last Memories**: Journeys older than 365 days.

### Client-Side Validation Rules (`AddExperience.js`)
- `endDateOfJourney` must not be earlier than `startDateOfJourney`.
- `totalCost` must be `0` or positive.
- Cover photo URL (if supplied) is validated via live image preview before form submission.
