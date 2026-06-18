# TriVox — Django REST Framework Integration Guide

## Overview

The frontend is fully decoupled from the backend via a service layer in
`services/api/`. All API calls go through `services/api/client.ts` which
handles JWT auth, token refresh, and error normalisation automatically.

---

## 1. Environment Setup

Copy `.env.local.example` → `.env.local` and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1   # Django dev server
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://api.trivox.travel/api/v1
NEXT_PUBLIC_SITE_URL=https://trivox.travel
```

---

## 2. Django Backend Requirements

### CORS

Install `django-cors-headers` and configure:

```python
# settings.py
INSTALLED_APPS = [..., "corsheaders"]
MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", ...]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://trivox.travel",
]
CORS_ALLOW_CREDENTIALS = True
```

### JWT Authentication

Install `djangorestframework-simplejwt`:

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ROTATE_REFRESH_TOKENS":  True,
}
```

### Required URL patterns

```python
# urls.py
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("api/v1/auth/token/",          obtain_pair_view),       # POST login
    path("api/v1/auth/token/refresh/",  TokenRefreshView.as_view()),
    path("api/v1/auth/register/",       RegisterView.as_view()),
    path("api/v1/auth/me/",             UserProfileView.as_view()),
    path("api/v1/auth/change-password/",ChangePasswordView.as_view()),
    path("api/v1/auth/password-reset/", PasswordResetView.as_view()),
    path("api/v1/trips/",               TripListView.as_view()),
    path("api/v1/trips/<slug>/",        TripDetailView.as_view()),
    path("api/v1/trips/<slug>/reviews/",TripReviewsView.as_view()),
    path("api/v1/trips/<slug>/addons/", TripAddonsView.as_view()),
    path("api/v1/trips/featured/",      FeaturedTripsView.as_view()),
    path("api/v1/trips/<slug>/related/",RelatedTripsView.as_view()),
    path("api/v1/bookings/",            BookingListCreateView.as_view()),
    path("api/v1/bookings/<reference>/",BookingDetailView.as_view()),
    path("api/v1/bookings/<reference>/cancel/", BookingCancelView.as_view()),
    path("api/v1/locations/",           LocationListView.as_view()),
    path("api/v1/locations/popular/",   PopularLocationsView.as_view()),
]
```

---

## 3. Expected API Response Shapes

### `GET /api/v1/trips/`

Accepts query params: `type`, `location`, `search`, `price_min`, `price_max`,
`rating_min`, `duration_max`, `free_cancellation`, `instant_confirmation`,
`ordering`, `page`, `page_size`.

```json
{
  "count": 45,
  "next": "http://localhost:8000/api/v1/trips/?page=2",
  "previous": null,
  "total_pages": 4,
  "current_page": 1,
  "results": [
    {
      "id": 1,
      "slug": "pyramids-sphinx-full-day",
      "type": "tour",
      "title": "Pyramids, Sphinx & Egyptian Museum Full-Day Tour",
      "cover_image": "https://...",
      "location": { "id": 1, "name": "Cairo", "slug": "cairo", "country": "Egypt", "country_code": "EG" },
      "price": 49,
      "price_currency": "USD",
      "price_unit": "per_person",
      "rating": 4.9,
      "review_count": 312,
      "duration_label": "8 hours",
      "duration_hours": 8,
      "cancellation_policy": "free_cancellation",
      "instant_confirmation": true,
      "pickup_included": true,
      "is_featured": true,
      "is_active": true
    }
  ]
}
```

### `GET /api/v1/trips/{slug}/`

Returns full trip object. The `type` field determines additional fields:

- **tour**: `itinerary`, `difficulty`, `guide_name`, `guide_bio`, `guide_avatar`
- **transfer**: `pickup_location`, `dropoff_location`, `vehicle_type`, `max_passengers`
- **experience**: `host` (object), `story`, `what_to_expect`, `what_to_bring`

All types include: `gallery`, `highlights`, `includes`, `excludes`, `addons[]`, `review_stats`.

### `POST /api/v1/auth/token/`

```json
// Request
{ "email": "user@example.com", "password": "secret" }

// Response
{ "access": "eyJ...", "refresh": "eyJ..." }
```

### `POST /api/v1/auth/register/`

```json
// Request
{ "email": "...", "password": "...", "first_name": "...", "last_name": "..." }

// Response
{ "user": { "id": 1, "email": "...", ... }, "tokens": { "access": "...", "refresh": "..." } }
```

### `POST /api/v1/bookings/`

