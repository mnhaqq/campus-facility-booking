# 🏛️ Campus Facility Booking — Frontend

> **Production-quality** React SPA that integrates with the Laravel 12 REST API backend,
> implements all academic functional requirements, and demonstrates MVC architecture in practice.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Prerequisites](#4-prerequisites)
5. [Local Development Setup](#5-local-development-setup)
6. [Environment Variables](#6-environment-variables)
7. [Scripts](#7-scripts)
8. [API Documentation](#8-api-documentation)
9. [MVC Architecture Explanation](#9-mvc-architecture-explanation)
10. [Deployment Guide](#10-deployment-guide)

---

## 1. Project Overview

The **Campus Facility Booking** system enables students and staff to:

- Browse all available campus facilities (lecture halls, labs, sports venues, etc.)
- View real-time 30-minute slot availability for any facility on any date
- Create bookings by selecting a slot and submitting a form
- Review their complete booking history with status indicators
- Cancel any existing booking

The frontend is a **single-page application** built with React + Vite that communicates
exclusively with the Laravel 12 REST API. No mock data is used anywhere.

---

## 2. Tech Stack

| Layer          | Technology            | Purpose                            |
|----------------|-----------------------|------------------------------------|
| Build tool     | Vite 5                | Dev server + production bundler    |
| UI framework   | React 18              | Component-based view layer         |
| Styling        | Tailwind CSS 3        | Utility-first CSS with custom theme|
| Animation      | Framer Motion 11      | Page transitions, micro-animations |
| Routing        | React Router 6        | Client-side navigation             |
| HTTP client    | Axios 1.6             | REST API calls, interceptors       |
| Linting        | ESLint 8              | Code quality enforcement           |

---

## 3. Folder Structure

```
frontend/
├── index.html                    # Entry HTML (loads Space Grotesk + Inter fonts)
├── vite.config.js                # Vite config with /api proxy
├── tailwind.config.js            # Custom design system tokens
├── postcss.config.js             # PostCSS pipeline
├── .env.example                  # Environment variable template
├── .eslintrc.cjs                 # ESLint rules
├── package.json                  # Dependencies + npm scripts
│
└── src/
    ├── main.jsx                  # ReactDOM.render + theme init
    ├── App.jsx                   # Router + AnimatePresence
    │
    ├── styles/
    │   ├── globals.css           # Tailwind directives + utility classes
    │   └── animations.css        # Keyframe definitions
    │
    ├── services/                 # API layer (MVC: connects View → Controller)
    │   ├── api.js                # Centralized Axios instance
    │   ├── facilityService.js    # GET /facilities, GET /facilities/:id
    │   └── bookingService.js     # CRUD /bookings, GET /availability
    │
    ├── hooks/
    │   ├── useFetch.js           # Generic async data-fetching hook
    │   └── useTheme.js           # Dark/light mode with localStorage
    │
    ├── components/
    │   ├── Navbar.jsx            # Responsive nav with active link pill
    │   ├── Hero.jsx              # Landing hero with live stats
    │   ├── FacilityCard.jsx      # Facility grid card with Book CTA
    │   ├── AvailabilityGrid.jsx  # 30-min slot grid (available/booked/selected)
    │   ├── BookingForm.jsx       # Full booking form + success modal
    │   ├── BookingHistory.jsx    # Filtered list with cancel functionality
    │   ├── StatusBadge.jsx       # Animated color-coded status indicator
    │   ├── Loader.jsx            # Skeleton, spinner, and page loaders
    │   ├── ThemeToggle.jsx       # Dark/light mode toggle button
    │   └── Footer.jsx            # Site footer with links
    │
    └── pages/
        ├── Home.jsx              # Hero + feature section + facility preview
        ├── Facilities.jsx        # Searchable, sortable facility grid
        ├── Booking.jsx           # Availability grid + booking form (main flow)
        ├── History.jsx           # Full booking history with filters
        ├── Contact.jsx           # Contact info + FAQ
        └── NotFound.jsx          # 404 page
```

---

## 4. Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Backend running**: Laravel 12 server on `http://localhost:8000`

> **Start the Laravel backend first:**
> ```bash
> cd ../facility-booking
> php artisan serve
> # Runs on http://localhost:8000
> ```

---

## 5. Local Development Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Copy environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **CORS note:** The Vite dev server proxies all `/api/*` requests to
> `http://localhost:8000/api/*`, so no CORS configuration is needed in development.

---

## 6. Environment Variables

| Variable        | Default | Description                              |
|-----------------|---------|------------------------------------------|
| `VITE_API_URL`  | `/api`  | Backend API base URL. Use `/api` for dev (Vite proxy). In production, set to the full Laravel URL: `https://your-backend.com/api` |
| `VITE_APP_NAME` | `Campus Facility Booking` | Display name |

Create a `.env` file from the template:

```bash
cp .env.example .env
```

**Development `.env`:**
```env
VITE_API_URL=/api
VITE_APP_NAME="Campus Facility Booking"
```

**Production `.env`:**
```env
VITE_API_URL=https://your-laravel-backend.onrender.com/api
VITE_APP_NAME="Campus Facility Booking"
```

---

## 7. Scripts

```bash
npm run dev      # Start Vite development server (hot module replacement)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint across all .js/.jsx files
```

---

## 8. API Documentation

**Base URL:** `http://localhost:8000/api`
**Format:** JSON
**Authentication:** None (public endpoints)

---

### 8.1 GET `/api/facilities`

Retrieve all available campus facilities.

**Method:** `GET`
**URL:** `/api/facilities`
**Auth required:** No

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Main Auditorium",
    "location": "Block A",
    "capacity": 500,
    "created_at": "2026-02-17T11:58:00.000000Z",
    "updated_at": "2026-02-17T11:58:00.000000Z"
  },
  {
    "id": 2,
    "name": "Computer Lab 1",
    "location": "Block C, Floor 2",
    "capacity": 40,
    "created_at": "2026-02-17T11:58:00.000000Z",
    "updated_at": "2026-02-17T11:58:00.000000Z"
  }
]
```

---

### 8.2 GET `/api/facilities/{id}`

Retrieve a single facility by ID.

**Method:** `GET`
**URL:** `/api/facilities/{id}`
**URL Params:** `id` — integer, facility ID

**Response `200 OK`:**
```json
{
  "id": 1,
  "name": "Main Auditorium",
  "location": "Block A",
  "capacity": 500,
  "created_at": "2026-02-17T11:58:00.000000Z",
  "updated_at": "2026-02-17T11:58:00.000000Z"
}
```

**Response `404 Not Found`:**
```json
{
  "message": "Facility not found"
}
```

---

### 8.3 GET `/api/bookings`

Retrieve all bookings with nested facility and user relationships.

**Method:** `GET`
**URL:** `/api/bookings`
**Auth required:** No

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "facility_id": 1,
    "user_id": 1,
    "date": "2026-02-22",
    "start_time": "09:00:00",
    "end_time": "09:30:00",
    "status": "confirmed",
    "created_at": "2026-02-22T08:00:00.000000Z",
    "updated_at": "2026-02-22T08:00:00.000000Z",
    "facility": {
      "id": 1,
      "name": "Main Auditorium",
      "location": "Block A",
      "capacity": 500
    },
    "user": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@campus.edu",
      "role": "user"
    }
  }
]
```

---

### 8.4 POST `/api/bookings`

Create a new facility booking.

**Method:** `POST`
**URL:** `/api/bookings`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-02-25",
  "start_time": "10:00:00",
  "end_time": "10:30:00"
}
```

**Validation Rules:**
| Field         | Rule                                          |
|---------------|-----------------------------------------------|
| `facility_id` | required, integer, exists in facilities table |
| `user_id`     | required, integer, exists in users table      |
| `date`        | required, valid date (YYYY-MM-DD)             |
| `start_time`  | required, time format (HH:mm:ss)             |
| `end_time`    | required, time format, must be after start_time |

**Response `201 Created`:**
```json
{
  "id": 5,
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-02-25",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "status": "confirmed",
  "created_at": "2026-02-22T09:30:00.000000Z",
  "updated_at": "2026-02-22T09:30:00.000000Z"
}
```

**Response `409 Conflict`** (slot already booked):
```json
{
  "message": "Booking conflict detected"
}
```

---

### 8.5 PUT `/api/bookings/{id}`

Update an existing booking (e.g., change status or reschedule).

**Method:** `PUT`
**URL:** `/api/bookings/{id}`
**URL Params:** `id` — integer

**Request Body:**
```json
{
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-02-25",
  "start_time": "11:00:00",
  "end_time": "11:30:00",
  "status": "confirmed"
}
```

**Response `200 OK`:**
```json
{
  "id": 5,
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-02-25",
  "start_time": "11:00:00",
  "end_time": "11:30:00",
  "status": "confirmed",
  "created_at": "2026-02-22T09:30:00.000000Z",
  "updated_at": "2026-02-22T10:00:00.000000Z"
}
```

**Response `404 Not Found`:**
```json
{
  "message": "Booking not found"
}
```

---

### 8.6 DELETE `/api/bookings/{id}`

Cancel and remove a booking.

**Method:** `DELETE`
**URL:** `/api/bookings/{id}`
**URL Params:** `id` — integer

**Response `200 OK`:**
```json
{
  "message": "Booking cancelled"
}
```

**Response `404 Not Found`:**
```json
{
  "message": "Booking not found"
}
```

---

### 8.7 GET `/api/availability`

Check whether a specific time slot is available for a facility on a given date.

**Method:** `GET`
**URL:** `/api/availability`
**Query Parameters:**

| Param         | Type   | Example        | Required |
|---------------|--------|----------------|----------|
| `facility_id` | int    | `1`            | Yes      |
| `date`        | string | `2026-02-25`   | Yes      |
| `start_time`  | string | `09:00:00`     | Yes      |
| `end_time`    | string | `09:30:00`     | Yes      |

**Full URL Example:**
```
GET /api/availability?facility_id=1&date=2026-02-25&start_time=09:00:00&end_time=09:30:00
```

**Response `200 OK` (slot is free):**
```json
{
  "available": true
}
```

**Response `200 OK` (slot is taken):**
```json
{
  "available": false
}
```

---

## 9. MVC Architecture Explanation

The backend is built using the **Model–View–Controller (MVC)** architectural pattern,
implemented through Laravel 12's built-in conventions.

---

### 9.1 Model Layer

**Location:** `facility-booking/app/Models/`

The Model layer represents the **data** and **business rules**. Each Eloquent model
maps directly to a database table and encapsulates:

- **Data attributes** via `$fillable` (mass-assignment safety)
- **Relationships** (Eloquent `hasMany`, `belongsTo`)
- **Automatic timestamps** (`created_at`, `updated_at`)

```
Facility  ←→  Booking  ←→  User
(hasMany)  (belongsTo)  (hasMany)
```

| Model       | Table        | Key Relationships                         |
|-------------|--------------|-------------------------------------------|
| `User`      | `users`      | `hasMany(Booking)`                        |
| `Facility`  | `facilities` | `hasMany(Booking)`                        |
| `Booking`   | `bookings`   | `belongsTo(Facility)`, `belongsTo(User)` |

The Model talks to the database through **Eloquent ORM**, which translates PHP
method calls into SQL queries — abstracting away raw SQL entirely.

---

### 9.2 Controller Layer

**Location:** `facility-booking/app/Http/Controllers/`

Controllers act as the **request handlers** — they receive HTTP requests, invoke
Model queries, apply business logic, and return JSON responses.

| Controller              | Method     | Route                   | Responsibility                              |
|-------------------------|------------|-------------------------|---------------------------------------------|
| `FacilityController`    | `index()`  | `GET /facilities`       | Return all facilities as JSON               |
| `FacilityController`    | `show($id)`| `GET /facilities/{id}`  | Return single facility or 404               |
| `BookingController`     | `index()`  | `GET /bookings`         | Return all bookings with eager-loaded relations |
| `BookingController`     | `store()`  | `POST /bookings`        | Validate, check conflicts, create booking   |
| `BookingController`     | `update()` | `PUT /bookings/{id}`    | Validate, update booking fields             |
| `BookingController`     | `destroy()`| `DELETE /bookings/{id}` | Delete booking, return confirmation         |
| `AvailabilityController`| `check()`  | `GET /availability`     | Query for time-slot overlap, return boolean |

**Example — `BookingController::store()` flow:**
```
1. Receive POST /api/bookings with JSON body
2. Validate: facility_id, user_id, date, start_time, end_time
3. Query DB: does any booking overlap this slot for this facility?
4. If conflict → return 409 JSON
5. If clear → Booking::create([...]) → return 201 JSON
```

---

### 9.3 View Layer (Frontend = React SPA)

In this implementation, the **View layer is entirely decoupled** from the backend
and runs as a React Single-Page Application.

The React frontend fulfils the View responsibility:
- **Pages** (`/pages`) are top-level view containers
- **Components** (`/components`) are reusable UI elements
- **Services** (`/services`) translate API calls into React-usable data

```
React Component
     │
     ▼
bookingService.create(payload)         ← Service layer
     │
     ▼
api.post('/bookings', payload)         ← Axios (centralized instance)
     │
     ▼
POST http://localhost:8000/api/bookings  ← HTTP over the network
     │
     ▼
BookingController::store()             ← Laravel Controller
     │
     ▼
Booking::create([...])                 ← Eloquent Model
     │
     ▼
MySQL / SQLite database                ← Persistent storage
     │
     ▼  (response travels back up)
{ id, status, date, ... }              ← JSON response
     │
     ▼
React state update → UI re-renders     ← View layer updates
```

---

### 9.4 How MVC Maps to This Project

| MVC Role   | Backend (Laravel)                  | Frontend (React)                   |
|------------|------------------------------------|------------------------------------|
| **Model**  | `Facility.php`, `Booking.php`, `User.php` | Axios response data (raw JSON)  |
| **View**   | *(delegated to React SPA)*         | All `.jsx` components and pages    |
| **Controller** | `FacilityController.php`, `BookingController.php`, `AvailabilityController.php` | `facilityService.js`, `bookingService.js` (thin adapters) |

---

## 10. Deployment Guide

### Option A — Render (Recommended)

Render can host both the Laravel backend (as a Web Service) and the React frontend
(as a Static Site) from the same repository.

**Frontend (Static Site):**

1. Go to [render.com](https://render.com) → **New Static Site**
2. Connect your GitHub repository
3. Configure:

| Setting          | Value                        |
|------------------|------------------------------|
| Root Directory   | `frontend`                   |
| Build Command    | `npm install && npm run build`|
| Publish Directory| `frontend/dist`              |

4. Add environment variable:

| Key             | Value                                  |
|-----------------|----------------------------------------|
| `VITE_API_URL`  | `https://your-laravel-backend.onrender.com/api` |

5. Click **Create Static Site** — Render builds and deploys automatically.

> **CORS for production:** Add `FRONTEND_URL` to the Laravel `.env` and configure
> `config/cors.php` to allow requests from your Render frontend domain.

---

### Option B — Vercel

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. From the `frontend/` directory:
   ```bash
   vercel
   ```
3. Configure in the Vercel dashboard:

| Setting           | Value          |
|-------------------|----------------|
| Framework Preset  | Vite           |
| Root Directory    | `frontend`     |
| Build Command     | `npm run build`|
| Output Directory  | `dist`         |

4. Add environment variable `VITE_API_URL` in **Settings → Environment Variables**.

5. Add a `vercel.json` for SPA routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```

---

### Option C — Netlify

1. Go to [netlify.com](https://netlify.com) → **Add New Site → Import from Git**
2. Configure:

| Setting          | Value          |
|------------------|----------------|
| Base directory   | `frontend`     |
| Build command    | `npm run build`|
| Publish directory| `dist`         |

3. Add environment variable `VITE_API_URL` in **Site Settings → Environment Variables**.

4. Create `frontend/public/_redirects` for SPA routing:
   ```
   /*  /index.html  200
   ```

---

### Production Checklist

- [ ] Backend deployed and accessible via HTTPS
- [ ] `VITE_API_URL` set to full backend URL (e.g., `https://api.campus.edu/api`)
- [ ] CORS enabled in Laravel (`config/cors.php`) to allow frontend origin
- [ ] Database seeded with at least one `User` record (required for `user_id` field)
- [ ] `npm run build` completes without errors
- [ ] SPA redirect rule configured (Vercel/Netlify) so direct URLs work

---

## Quick Start Summary

```bash
# Backend (terminal 1)
cd campus-facility-booking/facility-booking
php artisan serve

# Frontend (terminal 2)
cd campus-facility-booking/frontend
cp .env.example .env
npm install
npm run dev

# Open browser
open http://localhost:5173
```

---

*Built with React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · Laravel 12*
