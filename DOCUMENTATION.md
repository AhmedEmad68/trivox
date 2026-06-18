# TriVox Travel — Complete Project Manual

> A full reference for the TriVox tourism platform — covering end users, admins, and developers. Built from the actual code in `Backend/` (Django + DRF) and `Front/` (Next.js 15).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Guide (End Users)](#2-user-guide-end-users)
3. [Admin Guide](#3-admin-guide)
4. [Developer Guide](#4-developer-guide)
5. [Setup & Run Instructions](#5-setup--run-instructions)
6. [How to Modify the Project](#6-how-to-modify-the-project)
7. [API Documentation](#7-api-documentation)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Project Overview

### What is TriVox?

TriVox is a tourism marketplace focused on **Egypt** that lets travellers browse and book three kinds of products:

- **Tours** — guided multi-stop itineraries (e.g. *Pyramids, Sphinx & Egyptian Museum Full-Day Tour*).
- **Transfers** — point-to-point private vehicles (e.g. *Cairo Airport → City Centre*).
- **Experiences** — small-group cultural activities (e.g. *Egyptian Home Cooking with a Local Family*, *Sunset Felucca Sail*).

The product is split into two independent applications that talk to each other over a JSON REST API:

| Layer | Folder | Stack |
|---|---|---|
| Backend (API) | `Backend/` | Django 5.2, Django REST Framework 3.17, SimpleJWT, SQLite |
| Frontend (Website) | `Front/` | Next.js 15.1 (App Router), React 19, TypeScript, TailwindCSS, TanStack Query |

### Key Features (actually implemented)

- **Browse** trips with filters: type, location, price range, rating, duration, free-cancellation, instant-confirmation, search keywords, and sorting (popularity / rating / price asc / price desc / newest).
- **Trip detail pages** with photo gallery, highlights, what's included/excluded, reviews, and add-ons.
- **Destination pages** for Cairo, Giza, Luxor, Aswan, Alexandria, Hurghada, Sinai, and Siwa Oasis — with hero image, climate, currency, language, best time to visit, and a list of trips per destination.
- **Booking flow** — 4 steps (Trip details → Contact info → Add-ons → Payment), with server-side price calculation and a 5 % tax line.
- **Authentication** — email/password registration, JWT login, automatic token refresh, password change, forgot-password by email (UUID token, 30-minute expiry).
- **User dashboard** — overview, list of bookings, booking detail, profile settings (edit info, change password, change avatar, delete account).
- **Booking cancellation** by the booking owner (only for non-cancelled / non-refunded / non-completed bookings).
- **Contact form** that writes to a `ContactMessage` table.
- **Testimonials carousel** on the home page (managed in admin).
- **Mock-mode fallback** — when the Django API is unreachable the frontend continues to work using local mock data so the website is never blank.
- **Avatar upload** via `multipart/form-data` to local `media/avatars/` (5 MB cap, JPEG/PNG/WebP/GIF).
- **Account deletion** with password re-confirmation.

---

## 2. User Guide (End Users)

The website is a single domain (e.g. `localhost:3000`) with the following public flows.

### 2.1 Browsing without an account

| Action | Page |
|---|---|
| See featured trips, top destinations and testimonials | `/` (home) |
| Browse the full catalogue with filters | `/trips` |
| Open a trip's detail page | `/trips/<slug>` |
| Browse destinations | `/destinations` |
| Open a destination's detail page | `/destinations/<slug>` |
| Read static info pages | `/about`, `/how-it-works`, `/help` |
| Read legal pages | `/terms`, `/privacy`, `/refund-policy` |
| Send a contact message | `/contact` |

Guests can **view everything** but cannot book — booking and dashboard pages require an account.

### 2.2 Creating an account

1. Click **Sign up** in the navbar (or open `/register`).
2. Fill in first name, last name, email, password (min 8 characters), and optional phone.
3. On submit the frontend calls `POST /api/v1/auth/register/`, stores the returned access/refresh JWTs in `localStorage`, and redirects to the page recorded in the `?redirect=` query param (defaults to `/dashboard`).

### 2.3 Logging in

1. Open `/login` (the "Sign in" link in the navbar).
2. Enter email + password.
3. On success the access token (lifetime 60 minutes) is saved in `localStorage` and silently refreshed using the refresh token (lifetime 14 days, rotating).
4. If you get **"Invalid email or password"**, the credentials don't match. If you get a network failure banner, the Django backend is unreachable and the website enters **mock mode** — it accepts any non-empty credentials and gives you a local demo session.

### 2.4 Forgotten password

1. Open `/forgot-password`.
2. Enter your email; you'll always get a "success" response (to prevent email enumeration).
3. If the email exists, a reset email is sent (in development it is **printed to the Django terminal** instead of being sent — see `EMAIL_BACKEND = console` in `settings.py`).
4. The email contains a link `/(<frontend>)/reset-password/<uuid-token>`. The token is valid for **30 minutes** and can be used only once.
5. The reset page submits the new password to `POST /api/v1/auth/password-reset/confirm/`.

### 2.5 Booking a trip

Open any trip's detail page (`/trips/<slug>`) and click **"Book now"**. You'll be taken to `/booking?trip=<slug>`.

The booking wizard has 4 steps (`features/booking/`):

1. **Step 1 — Trip details**: pick a date, optional time, and the number of adults / children / infants.
2. **Step 2 — Contact info**: first/last name, email, phone, nationality, optional special requests, and for transfers: pickup / dropoff addresses, flight number, hotel name.
3. **Step 3 — Add-ons**: choose optional extras attached to the trip (e.g. private guide, lunch box, photo package).
4. **Step 4 — Payment**: review the summary and confirm. (Payment integration is **not implemented** — the booking is created in status `confirmed` immediately.)

On confirmation, the frontend calls `POST /api/v1/bookings/`. The backend:

- Validates the payload with `BookingCreateSerializer`.
- Builds a server-side participants snapshot using the **trip's current price** (client-submitted prices are ignored).
- Computes addon line items and a 5 % tax on `trip_subtotal + addons_subtotal`.
- Persists a `Booking` plus zero-or-more `BookingAddon` rows.
- Generates a unique reference like `RH-2026-512934`.
- Returns the full booking with summary.

### 2.6 Managing bookings

After logging in, open `/dashboard`:

- `/dashboard` — overview card with stats.
- `/dashboard/bookings` — list of all your bookings, filterable by status.
- `/dashboard/bookings/<reference>` — single booking with full breakdown and a **Cancel** button.
- `/dashboard/profile` — profile settings page.

Cancelling calls `POST /api/v1/bookings/<reference>/cancel/`. The backend refuses if status is already `cancelled`, `refunded`, or `completed`.

### 2.7 Profile settings (`/dashboard/profile`)

The page (`features/dashboard/ProfileSettings.tsx`) has four sections:

1. **Avatar card** — click **Change photo**, pick an image (JPEG/PNG/WebP/GIF up to 5 MB). The image previews instantly and uploads in the background.
2. **Personal information** — edit first name, last name, phone, nationality. Email is read-only.
3. **Change password** — current password + new password + confirm.
4. **Danger zone — Delete account** — opens a modal that asks for the current password. On success the account is deleted and the user is logged out.

---

## 3. Admin Guide

### 3.1 Accessing the admin

The admin lives at `http://localhost:8000/admin/`. Create a superuser once:

```bash
cd Backend
python manage.py createsuperuser
```

Sign in with that user's email and password.

### 3.2 Models registered in admin

All models are registered via `Backend/accounts/admin.py` and `Backend/trips/admin.py`.

#### `accounts` app

| Model | Purpose | Editable in admin? |
|---|---|---|
| **User** | Customer accounts (email is the username) | Yes — uses Django's default `UserAdmin` |
| **ContactMessage** | Messages sent through `/contact` | Read-only fields; admins can mark as read |
| **PasswordResetToken** | UUID tokens for the forgot-password flow (30 min expiry) | Not registered — managed by the password-reset views |

#### `trips` app

| Model | Purpose |
|---|---|
| **Location** | A destination (Cairo, Luxor, Siwa…) with hero image, highlights JSON, climate, currency, language, timezone, etc. |
| **Category** | Tags such as "Cultural" or "Adventure" (M2M with Trip) |
| **Trip** | A bookable product. `type` ∈ {tour, transfer, experience, addon}. Includes price, currency, rating, review count, cancellation policy, max group size, JSON arrays of `highlights`, `includes`, `excludes`. |
| **MediaItem** | Inline gallery image/video tied to a Trip (`Trip.gallery`) |
| **Addon** | Optional extra attached to a Trip (e.g. lunch, private guide) |
| **Review** | Customer review on a Trip with optional response from the host |
| **Testimonial** | Standalone short quote shown on the home-page carousel |
| **Booking** | A purchase. Includes participants snapshot, totals, contact info, transfer fields, and a unique `reference` like `RH-2026-512934`. |
| **BookingAddon** | Per-booking add-on line item |

### 3.3 Relationships (entity diagram)

```
User (1) ─────────────< (N) Booking >─── (1) Trip ─── (1) Location
                          │                  │
                          │                  ├──< (N) MediaItem (gallery)
                          │                  ├──< (N) Addon
                          │                  ├──< (N) Review
                          │                  └──< (M:N) Category
                          │
                          └──< (N) BookingAddon >─── (1) Addon

User ──< (N) PasswordResetToken
ContactMessage  (standalone)
Testimonial     (standalone, home page)
```

Notes:
- `Booking.trip` uses `on_delete=PROTECT` — a Trip with bookings cannot be deleted.
- `Booking.user` uses `on_delete=SET_NULL` — if a user deletes their account their bookings remain (anonymised).
- `Trip.location` uses `on_delete=PROTECT` — a Location with trips cannot be deleted.

### 3.4 Common admin tasks

#### Add a new destination

1. Open **Locations → Add location**.
2. Fill in **name** (admin auto-fills `slug` from the name), `cover_image`, `hero_image`, `subtitle`, `description`, `long_description`.
3. **Highlights** is a JSON list of objects: `[{"icon": "🏛", "label": "Citadel", "desc": "..."}]`.
4. Fill in travel info: `climate`, `best_time`, `language`, `currency`, `timezone`.
5. Set `order` (lower = shown first) and `is_active`.
6. Save.

#### Add a new trip

1. Open **Trips → Add trip**.
2. Fill in title (slug auto-fills), select **type** (tour / transfer / experience / addon), pick a **location**, optionally pick **categories**.
3. Enter `price`, `price_unit`, `original_price` (for a strikethrough), `duration_label`, `duration_hours`.
4. Toggle `is_featured` to show on the home page, `is_active` to publish.
5. Use the inline **MediaItems** section to add gallery images.
6. Use the inline **Addons** section to attach optional extras.
7. Save.

#### Edit / delete data

- **Edit**: click a row in any list view, change fields, click **Save**.
- **Delete**: from the row's detail page click **Delete** at the bottom-left, or use the list-view bulk delete action.
- **Bulk toggle**: lists support `list_editable` for fields like `is_active`, `is_featured`, `order`, `is_read` — change them inline and click **Save** at the bottom.

#### View bookings

- **Bookings** in admin shows reference, trip, customer name & email, date, status, total.
- Filter by status, date, or `trip__location`.
- Search by reference, email or name.
- The detail view shows the participants JSON, addons inline, pricing breakdown, and transfer-specific fields.

#### Reply to contact messages

- Open **Contact messages**.
- All fields except `is_read` are read-only.
- Toggle `is_read` from the list view once a message has been actioned.

#### Seed sample data

A management command exists at `Backend/trips/management/commands/seed_data.py`:

```bash
python manage.py seed_data
```

This (re-)creates **8 locations**, **15 trips** and **4 testimonials** using `update_or_create`, so it is safe to run repeatedly.

---

## 4. Developer Guide

### 4.1 Backend structure

```
Backend/
├── manage.py
├── db.sqlite3                       ← SQLite database (dev)
├── media/                           ← uploaded user avatars
├── .env                             ← email credentials (gitignored)
├── trivox_backend/                  ← Django project (settings)
│   ├── settings.py                  ← INSTALLED_APPS, REST_FRAMEWORK, SIMPLE_JWT, CORS, MEDIA
│   ├── urls.py                      ← routes /admin/, /api/v1/auth/, /api/v1/, MEDIA in DEBUG
│   ├── asgi.py, wsgi.py
├── accounts/                        ← Django app for users + auth
│   ├── models.py                    ← User, ContactMessage, PasswordResetToken
│   ├── serializers.py               ← Login/Register/User/ChangePw/ForgotPw/ResetPw/Contact
│   ├── views.py                     ← APIViews for each auth endpoint + Avatar/DeleteAccount
│   ├── urls.py                      ← /token/, /register/, /me/, /avatar/, /delete-account/, etc.
│   ├── admin.py                     ← UserAdmin, ContactMessageAdmin
│   └── exceptions.py                ← trivox_exception_handler — flattens DRF errors
└── trips/                           ← Django app for catalogue + bookings
    ├── models.py                    ← Location, Category, Trip, MediaItem, Addon, Review,
    │                                  Testimonial, Booking, BookingAddon
    ├── serializers.py               ← LocationSerializer, TripBaseSerializer, BookingSerializer…
    ├── views.py                     ← TripListView (filterable), BookingListCreateView, …
    ├── urls.py                      ← /trips/, /trips/<slug>/, /bookings/…
    ├── admin.py                     ← list_display, inlines, fieldsets
    └── management/commands/seed_data.py
```

#### Authentication

- `accounts.User` is a custom user model with `email` as USERNAME_FIELD (no username column).
- Tokens are issued via SimpleJWT (`tokens_for_user(user)` helper).
- `ACCESS_TOKEN_LIFETIME = 60 min`, `REFRESH_TOKEN_LIFETIME = 14 days`, `ROTATE_REFRESH_TOKENS = True`.
- `DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]` is the **global** default — public endpoints explicitly set `permission_classes = [AllowAny]`.

#### Exception handling

`accounts.exceptions.trivox_exception_handler` is wired into `REST_FRAMEWORK.EXCEPTION_HANDLER`. It flattens any DRF validation error into a single `{ "detail": "first error message" }` shape so the frontend can rely on a uniform error format.

#### Trip filtering

`TripListView` (`trips/views.py`) reads these query params:

| Param | Effect |
|---|---|
| `type` | exact match on `Trip.type` |
| `location` | `location__slug` exact |
| `search` | `title__icontains` OR `description__icontains` OR `location__name__icontains` |
| `featured=true` | `is_featured=True` |
| `price_min`, `price_max` | `price__gte` / `price__lte` |
| `rating_min` | `rating__gte` |
| `duration_max` | `duration_hours__lte` |
| `free_cancellation=true` | `cancellation_policy="free_cancellation"` |
| `instant_confirmation=true` | `instant_confirmation=True` |
| `ordering` | one of `price_asc / price_desc / rating / newest / popularity` |
| `page`, `page_size` | pagination — default 12, max 100 |

### 4.2 Frontend structure

```
Front/
├── app/                             ← Next.js App Router (one folder = one route)
│   ├── layout.tsx                   ← root layout, fonts, Navbar, Footer, Providers
│   ├── page.tsx                     ← home page
│   ├── trips/page.tsx               ← /trips listing
│   ├── trips/[slug]/page.tsx        ← /trips/<slug> detail (SSR)
│   ├── booking/page.tsx             ← /booking wizard
│   ├── dashboard/                   ← /dashboard, /dashboard/bookings, /dashboard/profile
│   ├── destinations/                ← /destinations, /destinations/<slug>
│   ├── login | register | forgot-password | reset-password   ← auth pages
│   ├── about | how-it-works | help | contact                  ← content pages
│   └── terms | privacy | refund-policy                        ← legal pages
├── features/                        ← page-section components grouped by feature
│   ├── home/        HeroSection, CategorySection, FeaturedTrips, DestinationsSection,
│   │                HowItWorksSection, TestimonialsSection, TrustSection
│   ├── trips/       TripsClient, TripGrid, FilterSidebar, SortBar, TripDetailClient,
│   │                BookingCard, ReviewsSection, TourItinerary, TransferRoute, …
│   ├── booking/     BookingClient, Step1TripDetails…Step4Payment, BookingSummaryPanel
│   ├── dashboard/   DashboardLayout, DashboardOverview, BookingsList, BookingDetail,
│   │                ProfileSettings
│   ├── auth/        AuthCard
│   └── legal/       LegalPage
├── components/                      ← reusable building blocks
│   ├── layout/      Navbar, Footer, Providers (React-Query client)
│   ├── shared/      TripCard, AddonCard, ReviewCard, ImageGallery
│   └── ui/          Badge, StarRating, Skeleton, States, MockModeBanner
├── services/api/                    ← thin SDK over fetch
│   ├── client.ts                    ← fetch wrapper, JWT auth, token refresh on 401
│   ├── auth.ts                      ← login, register, me, updateProfile, changePassword,
│   │                                  forgotPassword, resetPassword, uploadAvatar, deleteAccount
│   ├── trips.ts                     ← tripsService + locationsService (extended)
│   ├── bookings.ts                  ← bookingsService
│   └── locations.ts                 ← locationsService (typed list + detail)
├── contexts/AuthContext.tsx         ← <AuthProvider> + useAuth() + withAuth() HOC + mock-mode logic
├── hooks/
│   ├── useTrips.ts                  ← TanStack Query wrappers (useTrips, useTrip, useBookings…)
│   └── useFilterState.ts            ← URL-synced trip-filter state
├── types/index.ts                   ← all TS types: TripBase/Tour/Transfer/Experience,
│                                       Booking, BookingCreate, User, AuthTokens, TripFilters, …
├── lib/
│   ├── utils.ts                     ← formatters & helpers
│   ├── mockData.ts                  ← mock trips list (fallback)
│   ├── mockDetailData.ts            ← mock single-trip detail (fallback)
│   └── mockUserData.ts              ← mock user + bookings (dashboard fallback)
├── next.config.ts                   ← Next image domains, ESM config
├── tailwind.config.ts               ← design tokens (colours, fonts, container, etc.)
├── package.json                     ← deps (Next 15, React 19, TanStack Query 5, Radix, Swiper, …)
└── .env.local.example               ← NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
```

#### How the frontend talks to the backend

Every HTTP call goes through `services/api/client.ts`:

- Base URL: `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1`).
- Default headers: `Content-Type: application/json`, plus `Authorization: Bearer <access_token>` from `localStorage` (`trivox_access_token`).
- On `401 Unauthorized` it transparently calls `/auth/token/refresh/` and retries the original request once.
- On network failure it throws a `NetworkError` which `AuthContext` uses to flip the app into **mock mode**.
- Avatar upload is the **only** call that bypasses this client because it needs `multipart/form-data` — `authService.uploadAvatar()` uses raw `fetch` with `FormData`.

The high-level service helpers live in `services/api/*.ts` and the React-Query wrappers live in `hooks/useTrips.ts`.

#### Auth context

`AuthContext.tsx` exposes:

```ts
const { user, isAuthenticated, loading, isMockMode,
        login, register, logout, refreshUser, clearError } = useAuth();
```

It also exports `withAuth(Component)` — a HOC that redirects to `/login?redirect=...` if the user is not authenticated.

#### State management

- **Server state** (trips, bookings, locations) → TanStack Query (`@tanstack/react-query`).
- **URL state** for trip filters → `useFilterState()` writes to `?type=tour&location=cairo&...` so filtered URLs are shareable.
- **Auth state** → `AuthContext` + `localStorage`.
- **Form state** → mostly local `useState`; some forms use `react-hook-form` + `zod`.

---

## 5. Setup & Run Instructions

### 5.1 Prerequisites

| Tool | Version |
|---|---|
| Python | 3.13 (the venv ships `pip3.13`) |
| Node.js | 20+ (Next.js 15 requirement) |
| npm | 10+ |
| Git | any |

### 5.2 Backend (Django + DRF)

```powershell
# 1. Go to the backend folder
cd Backend

# 2. Activate the existing virtualenv (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# (Linux/macOS:  source venv/bin/activate)

# 3. (First time only) install dependencies
pip install django==5.2.14 djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple

# 4. Apply migrations
python manage.py migrate

# 5. Create an admin user
python manage.py createsuperuser

# 6. (Optional) seed sample destinations, trips, and testimonials
python manage.py seed_data

# 7. Run the dev server
python manage.py runserver
```

The API is now live at **http://localhost:8000/api/v1/** and the admin at **http://localhost:8000/admin/**.

### 5.3 Frontend (Next.js)

```powershell
# 1. Go to the frontend folder
cd Front

# 2. Install JS dependencies (once)
npm install

# 3. Copy the example env file
copy .env.local.example .env.local
# (Linux/macOS:  cp .env.local.example .env.local)

# 4. Run the dev server with Turbopack
npm run dev
```

Open **http://localhost:3000**. The site auto-reloads on changes.

### 5.4 Environment variables

#### Backend (`Backend/.env`)

```dotenv
EMAIL_HOST_USER=your_gmail@gmail.com         # used if you switch to Gmail SMTP
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx      # 16-char Gmail App Password
FRONTEND_URL=http://localhost:3000           # used in password-reset email links
```

Notes:
- The default email backend in `settings.py` is **`django.core.mail.backends.console.EmailBackend`** — reset emails are **printed in the terminal**, not sent. To switch to real Gmail SMTP, replace the email-backend lines in `settings.py` and use the credentials above.
- `SECRET_KEY` is currently hard-coded in `settings.py` (`django-insecure-...`) for development only — move it to `.env` before deploying.

#### Frontend (`Front/.env.local`)

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TriVox
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name   # optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                       # optional analytics
```

### 5.5 Common commands

| Command | Folder | What it does |
|---|---|---|
| `python manage.py runserver` | Backend | Start API on :8000 |
| `python manage.py migrate` | Backend | Apply DB migrations |
| `python manage.py makemigrations` | Backend | Generate new migrations |
| `python manage.py createsuperuser` | Backend | Create admin login |
| `python manage.py seed_data` | Backend | Re-seed locations / trips / testimonials |
| `npm run dev` | Front | Start Next.js on :3000 (Turbopack) |
| `npm run build` | Front | Production build |
| `npm run start` | Front | Run the prod build |
| `npm run lint` | Front | ESLint |
| `npm run type-check` | Front | `tsc --noEmit` |

---

## 6. How to Modify the Project

### 6.1 Add a new feature (mental checklist)

1. **Model** — add a Django model in the right app (`accounts/` or `trips/`).
2. **Migration** — `python manage.py makemigrations && python manage.py migrate`.
3. **Serializer** — DRF serializer in `<app>/serializers.py`.
4. **View** — `APIView` or `generics.*` in `<app>/views.py`.
5. **URL** — register the view in `<app>/urls.py`.
6. **Admin** — register the model in `<app>/admin.py` so staff can manage it.
7. **TypeScript type** — add to `Front/types/index.ts`.
8. **Service method** — add to `Front/services/api/<area>.ts`.
9. **React Query hook** (optional) — in `Front/hooks/useTrips.ts`.
10. **UI** — page in `Front/app/...` + feature components in `Front/features/<area>/`.

### 6.2 Add a new model (worked example)

Say we want a **Wishlist** so users can save favourite trips.

```python
# Backend/trips/models.py
class Wishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist"
    )
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = [("user", "trip")]
        ordering = ["-created_at"]
```

```bash
python manage.py makemigrations trips
python manage.py migrate
```

```python
# Backend/trips/serializers.py
class WishlistSerializer(serializers.ModelSerializer):
    trip = TripBaseSerializer(read_only=True)
    class Meta:
        model = Wishlist
        fields = ["id", "trip", "created_at"]
```

```python
# Backend/trips/views.py
class WishlistView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("trip__location")
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

```python
# Backend/trips/urls.py
path("wishlist/", WishlistView.as_view(), name="wishlist"),
```

```python
# Backend/trips/admin.py
admin.site.register(Wishlist)
```

### 6.3 Add a new page in Next.js

The App Router uses **folder = route**. To add `/favorites`:

```
Front/app/favorites/
  page.tsx
  loading.tsx        ← optional skeleton shown during SSR
```

```tsx
// Front/app/favorites/page.tsx
import { FavoritesClient } from "@/features/favorites/FavoritesClient";

export default function FavoritesPage() {
  return <FavoritesClient />;
}
```

Then build the feature component(s) in `Front/features/favorites/`. Use `"use client"` at the top of any file that uses hooks (`useState`, `useEffect`, `useAuth`, TanStack Query, etc.).

### 6.4 Extend the API service layer

```ts
// Front/services/api/wishlist.ts
import { api } from "./client";
import type { TripBase } from "@/types";

export interface WishlistItem { id: number; trip: TripBase; created_at: string; }

export const wishlistService = {
  list:   () => api.get<WishlistItem[]>("/wishlist/"),
  add:    (trip_id: number) => api.post<WishlistItem>("/wishlist/", { trip_id }),
  remove: (id: number) => api.delete<void>(`/wishlist/${id}/`),
};
```

Then expose it through a React-Query hook:

```ts
// Front/hooks/useTrips.ts
export function useWishlist() {
  return useQuery({ queryKey: ["wishlist"], queryFn: wishlistService.list });
}
```

### 6.5 Add a new admin column

Edit the relevant `<app>/admin.py` and change `list_display`, `list_filter`, `search_fields`, or `list_editable`. Example — show the booking total in the list view:

```python
class BookingAdmin(admin.ModelAdmin):
    list_display = ["reference", "trip", "first_name", "last_name", "email", "date", "status", "total", "created_at"]
```

No restart needed beyond `runserver` reloading.

---

## 7. API Documentation

> Base URL: **`http://localhost:8000/api/v1`**.
> All endpoints return JSON. Authenticated endpoints expect `Authorization: Bearer <access_token>`.

### 7.1 Authentication

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/auth/token/` | Public | **Login** — returns access + refresh tokens |
| `POST` | `/auth/token/refresh/` | Public | Exchange refresh token for a new access token |
| `POST` | `/auth/register/` | Public | Create an account; returns user + tokens |
| `GET` | `/auth/me/` | User | Get the current user's profile |
| `PATCH` | `/auth/me/` | User | Update `first_name / last_name / phone / nationality` |
| `POST` | `/auth/change-password/` | User | Change password (requires `old_password` + `new_password`) |
| `POST` | `/auth/avatar/` | User | Upload a new avatar (multipart/form-data, field `avatar`) |
| `POST` | `/auth/delete-account/` | User | Delete the account (requires `password`) — returns 204 |
| `POST` | `/auth/password-reset/` | Public | Send a reset-link email (always returns success) |
| `POST` | `/auth/password-reset/confirm/` | Public | Set a new password using a UUID token |
| `POST` | `/auth/contact/` | Public | Submit a contact-form message |

**Example — Login**

```http
POST /api/v1/auth/token/
Content-Type: application/json

{ "email": "sarah@example.com", "password": "secret123" }
```
```json
{ "access": "eyJhbGciOi...", "refresh": "eyJhbGciOi..." }
```

**Example — Register**

```http
POST /api/v1/auth/register/
Content-Type: application/json

{ "email": "sarah@example.com", "password": "secret123",
  "first_name": "Sarah", "last_name": "Mitchell", "phone": "+44 7700 900000" }
```
```json
{
  "user": { "id": 7, "email": "sarah@example.com", "first_name": "Sarah",
            "last_name": "Mitchell", "phone": "+44 7700 900000", "nationality": "",
            "avatar": "", "date_joined": "2026-05-21T10:14:22Z", "bookings_count": 0 },
  "tokens": { "access": "...", "refresh": "..." }
}
```

**Example — Upload avatar**

```http
POST /api/v1/auth/avatar/
Authorization: Bearer <token>
Content-Type: multipart/form-data; boundary=---X

---X
Content-Disposition: form-data; name="avatar"; filename="me.jpg"
Content-Type: image/jpeg
<binary>
---X--
```
```json
{ "avatar": "http://localhost:8000/media/avatars/0c3f...e2.jpg" }
```

### 7.2 Locations / Destinations

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/locations/` | Public | List active locations (full detail) |
| `GET` | `/locations/popular/?limit=8` | Public | Lean list for home-page widgets |
| `GET` | `/locations/<slug>/` | Public | Single location detail |

**Example — List**

```http
GET /api/v1/locations/
```
```json
[
  { "id": 1, "name": "Cairo", "slug": "cairo", "country": "Egypt", "country_code": "EG",
    "cover_image": "https://images.unsplash.com/...", "hero_image": "...",
    "subtitle": "The capital", "description": "...", "long_description": "...",
    "highlights": [{ "icon": "🏛", "label": "Citadel", "desc": "..." }],
    "climate": "...", "best_time": "...", "language": "...",
    "currency": "...", "timezone": "...", "trip_count": 68 }
]
```

### 7.3 Trips

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/trips/` | Public | List trips (paginated). Accepts the filters in §4.1. |
| `GET` | `/trips/featured/?limit=6` | Public | Plain list of featured trips (no pagination) |
| `GET` | `/trips/search/suggestions/?q=...` | Public | Autocomplete — returns `{ trips, locations }` |
| `GET` | `/trips/<slug>/` | Public | Single trip detail (includes addons, gallery) |
| `GET` | `/trips/<slug>/related/?limit=4` | Public | Similar trips (same `type` + `location`) |
| `GET` | `/trips/<slug>/reviews/` | Public | Paginated reviews for the trip |
| `GET` | `/trips/<slug>/addons/` | Public | All add-ons attached to the trip |
| `GET` | `/testimonials/` | Public | Active home-page testimonials |

**Example — Trip list response**

```json
{
  "count": 15,
  "next": "http://localhost:8000/api/v1/trips/?page=2",
  "previous": null,
  "total_pages": 2,
  "current_page": 1,
  "results": [
    { "id": 1, "slug": "pyramids-sphinx-full-day", "type": "tour",
      "title": "Pyramids, Sphinx & Egyptian Museum Full-Day Tour",
      "cover_image": "https://...", "location": { "id": 2, "name": "Giza", "slug": "giza", ... },
      "price": 49.0, "price_currency": "USD", "price_unit": "per_person",
      "rating": 4.9, "review_count": 312, "duration_label": "8 hours",
      "cancellation_policy": "free_cancellation", "instant_confirmation": true,
      "pickup_included": true, "is_featured": true, "is_active": true, "...": "..." }
  ]
}
```

### 7.4 Bookings

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/bookings/?status=...` | User | List **own** bookings (paginated) |
| `POST` | `/bookings/` | User | Create a booking |
| `GET` | `/bookings/<reference>/` | User | Detail for **own** booking |
| `POST` | `/bookings/<reference>/cancel/` | User | Cancel **own** booking (rejected if status ∈ cancelled/refunded/completed) |

**Example — Create a booking**

```http
POST /api/v1/bookings/
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "trip_id": 1,
  "date": "2026-06-15",
  "time": "09:00",
  "participants": [ { "type": "adult", "count": 2 }, { "type": "child", "count": 1 } ],
  "addons":       [ { "addon_id": 5, "quantity": 2 } ],
  "first_name": "Sarah", "last_name": "Mitchell",
  "email": "sarah@example.com", "phone": "+44 7700 900000",
  "nationality": "British", "special_requests": "Vegetarian lunch please."
}
```
```json
{
  "id": 12, "reference": "RH-2026-512934", "status": "confirmed",
  "trip": { "id": 1, "slug": "pyramids-sphinx-full-day", "title": "...", "...": "..." },
  "date": "2026-06-15", "time": "09:00:00",
  "participants": [ { "type": "adult", "count": 2, "price": 49.0 },
                    { "type": "child", "count": 1, "price": 49.0 } ],
  "addons": [ { "addon": { "id": 5, "name": "Private guide", "...": "..." },
                "quantity": 2, "subtotal": 60.0 } ],
  "summary": { "trip_subtotal": 147.0, "addons_subtotal": 60.0,
               "taxes": 10.35, "total": 217.35, "currency": "USD" },
  "first_name": "Sarah", "last_name": "Mitchell",
  "email": "sarah@example.com", "phone": "+44 7700 900000",
  "confirmation_sent": false, "voucher_url": "", "notes": "",
  "created_at": "...", "updated_at": "..."
}
```

### 7.5 Errors

Every error response is normalised by `trivox_exception_handler` to:

```json
{ "detail": "Email already exists." }
```

or, when extra field-level info is available:

```json
{ "detail": "An account with this email already exists.",
  "errors": { "email": ["An account with this email already exists."] } }
```

Common status codes used in the code:

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created (after register, create booking, upload avatar success ⇒ 200) |
| 204 | No Content (account deleted) |
| 400 | Validation / business-rule failure (e.g. cancelling a completed booking) |
| 401 | Missing or invalid JWT |
| 403 | Authenticated but not allowed (rare; most checks use queryset ownership filters) |
| 404 | Not found |

---

## 8. Troubleshooting

### Backend won't start

| Symptom | Likely cause | Fix |
|---|---|---|
| `ModuleNotFoundError: No module named 'django'` | venv not activated | Run `.\venv\Scripts\Activate.ps1` (Windows) or `source venv/bin/activate` |
| `django.db.utils.OperationalError: no such table: …` | Migrations not applied | `python manage.py migrate` |
| `CommandError: You have N unapplied migrations` | Same as above | `python manage.py migrate` |
| Port 8000 already in use | Another Django instance | Kill it or `python manage.py runserver 8001` |

### Frontend can't reach the backend

- The frontend's API base URL is read from `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1`). If Django is on a different port/host, set it in `Front/.env.local` and **restart `npm run dev`** (env changes are not hot-reloaded).
- CORS errors in the browser console → ensure `CORS_ALLOWED_ORIGINS` in `Backend/trivox_backend/settings.py` includes `http://localhost:3000`.
- If the Django server is down, the website automatically enters **mock mode** (yellow banner). It uses local `mockData.ts`; bookings, etc. won't persist to the database until the API is back.

### "Failed to upload avatar"

- File **must** be JPEG / PNG / WebP / GIF and **≤ 5 MB** (validated in `accounts.views.AvatarUploadView`).
- Check that the `Backend/media/avatars/` directory exists and is writable. Create it with:
  ```powershell
  New-Item -ItemType Directory -Force Backend\media\avatars
  ```

### "Invalid email or password" on login

- The credentials don't match. Reset the user from the Django admin (`/admin/accounts/user/`) — set a new password via **Change password**.
- If you registered with the same email twice you should get a `400` with `An account with this email already exists.` during register.

### "Token refresh failed" / logged out unexpectedly

- The refresh token (lifetime 14 days, rotating) was expired or invalidated. The client clears tokens and redirects to `/login` automatically.
- Make sure your machine clock is correct — JWT exp claims are time-sensitive.

### Password-reset email never arrives

- The development config uses `EMAIL_BACKEND = console` — the email body is **printed in the Django terminal**, not sent. Look at the `runserver` output, copy the reset link, paste it into the browser.

### Booking creation fails with `Trip not found`

- The trip you passed is `is_active=False` or its `id` is wrong. Use `/admin/trips/trip/` to verify, or call `GET /api/v1/trips/` first.

### Cancelling a booking returns `Cannot cancel this booking.`

- Status is already `cancelled`, `refunded`, or `completed` (`BookingCancelView.post`). Once a booking is in one of those states it is terminal.

### Frontend dashboard is stuck on a loading spinner

- `DashboardLayout` waits for `AuthContext.loading` to finish. If it never finishes, your access token is invalid **and** the network is down — check `localStorage.trivox_access_token` in DevTools and either clear it or fix the API connection.

### Trip filters don't seem to work

- All filter UI lives in `features/trips/FilterSidebar.tsx` and writes to the URL via `useFilterState()`. If the URL updates but the list doesn't, check the network tab — the request goes to `/api/v1/trips/?<params>`. The backend silently ignores unknown params, so a typo will not error but also won't filter.

### Images don't load in the website

- Next.js blocks unknown image domains. `next.config.ts` must list every hostname under `images.remotePatterns`. The default config allows `images.unsplash.com`. To add another CDN, edit `next.config.ts`.

### Where do logs / errors go?

- **Backend** — Django's `runserver` prints them to the terminal; unhandled exceptions are surfaced through `trivox_exception_handler`.
- **Frontend** — the browser console + the terminal where `npm run dev` is running. Network failures throw a `NetworkError` that the UI catches.

---

*End of manual. Last regenerated from the actual code on 2026-05-21.*
