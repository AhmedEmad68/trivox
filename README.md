# TriVox Travel

> Discover Egypt — tours, transfers, and authentic experiences. A full-stack tourism marketplace.

![Stack: Django](https://img.shields.io/badge/Backend-Django%205.2-092E20?logo=django&logoColor=white)
![Stack: DRF](https://img.shields.io/badge/API-DRF%203.17-A30000)
![Stack: Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?logo=next.js&logoColor=white)
![Stack: React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Stack: TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Stack: TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)

TriVox is a two-layer travel marketplace:

- **Backend** — Django 5 + Django REST Framework + SimpleJWT — exposes a JSON API at `/api/v1/`.
- **Frontend** — Next.js 15 (App Router) + React 19 + TypeScript + TailwindCSS — talks to the API through a typed service layer.

For the complete manual, see **[DOCUMENTATION.md](DOCUMENTATION.md)**.

---

## ✨ Features

- 🗺 **Browse** tours, transfers and experiences with rich filters (type, location, price, rating, duration, cancellation policy, sorting).
- 📍 **Destinations** — Cairo, Giza, Luxor, Aswan, Alexandria, Hurghada, Sinai, Siwa Oasis — each with a hero, highlights, climate, currency and best-time-to-visit.
- 🛒 **4-step booking flow** with server-side pricing (5 % tax), participants per type (adult / child / infant), optional add-ons, and transfer-specific fields (pickup, flight number, hotel).
- 🔐 **JWT auth** — register, login, password change, forgot-password (UUID token, 30-min expiry), token refresh.
- 👤 **User dashboard** — bookings list & detail, cancellation, profile edit, avatar upload, account deletion.
- 📨 **Contact form** that writes to the database (admin-managed).
- 🛟 **Mock-mode fallback** — when the Django API is unreachable the website keeps working with local mock data.
- 🛠 **Django admin** with custom list views, inlines (gallery, add-ons, booking-addons), and bulk editable fields.
- 🌱 **Seed command** (`python manage.py seed_data`) — re-populates 8 destinations, 15 trips and 4 testimonials.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.13, Node.js 20+, npm 10+

### 1) Backend — Django API

```powershell
cd Backend
.\venv\Scripts\Activate.ps1                 # Windows
# source venv/bin/activate                   # Linux / macOS

python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data                  # optional sample data
python manage.py runserver
```

API:   http://localhost:8000/api/v1/
Admin: http://localhost:8000/admin/

### 2) Frontend — Next.js website

```powershell
cd Front
npm install
copy .env.local.example .env.local          # cp on Linux/macOS
npm run dev
```

Website: http://localhost:3000

---

## 📦 Project Layout

```
trivox/
├── Backend/                   ← Django project
│   ├── trivox_backend/        ← settings, urls
│   ├── accounts/              ← User, ContactMessage, PasswordResetToken
│   ├── trips/                 ← Location, Trip, Booking, Review, Testimonial …
│   ├── media/avatars/         ← uploaded user avatars
│   └── manage.py
└── Front/                     ← Next.js project
    ├── app/                   ← App-Router pages (home, trips, booking, dashboard, …)
    ├── features/              ← page-section components, grouped by feature
    ├── components/            ← shared UI building blocks
    ├── services/api/          ← typed fetch client + per-resource services
    ├── contexts/AuthContext   ← JWT auth state + mock-mode logic
    ├── hooks/                 ← TanStack Query wrappers + URL-synced filters
    └── types/                 ← TypeScript domain models
```

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)

```dotenv
EMAIL_HOST_USER=your_gmail@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:3000
```

> The default `EMAIL_BACKEND` is **console** — password-reset emails are printed in the Django terminal, not sent. Swap to Gmail SMTP in `settings.py` when you're ready.

### Frontend (`Front/.env.local`)

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TriVox
```

---

## 🌐 API — at a glance

Base URL: `http://localhost:8000/api/v1`

### Auth
| Method | Path |
|---|---|
| POST | `/auth/token/` — login |
| POST | `/auth/token/refresh/` |
| POST | `/auth/register/` |
| GET / PATCH | `/auth/me/` |
| POST | `/auth/change-password/` |
| POST | `/auth/avatar/` *(multipart)* |
| POST | `/auth/delete-account/` |
| POST | `/auth/password-reset/` |
| POST | `/auth/password-reset/confirm/` |
| POST | `/auth/contact/` |

### Catalogue (public)
| Method | Path |
|---|---|
| GET | `/locations/` |
| GET | `/locations/popular/` |
| GET | `/locations/<slug>/` |
| GET | `/trips/` *(filters: type, location, search, price_min/max, rating_min, duration_max, free_cancellation, instant_confirmation, ordering, page)* |
| GET | `/trips/featured/` |
| GET | `/trips/search/suggestions/?q=…` |
| GET | `/trips/<slug>/` |
| GET | `/trips/<slug>/related/` |
| GET | `/trips/<slug>/reviews/` |
| GET | `/trips/<slug>/addons/` |
| GET | `/testimonials/` |

### Bookings (auth required)
| Method | Path |
|---|---|
| GET / POST | `/bookings/` |
| GET | `/bookings/<reference>/` |
| POST | `/bookings/<reference>/cancel/` |

Full request/response examples in **[DOCUMENTATION.md §7](DOCUMENTATION.md#7-api-documentation)**.

---

## 🧱 Data model (high-level)

```
User ──< Booking >── Trip ── Location
                       │
                       ├──< MediaItem (gallery)
                       ├──< Addon
                       ├──< Review
                       └──< Category (M:N)

Booking ──< BookingAddon ── Addon
User    ──< PasswordResetToken
ContactMessage  •  Testimonial  (standalone)
```

- `Booking.trip` → `PROTECT`  (cannot delete a trip with bookings)
- `Booking.user` → `SET_NULL` (deleting a user keeps anonymised bookings)
- `Trip.location` → `PROTECT` (cannot delete a location with trips)

---

## 🛠 Tech Stack

| Layer | What |
|---|---|
| **Backend** | Django 5.2.14 · DRF 3.17 · SimpleJWT 5.5 · django-cors-headers 4.9 · SQLite (dev) |
| **Frontend** | Next.js 15.1 · React 19 · TypeScript 5.7 · TailwindCSS 3.4 · TanStack Query 5 · Radix UI · Framer Motion · Swiper · React Hook Form + Zod |

---

## 🧪 Useful commands

```bash
# Backend
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py seed_data
python manage.py runserver

# Frontend
npm run dev          # Next.js + Turbopack on :3000
npm run build
npm run start
npm run lint
npm run type-check   # tsc --noEmit
```

---

## 📚 Documentation

| Document | What's inside |
|---|---|
| **[DOCUMENTATION.md](DOCUMENTATION.md)** | Full manual: end-user guide, admin guide, developer guide, setup, modification recipes, complete API reference, troubleshooting |
| **[Front/INTEGRATION.md](Front/INTEGRATION.md)** | Frontend ↔ backend integration notes (CORS, JWT, image domains, production checklist) |

---

## 🐛 Troubleshooting (top hits)

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: django` | Activate `Backend/venv` |
| `no such table: …` | Run `python manage.py migrate` |
| Browser CORS error | Make sure `http://localhost:3000` is in `CORS_ALLOWED_ORIGINS` |
| Frontend stuck in mock mode (yellow banner) | Django dev server is down — start it |
| Reset email never arrives | Default email backend is **console** — check the Django terminal |
| Trip filters don't work | Confirm the URL has the expected `?param=…` — backend silently ignores unknown params |
| Avatar upload fails | File must be JPEG/PNG/WebP/GIF ≤ 5 MB, and `Backend/media/avatars/` must exist |

See **[DOCUMENTATION.md §8](DOCUMENTATION.md#8-troubleshooting)** for the full list.

---

## 📄 License

Private project — all rights reserved.
