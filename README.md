# 🧭 RoamLog — Every journey, remembered.
 
> **RoamLog** (TravelMemory) is a modern, full-stack travel journaling platform (MERN) designed to help you document, organize, and relive your journeys. Journeys are dynamically categorized across time—**Last Month**, **Last 6 Month**, **Last Year**, and **Last Memories**—with rich details, photo galleries, budget tracking, and real-time search.
>
> The application is deployed on **AWS** using a **2+2 scaling architecture**: two frontend and two backend EC2 instances, built from AMIs and fronted by dedicated Application Load Balancers, with data stored in **MongoDB Atlas**.
 
| | |
| :--- | :--- |
| **Live application** | <http://travelmemory-frontend-alb-1826252849.ap-south-1.elb.amazonaws.com> |
| **Backend health check** | <http://travelmemory-backend-alb-526197863.ap-south-1.elb.amazonaws.com/hello> |
| **Repository** | <https://github.com/rishavm22/RoamLog> |
| **Author** | Rishav Mishra |
 
---
 
## 📑 Table of Contents
 
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start Guide (Local)](#quick-start)
- [API Reference](#api-reference)
- [AWS Deployment Guide](#aws-deployment)
  - [Step 1 — Compute: EC2 instances](#deploy-ec2)
  - [Step 2 — Golden images: AMIs](#deploy-ami)
  - [Step 3 — Network security: security groups](#deploy-sg)
  - [Step 4 — Target groups](#deploy-tg)
  - [Step 5 — Application Load Balancers](#deploy-alb)
  - [Step 6 — End-to-end verification](#deploy-verify)
- [Common Troubleshooting](#troubleshooting)
- [License](#license)
---
 
<a id="features"></a>
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
 
<a id="tech-stack"></a>
## 🧰 Tech Stack
 
- **Frontend**: React 18, React Router v6, Axios, Bootstrap 5.3
- **Backend**: Node.js, Express.js, Mongoose 7, CORS, Dotenv
- **Database**: MongoDB Atlas (or local MongoDB)
- **Infrastructure (AWS, `ap-south-1`)**: EC2 (`t4g.nano`), Amazon Machine Images (AMIs), Application Load Balancers, Target Groups, Security Groups, VPC
- **Process management**: `systemd` services on every instance
- **Web tier**: Nginx serving the React single-page app on the frontend instances
---
 
<a id="architecture"></a>
## 📐 Architecture
 
The deployment follows a **2+2 scaling architecture**: a frontend tier and a backend tier, each made of two identical EC2 instances behind its own internet-facing Application Load Balancer. The backend instances connect to a MongoDB Atlas cluster over port `27017`.
 
<p align="center">
  <img src="docs/images/architecture-diagram.png" alt="RoamLog AWS deployment architecture diagram" width="760">
</p>
<p align="center"><em>RoamLog deployment architecture on AWS</em></p>
### Request flow
 
1. A user opens the **frontend ALB** (`travelmemory-frontend-alb`) in the browser over HTTP on port `80`.
2. The frontend ALB distributes traffic across the two **frontend instances** (`frontend-master`, `frontend-2`), which serve the React SPA via Nginx.
3. The React app sends its API calls to the **backend ALB** (`travelmemory-backend-alb`).
4. The backend ALB distributes the requests across the two **backend instances** (`backend-master`, `backend-2`) running Node.js / Express.
5. The backend instances read and write trips in **MongoDB Atlas** over port `27017`.
### Components
 
| Tier | Component | Details |
| :--- | :--- | :--- |
| Entry | Frontend ALB | `travelmemory-frontend-alb` — internet-facing, HTTP:80 → `travelmemory-frontend-tg` |
| Entry | Backend ALB | `travelmemory-backend-alb` — internet-facing, HTTP:80 → `travelmemory-backend-tg` |
| Frontend | `frontend-master`, `frontend-2` | EC2 `t4g.nano`, Nginx + React SPA, run as `systemd` services |
| Backend | `backend-master`, `backend-2` | EC2 `t4g.nano`, Node.js / Express API, run as `systemd` services |
| Data | MongoDB Atlas | Managed cloud database, accessed on port `27017` |
| Images | `travelmemory-frontend-ami`, `travelmemory-backend-ami` | Golden AMIs created from the master instances for horizontal scaling |
| Security | `travelmemory-alb-sg`, `travelmemory-ec2-sg` | Security groups for the load balancers and the EC2 instances |
 
---
 
<a id="project-structure"></a>
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
├── docs/
│   └── images/               # Architecture diagram & AWS deployment screenshots
└── README.md
```
 
---
 
<a id="quick-start"></a>
## 🚀 Quick Start Guide (Local)
 
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
 
<a id="api-reference"></a>
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
 
<a id="aws-deployment"></a>
## ☁️ AWS Deployment Guide
 
This section documents the production deployment on AWS (region `ap-south-1`, Mumbai). Every step is backed by a screenshot taken from the AWS Console.
 
### Deployment at a glance
 
| Layer | Resources |
| :--- | :--- |
| **Compute** | 4 × EC2 `t4g.nano`: `frontend-master`, `frontend-2`, `backend-master`, `backend-2` |
| **Images** | `travelmemory-frontend-ami`, `travelmemory-backend-ami` |
| **Security groups** | `travelmemory-alb-sg` (load balancers), `travelmemory-ec2-sg` (instances) |
| **Target groups** | `travelmemory-frontend-tg`, `travelmemory-backend-tg` — HTTP:80, target type *Instance* |
| **Load balancers** | `travelmemory-frontend-alb`, `travelmemory-backend-alb` — internet-facing, IPv4, 3 Availability Zones |
| **Database** | MongoDB Atlas cluster (port `27017`) |
| **Process management** | `systemd` services on every instance |
 
### Deployment flow
 
```text
 1. Launch master instances      frontend-master + backend-master
 2. Create golden AMIs           travelmemory-frontend-ami + travelmemory-backend-ami
 3. Scale out from the AMIs      frontend-2 + backend-2          →  2 + 2 instances
 4. Create security groups       travelmemory-alb-sg + travelmemory-ec2-sg
 5. Create target groups         travelmemory-backend-tg + travelmemory-frontend-tg
 6. Create the ALBs              backend ALB first, then frontend ALB
 7. Verify                       /hello on the backend ALB, UI on the frontend ALB
```
 
> [!NOTE]
> **Application configuration on the instances.** The backend reads `PORT` and `MONGO_URI` from its `.env` file, and the frontend reads the API address from `REACT_APP_BACKEND_URL` (see [Quick Start](#quick-start)). For this deployment the frontend points at the **backend ALB** DNS name. Because the backend instances connect to MongoDB Atlas, the Atlas **Network Access** list must allow the public IP of **every** backend instance, including instances launched from the AMI.
 
---
 
<a id="deploy-ec2"></a>
### Step 1 — Compute: EC2 instances
 
Four instances make up the 2+2 layout: `frontend-master`, `backend-master`, `frontend-2` and `backend-2`. All of them are `t4g.nano` instances in `ap-south-1b`, are in the **Running** state, and pass **3/3 status checks**.
 
![EC2 instances — all four running with 3/3 status checks](docs/images/01-ec2-instances.png)
 
*EC2 console: four running instances*
 
<a id="deploy-ami"></a>
### Step 2 — Golden images: AMIs
 
Golden images were created from the two master instances — `travelmemory-frontend-ami` and `travelmemory-backend-ami` — so that each tier can be scaled horizontally. The second instance of each tier (`frontend-2`, `backend-2`) is the scaled-out copy.
 
<!-- TODO: add the AMI list screenshot as docs/images/02-amis.png and uncomment the next two lines.
![Amazon Machine Images — frontend and backend AMIs](docs/images/02-amis.png)
*EC2 console: AMIs created from the master instances*
-->
 
<a id="deploy-sg"></a>
### Step 3 — Network security: security groups
 
Two dedicated security groups are used: `travelmemory-alb-sg` for the load balancers and `travelmemory-ec2-sg` for the EC2 instances.
 
![Security groups overview with travelmemory-ec2-sg and travelmemory-alb-sg highlighted](docs/images/03-security-groups-overview.png)
 
*Security groups overview (the two project groups are highlighted)*
 
#### Load balancer security group — `travelmemory-alb-sg`
 
Public-facing group for the load balancers. It allows inbound **HTTP (80)** and **HTTPS (443)** from the internet (`0.0.0.0/0`).
 
![travelmemory-alb-sg inbound rules — HTTPS 443 and HTTP 80](docs/images/04-alb-security-group.png)
 
*`travelmemory-alb-sg` inbound rules*
 
#### EC2 security group — `travelmemory-ec2-sg`
 
Group attached to the application instances. Its inbound rules open **TCP 3001** (backend application port), **HTTP 80** and **SSH 22**.
 
![travelmemory-ec2-sg inbound rules — TCP 3001, HTTP 80 and SSH 22](docs/images/05-ec2-security-group.png)
 
*`travelmemory-ec2-sg` inbound rules*
 
<a id="deploy-tg"></a>
### Step 4 — Target groups
 
Two target groups group the instances of each tier for traffic distribution: `travelmemory-backend-tg` and `travelmemory-frontend-tg`. Both use **HTTP on port 80** with target type **Instance**.
 
![Target groups — travelmemory-backend-tg and travelmemory-frontend-tg](docs/images/06-target-groups.png)
 
*Target groups for the backend and frontend tiers*
 
<a id="deploy-alb"></a>
### Step 5 — Application Load Balancers
 
Two internet-facing Application Load Balancers — `travelmemory-backend-alb` and `travelmemory-frontend-alb` — are **Active** and span three Availability Zones (`ap-south-1a`, `1b`, `1c`).
 
![Load balancers overview — both ALBs active](docs/images/07-load-balancers-overview.png)
 
*Load balancers overview*
 
#### 5.1 Backend ALB — `travelmemory-backend-alb`
 
Created on **October 25, 2026**. The listener forwards **HTTP:80** to `travelmemory-backend-tg`, and both backend instances register as **Healthy**.
 
**Details**
 
![travelmemory-backend-alb details](docs/images/08-backend-alb-details.png)
 
*Backend ALB details*
 
**Listeners and rules**
 
![Backend ALB listener — HTTP:80 forwards to travelmemory-backend-tg](docs/images/09-backend-alb-listeners.png)
 
*Backend ALB listener: HTTP:80 → `travelmemory-backend-tg`*
 
**Resource map**
 
![Backend ALB resource map — 2 healthy targets](docs/images/10-backend-alb-resource-map.png)
 
*Backend ALB resource map: listener → rule → target group → 2 healthy targets*
 
#### 5.2 Frontend ALB — `travelmemory-frontend-alb`
 
Created on **October 26, 2026**. The listener forwards **HTTP:80** to `travelmemory-frontend-tg`, and both frontend instances register as **Healthy**.
 
**Details**
 
![travelmemory-frontend-alb details](docs/images/11-frontend-alb-details.png)
 
*Frontend ALB details*
 
**Listeners and rules**
 
![Frontend ALB listener — HTTP:80 forwards to travelmemory-frontend-tg](docs/images/12-frontend-alb-listeners.png)
 
*Frontend ALB listener: HTTP:80 → `travelmemory-frontend-tg`*
 
**Resource map**
 
![Frontend ALB resource map — 2 healthy targets](docs/images/13-frontend-alb-resource-map.png)
 
*Frontend ALB resource map: listener → rule → target group → 2 healthy targets*
 
<a id="deploy-verify"></a>
### Step 6 — End-to-end verification
 
#### 6.1 Backend API health check
 
Opening `/hello` on the backend ALB DNS name returns `Hello World!`, confirming the backend ALB routes external requests to a healthy backend instance.
 
```bash
curl http://travelmemory-backend-alb-526197863.ap-south-1.elb.amazonaws.com/hello
# Hello World!
```
 
![Backend health check — /hello returns Hello World!](docs/images/14-backend-health-check.png)
 
*Backend ALB `/hello` health check*
 
#### 6.2 Frontend web application
 
The RoamLog UI loads through the frontend ALB DNS name. The screenshot below shows the empty state of a fresh database (**0 Journeys Logged**); the search bar and the time-based category filters (Last Month, Last 6 Month, Last Year, Last Memories) are rendered as expected.
 
![RoamLog frontend served through the frontend ALB](docs/images/15-frontend-app.png)
 
*RoamLog served via `travelmemory-frontend-alb`*
 
To confirm full database connectivity, log a trip through the UI (or `POST /trip`) and check that it appears under `GET /trip` on the backend ALB:
 
```bash
curl http://travelmemory-backend-alb-526197863.ap-south-1.elb.amazonaws.com/trip
```
 
---
 
<a id="troubleshooting"></a>
## 🔧 Common Troubleshooting
 
| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `querySrv ENOTFOUND` | MongoDB cluster is paused or hostname is mistyped. | Resume the cluster on MongoDB Atlas and verify the hostname in `backend/.env`. |
| `SSL routines:... SSL alert number 80` | Client IP is not whitelisted on MongoDB Atlas. | Add your IP under Atlas **Network Access** → **IP Access List**. On AWS, add the public IP of every backend instance. |
| `End date cannot be earlier than start date` | Form validation error on Add Experience. | Ensure the journey end date is on or after the start date. |
| CORS Errors | Backend port mismatch. | Verify backend runs on `3001` or matches `REACT_APP_BACKEND_URL`. |
| Target shows **Unhealthy** in a target group | The service is not running on the target port, or the instance security group blocks the load balancer. | Check `systemctl status` on the instance and confirm the port in `travelmemory-ec2-sg` matches the target group port (`80`). |
| UI loads but shows no data on AWS | The frontend is not pointing at the backend ALB, or the backend cannot reach Atlas. | Check `REACT_APP_BACKEND_URL` (it is read at build time), then open `/hello` and `/trip` on the backend ALB. |
 
---
