# RoamLog — Backend Service Guide (`backend/GEMINI.md`)

This file guides AI agents when operating within the `backend/` directory of **RoamLog**.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (CommonJS modules)
- **Framework**: Express.js (`^4.18.2`)
- **Database ODM**: Mongoose (`^7.2.4`)
- **Cross-Origin Handling**: `cors` (`^2.8.5`)
- **Process Manager**: `nodemon` (`^2.0.22`) for development

---

## 📂 Architecture & Files

- **`index.js`**:
  - Initializes express app.
  - Attaches `express.json()` and `cors()` middleware.
  - Mounts routes (`/trip` -> `trip.routes.js`, `/hello` -> health check).
  - Listens on `process.env.PORT` (defaults to `3001` or fallback `3000`).
- **`conn.js`**:
  - Connects to MongoDB via `mongoose.connect(process.env.MONGO_URI, ...)`.
  - Logs connection success or trapped errors.
- **`models/trip.model.js`**:
  - Mongoose schema for trips:
    - `tripName` (String, required, min 1, max 50)
    - `startDateOfJourney` (String, required)
    - `endDateOfJourney` (String, required)
    - `nameOfHotels` (String)
    - `placesVisited` (String)
    - `totalCost` (Number)
    - `tripType` (String, enum: `backpacking`, `leisure`, `business`)
    - `experience` (String)
    - `image` (String)
    - `shortDescription` (String, required)
    - `featured` (Boolean, default: false)
    - `createdAt` (Timestamp)
- **`controllers/trip.controller.js`**:
  - `addTrip`: Validates required fields, persists model to MongoDB.
  - `getAllTrips`: Retrieves all trip documents.
  - `getTripById`: Retrieves a specific trip document or sends 404.
  - `deleteTrip`: Removes a trip document by ID or returns error.
- **`routes/trip.routes.js`**:
  - Maps Express router endpoints (`POST /`, `GET /`, `GET /:id`, `DELETE /:id`) to controller functions.

---

## ⚙️ Environment Variables

Located at `backend/.env`:
```env
PORT=3001
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority
```

> **Warning**: Password special characters must be percent-encoded:
> - `@` -> `%40`
> - `!` -> `%21`
> - `#` -> `%23`
> - `$` -> `%24`
> - `%` -> `%25`

---

## 🚀 Commands

```powershell
npm install      # Install dependencies
npm start        # Start server (node index.js)
npm run dev      # Start server with nodemon auto-restart
```

To quickly syntax-check any file after editing:
```powershell
node -c index.js
node -c conn.js
node -c controllers/trip.controller.js
node -c models/trip.model.js
node -c routes/trip.routes.js
```
