# 🧭 RoamLog — Backend API

This is the Express & Mongoose REST API server powering **RoamLog**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **ODM**: Mongoose 7.2
- **Environment Management**: Dotenv
- **Cross-Origin Resource Sharing**: CORS

---

## 📂 Directory Structure

```text
backend/
├── controllers/
│   └── trip.controller.js      # Business logic for Trip CRUD operations
├── models/
│   └── trip.model.js           # Mongoose Trip Schema & Model definition
├── routes/
│   └── trip.routes.js          # Express route definitions for /trip
├── conn.js                     # MongoDB connection initialization with error trapping
├── index.js                    # Server bootstrap and middleware configuration
├── package.json                # Dependencies and start scripts
└── .env                        # Configuration (PORT, MONGO_URI)
```

---

## ⚙️ Configuration (`.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=3001
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority
```

> [!IMPORTANT]
> If your password contains special characters (`@`, `#`, `$`, `%`, etc.), percent-encode them in the connection string:
> - `@` → `%40`
> - `!` → `%21`
> - `#` → `%23`

---

## 🚀 Running the Server

### 1. Install Dependencies
```bash
npm install
```

### 2. Start in Production Mode
```bash
npm start
```

### 3. Start in Development Mode (Auto-reload with nodemon)
```bash
npm run dev
```

The server listens on `http://localhost:3001` (or your configured `PORT`).

---

## 📡 REST API Specifications

### Health Check
- **`GET /hello`**
  - Response: `"Hello World!"`

### Trip Endpoints (`/trip`)

#### 1. Get All Trips
- **`GET /trip`**
  - **Response `200 OK`**: Array of all trips.

#### 2. Get Trip by ID
- **`GET /trip/:id`**
  - **Parameters**: `id` (MongoDB ObjectId)
  - **Response `200 OK`**: Trip object.
  - **Response `404 / Error`**: `"Nothing in database"` or `"SOMETHING WENT WRONG"`.

#### 3. Create a Trip
- **`POST /trip`**
  - **Headers**: `Content-Type: application/json`
  - **Body Schema**:
    ```json
    {
      "tripName": "string (required, 1-50 chars)",
      "startDateOfJourney": "string (required, YYYY-MM-DD)",
      "endDateOfJourney": "string (required, YYYY-MM-DD)",
      "nameOfHotels": "string (optional)",
      "placesVisited": "string (optional)",
      "totalCost": "number (optional)",
      "tripType": "string (enum: 'backpacking' | 'leisure' | 'business')",
      "experience": "string (optional)",
      "image": "string (optional, valid URL)",
      "shortDescription": "string (required)",
      "featured": "boolean (default: false)"
    }
    ```
  - **Response `200 OK`**: `"Trip added Successfully"`

#### 4. Delete a Trip
- **`DELETE /trip/:id`**
  - **Parameters**: `id` (MongoDB ObjectId)
  - **Response `200 OK`**: `"Trip deleted Successfully"`
  - **Response `404 Not Found`**: `"Trip not found"`
