# RoamLog — Frontend Client Guide (`frontend/GEMINI.md`)

This file guides AI agents when operating within the `frontend/` directory of **RoamLog**.

---

## 🛠️ Technology Stack

- **Runtime / Framework**: React 18 (`react-dom/client`)
- **Routing**: `react-router-dom` v6 (`createBrowserRouter`, `RouterProvider`)
- **HTTP Client**: `axios`
- **UI Framework**: Bootstrap 5.3 + custom CSS in `App.css`

---

## 📂 Architecture & Key Components

- **`src/index.js`**:
  - Uses `ReactDOM.createRoot` to mount `<App />` inside `#root`.
- **`src/App.js`**:
  - Configures client routing:
    - `/` -> `<Home />`
    - `/addexperience` -> `<AddExperience />`
    - `/experience/:id` -> `<ExperienceDetails />`
- **`src/url.js`**:
  - Exports `baseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"`
- **`src/components/UIC/Header.js`**:
  - Sticky top navbar with RoamLog compass branding, navigation to `All Journeys` and `Log an Experience` button.
- **`src/components/UIC/Card.js`**:
  - Standard journey card displaying title, cover photo, dates, trip type badge, excerpt, detail link, and delete action.
- **`src/components/UIC/FeaturedCard.js`**:
  - Enhanced visual card with green borders and a `Featured` badge for journeys flagged with `featured: true`.
- **`src/components/pages/Home.js`**:
  - Fetches all journeys via `GET ${baseUrl}/trip`.
  - Implements live search filtering (title, places, category, snippet).
  - Organizes journeys into time-based sections:
    - **Last Month** (past 30 days)
    - **Last 6 Month** (31 - 180 days)
    - **Last Year** (181 - 365 days)
    - **Last Memories** (365+ days)
- **`src/components/pages/AddExperience.js`**:
  - Comprehensive form to create a new journey.
  - Client-side validation:
    - Required fields check (`tripName`, `startDateOfJourney`, `endDateOfJourney`, `shortDescription`).
    - Date sanity check: `endDateOfJourney >= startDateOfJourney`.
    - Cost check: `totalCost >= 0`.
    - Live cover photo URL preview before saving.
- **`src/components/pages/ExperienceDetails.js`**:
  - Displays full trip details, hero photo, metadata badges, places visited, hotels stayed, cost, and narrative story.

---

## ⚙️ Environment Variables

Located at `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

---

## 🚀 Commands

```powershell
npm install      # Install dependencies
npm start        # Launch dev server on http://localhost:3000
npm run build    # Compile production-ready bundle to build/
```

> **Verification**: Always run `npm run build` after editing frontend components to ensure there are no JSX, import, or build errors.