```json
// Request
{
  "trip_id": 1,
  "trip_type": "tour",
  "date": "2026-05-15",
  "participants": [
    { "type": "adult", "count": 2 },
    { "type": "child", "count": 1 }
  ],
  "addons": [{ "addon_id": 1, "quantity": 2 }],
  "first_name": "Sarah",
  "last_name": "Mitchell",
  "email": "sarah@example.com",
  "phone": "+44 7700 900000"
}

// Response
{
  "id": 1,
  "reference": "RH-2026-000312",
  "status": "confirmed",
  "trip": { ... },
  "summary": {
    "trip_subtotal": 133,
    "addons_subtotal": 16,
    "taxes": 7.45,
    "total": 156.45,
    "currency": "USD"
  },
  ...
}
```

---

## 4. Replacing Mock Data

Each page that uses mock data has a comment showing where to replace it.

### Trip listing (`features/trips/TripsClient.tsx`)

```typescript
// Current (mock fallback):
const { data: apiData, isLoading, isError } = useTrips(apiFilters);
// When API returns data, apiData is used automatically.
// The mock fallback (MOCK_TRIPS) only activates when isError is true.
```

### Trip detail (`app/trips/[slug]/page.tsx`)

```typescript
// Replace mock function:
async function getTripData(slug: string): Promise<Trip | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips/${slug}/`,
    { next: { revalidate: 120 } }
  );
  if (!res.ok) return null;
  return res.json();
}
```

### Dashboard (`features/dashboard/*.tsx`)

Replace `MOCK_USER` and `MOCK_BOOKINGS` imports with `useAuth().user` and
the `useBookings()` hook from `hooks/useTrips.ts`.

---

## 5. Auth Flow

The `AuthContext` (`contexts/AuthContext.tsx`) manages all auth state globally.

```typescript
// In any client component:
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, login, logout, loading } = useAuth();
```

Token storage uses `localStorage`. The `api` client automatically attaches
the `Authorization: Bearer <token>` header and refreshes expired tokens.

### Protected routes

Wrap pages or components with `withAuth()`:

```typescript
import { withAuth } from "@/contexts/AuthContext";

function DashboardPage() { ... }
export default withAuth(DashboardPage);
```

Or check inside a server component using cookies (for SSR):

```typescript
import { cookies } from "next/headers";

export default async function ProtectedPage() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) redirect("/login");
  ...
}
```

---

## 6. Image Configuration

Update `next.config.ts` to allow your image domains:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "your-cdn.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "images.unsplash.com" }, // dev only
  ],
}
```

---

## 7. Production Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production Django API
- [ ] Configure CORS on Django for production domain
- [ ] Replace all `MOCK_*` imports with real API calls
- [ ] Set up Stripe keys for payment processing
- [ ] Configure `next/image` with production CDN hostname
- [ ] Set up error tracking (Sentry recommended)
- [ ] Enable ISR revalidation (`next: { revalidate: 120 }`) on trip pages
- [ ] Add `robots.txt` and `sitemap.xml` (Next.js App Router supports these natively)
- [ ] Review `noAuth: true` calls — ensure public endpoints don't require tokens

---

## 8. File Structure Reference

```
trivox/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home
│   ├── trips/page.tsx            # Listing
│   ├── trips/[slug]/page.tsx     # Detail
│   ├── booking/page.tsx          # Booking flow
│   ├── dashboard/                # User dashboard
│   ├── destinations/             # Destination pages
│   ├── login / register /        # Auth pages
│   │   forgot-password
│   ├── about / how-it-works /    # Content pages
│   │   help / contact
│   └── terms / privacy /         # Legal pages
│       refund-policy
├── features/                     # Feature-scoped components
│   ├── home/                     # Home page sections
│   ├── trips/                    # Trip listing & detail
│   ├── booking/                  # Booking flow steps
│   ├── dashboard/                # Dashboard UI
│   ├── auth/                     # Auth form components
│   └── legal/                    # Legal page wrapper
├── components/                   # Shared components
│   ├── layout/Navbar|Footer
│   ├── shared/TripCard|ReviewCard|ImageGallery|AddonCard
│   └── ui/Badge|StarRating|Skeleton|States
├── services/api/                 # API service layer
│   ├── client.ts                 # Fetch wrapper + JWT
│   ├── trips.ts                  # Trip endpoints
│   ├── bookings.ts               # Booking endpoints
│   └── auth.ts                   # Auth endpoints
├── contexts/AuthContext.tsx      # Global auth state
├── hooks/
│   ├── useTrips.ts               # React Query hooks
│   └── useFilterState.ts         # URL-synced filter state
├── types/index.ts                # All TypeScript types
├── lib/
│   ├── utils.ts                  # Formatters & helpers
│   ├── mockData.ts               # Trip listing mocks
│   ├── mockDetailData.ts         # Detail page mocks
│   └── mockUserData.ts           # Dashboard mocks
└── tailwind.config.ts            # Design tokens
```
