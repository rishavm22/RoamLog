# 🧭 RoamLog — Frontend Client

The frontend client for **RoamLog** built with **React 18**, **React Router v6**, and **Bootstrap 5.3**.

---

## 🛠️ Features

- 🕒 **Time-Based Journey Sections**:
  - Automatically sorts and categorizes trips into:
    - **Last Month** (Last 30 days)
    - **Last 6 Month** (1 - 6 months ago)
    - **Last Year** (6 months - 1 year ago)
    - **Last Memories** (Over 1 year ago)
- 🔍 **Live Search Filter**: Search through trips instantly by name, destination, trip type, or description.
- 🗂️ **Interactive Filter Pills**: View all journeys or isolate specific time periods with live counts.
- ✍️ **Robust Form Validations**:
  - Form validation on required fields.
  - Date validation enforcing that the journey end date is not earlier than the start date.
  - Total cost validation (must be non-negative).
  - Valid image URL structure checks.
- 🖼️ **Live Photo Preview**: Live rendering of cover photos as URLs are pasted.
- 🗑️ **Trip Deletion**: Instant UI card removal with server deletion and user confirmation.
- ⭐ **Featured Cards**: Highlighted green borders and featured tags for top journeys.

---

## 📂 Component Architecture

```text
frontend/src/
├── components/
│   ├── pages/
│   │   ├── Home.js                 # Main landing feed with category sections, search & filters
│   │   ├── AddExperience.js        # Journey logger form with live previews & validations
│   │   └── ExperienceDetails.js    # Single trip view with photo hero, budget, & story
│   └── UIC/
│       ├── Header.js               # Responsive sticky navbar with RoamLog branding
│       ├── Card.js                 # Standard journey card with delete & detail actions
│       └── FeaturedCard.js         # Highlighted featured journey card
├── App.js                          # Client-side routing with createBrowserRouter
├── index.js                        # React 18 createRoot bootstrap
├── url.js                          # Base URL resolver for the backend API
└── App.css                         # Custom styling overrides
```

---

## ⚙️ Environment Variables (`.env`)

By default, the client points to `http://localhost:3001`. To customize the backend URL:

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

---

## 🚀 Available Scripts

In the `frontend/` directory, you can run:

### `npm install`
Installs all dependencies.

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page reloads automatically when you edit files.

### `npm run build`
Builds the production-ready bundle to the `build` directory, optimized for deployment.

### `npm test`
Launches the test runner in interactive watch mode.
