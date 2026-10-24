# 🧭 RoamLog — Every journey, remembered.

> **RoamLog** is a modern, full-stack travel journaling platform (MERN) designed to help you document, organize, and relive your journeys. Journeys are dynamically categorized across time—**Last Month**, **Last 6 Month**, **Last Year**, and **Last Memories**—with rich details, photo galleries, budget tracking, and real-time search.

---

## ✨ Features

- 🕒 **Time-Based Categorization**: Automatically categorizes your travels into:
  - **Last Month** (Adventures from the past 30 days)
  - **Last 6 Month** (Journeys from 1 to 6 months ago)
  - **Last Year** (Memories from 6 months to 1 year ago)
  - **Last Memories** (Timeless adventures older than 1 year)
- ⭐ **Featured Highlights**: Pin your most memorable journeys to the top with high-visibility featured badges.
- 🔍 **Live Search & Filter**: Filter instantly by keyword, destination, title, or travel category (`Backpacking`, `Leisure`, `Business`).
- ✍️ **Robust Experience Logger**:
  - Comprehensive client-side validations (date constraints, cost ranges, required fields).
  - Live cover photo URL preview before publishing.
  - Multi-category trip organization (dates, hotels, places visited, costs, and full travel stories).
- 🗑️ **Trip Management**: Delete experiences with confirmation prompts and real-time UI updates.
- 📱 **Responsive & Modern UI**: Built with Bootstrap 5, custom gradients, clean typography, and mobile-friendly layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Bootstrap 5.3
- **Backend**: Node.js, Express.js, Mongoose 7, CORS, Dotenv
- **Database**: MongoDB Atlas (or local MongoDB)

---

## 📂 Project Structure

```text
RoamLog/
├── backend/                  # Express REST API
│   ├── controllers/          # Trip controllers (CRUD)
│   ├── models/               # Mongoose trip schema
│   ├── routes/               # Trip API routes
│   ├── .env                  # Backend environment variables
│   ├── conn.js               # MongoDB connection handler
│   ├── index.js              # Server entry point
│   └── package.json
├── frontend/                 # React 18 Client
│   ├── public/               # Public HTML & assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/        # Home, AddExperience, ExperienceDetails
│   │   │   └── UIC/          # Header, Card, FeaturedCard
│   │   ├── App.js            # Router configuration
│   │   ├── index.js          # React DOM render
│   │   └── url.js            # API base URL configuration
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18.x or newer recommended)
- **npm** (v9.x or newer)
- **MongoDB Atlas** account (or a local MongoDB instance)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=3001
   MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority
   ```

   > [!IMPORTANT]
   > If your MongoDB password contains special characters (like `@`, `#`, `$`, `%`), make sure to **URL-encode** them (for example, `@` becomes `%40`).

   > [!TIP]
   > In **MongoDB Atlas**, make sure your current IP address is whitelisted:
   > Go to **Security** → **Network Access** → **Add IP Address** → Choose **Add Current IP Address** (or `0.0.0.0/0`).

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will start at: `http://localhost:3001`

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Configure custom backend URL:
   By default, the frontend connects to `http://localhost:3001`. If your backend runs on a different port or host, create a `.env` file in `frontend/`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The application will automatically open at: `http://localhost:3000`

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/trip` | Retrieve all travel experiences |
| `GET` | `/trip/:id` | Retrieve single travel experience by ID |
| `POST` | `/trip` | Create a new travel experience |
| `DELETE` | `/trip/:id` | Delete a travel experience by ID |
| `GET` | `/hello` | Server health check endpoint |

### Sample POST Request Body (`POST /trip`):

```json
{
  "tripName": "Autumn in Manali",
  "startDateOfJourney": "2026-10-10",
  "endDateOfJourney": "2026-10-16",
  "nameOfHotels": "Himalayan River Resort",
  "placesVisited": "Solang Valley, Old Manali, Rohtang Pass",
  "totalCost": 18500,
  "tripType": "backpacking",
  "experience": "Hiking through pine forests in autumn was breathtaking. Explored Old Manali cafes and witnessed first snow flurries at Rohtang Pass.",
  "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
  "shortDescription": "Crisp autumn mountain breezes and scenic valley treks.",
  "featured": true
}
```

---

## 🔧 Common Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `querySrv ENOTFOUND` | MongoDB cluster is paused or hostname is mistyped. | Resume the cluster on MongoDB Atlas and verify the hostname in `backend/.env`. |
| `SSL routines:... SSL alert number 80` | Client IP is not whitelisted on MongoDB Atlas. | Add your IP under Atlas **Network Access** → **IP Access List**. |
| `End date cannot be earlier than start date` | Form validation error on Add Experience. | Ensure the journey end date is on or after the start date. |
| CORS Errors | Backend port mismatch. | Verify backend runs on `3001` or matches `REACT_APP_BACKEND_URL`. |

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
