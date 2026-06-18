// ═══════════════════════════════════════════════════════════════════
// TRIVOX — Core TypeScript Types
// ═══════════════════════════════════════════════════════════════════

// ─── PRODUCT TYPES ────────────────────────────────────────────────
export type ProductType = "tour" | "transfer" | "experience" | "addon";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded";

export type DifficultyLevel = "easy" | "moderate" | "challenging" | "expert";

export type CancellationPolicy =
  | "free_cancellation"
  | "partial_refund"
  | "non_refundable";

// ─── SHARED ENTITIES ─────────────────────────────────────────────
export interface PaginatedResponse<T> {
  results:    T[];
  count:      number;
  next:       string | null;
  previous:   string | null;
  total_pages: number;
  current_page: number;
}

export interface ApiError {
  message: string;
  code?:   string;
  field?:  string;
}

export interface MediaItem {
  id:       number;
  url:      string;
  alt_text: string;
  caption?: string;
  type:     "image" | "video";
  is_cover: boolean;
  order:    number;
}

export interface Location {
  id:          number;
  name:        string;
  slug:        string;
  country:     string;
  country_code: string;
  city?:       string;
  region?:     string;
  latitude?:   number;
  longitude?:  number;
  description?: string;
  cover_image?: string;
  trip_count?:  number;
}

export interface Category {
  id:    number;
  name:  string;
  slug:  string;
  icon?: string;
  description?: string;
}

export interface Review {
  id:           number;
  author_name:  string;
  author_avatar?: string;
  author_country?: string;
  rating:       number;
  title?:       string;
  body:         string;
  date:         string;
  verified:     boolean;
  helpful_count?: number;
  images?:      string[];
  response?:    {
    body:    string;
    date:    string;
    author:  string;
  };
}

export interface ReviewStats {
  average:        number;
  total:          number;
  distribution:   Record<1|2|3|4|5, number>;
}

// ─── TRIP (base for all product types) ────────────────────────────
export interface TripBase {
  id:             number;
  slug:           string;
  type:           ProductType;
  title:          string;
  tagline?:       string;
  description:    string;
  cover_image:    string;
  gallery:        MediaItem[];

  location:       Location;
  categories:     Category[];

  price:          number;
  price_currency: string;
  price_unit:     "per_person" | "per_group" | "per_vehicle" | "fixed";
  original_price?: number;

  rating:         number;
  review_count:   number;
  review_stats?:  ReviewStats;

  duration_hours?: number;
  duration_days?:  number;
  duration_label:  string; // e.g. "3 hours", "Full day", "2 days 1 night"

  languages:      string[];
  max_group_size?: number;
  min_age?:       number;

  cancellation_policy: CancellationPolicy;
  cancellation_hours?: number; // free cancellation within N hours of start

  instant_confirmation: boolean;
  pickup_included:      boolean;
  is_featured:          boolean;
  is_active:            boolean;

  highlights:     string[];
  includes:       string[];
  excludes:       string[];

  addons?:        Addon[];

  created_at:     string;
  updated_at:     string;
}

// ─── TOUR ─────────────────────────────────────────────────────────
export interface ItineraryStop {
  order:       number;
  time?:       string;       // "09:00 AM"
  title:       string;
  description: string;
  duration?:   string;       // "45 minutes"
  location?:   string;
  image?:      string;
  type:        "activity" | "meal" | "transport" | "accommodation" | "free_time";
}

export interface ItineraryDay {
  day:         number;
  title:       string;
  description?: string;
  stops:       ItineraryStop[];
  meals_included?: ("breakfast" | "lunch" | "dinner")[];
  accommodation?: string;
}

export interface Tour extends TripBase {
  type:          "tour";
  difficulty:    DifficultyLevel;
  itinerary:     ItineraryDay[];
  start_location: string;
  end_location:  string;
  meeting_point?: string;
  guide_name?:   string;
  guide_bio?:    string;
  guide_avatar?: string;
  group_size_min?: number;
}

// ─── TRANSFER ─────────────────────────────────────────────────────
export type TransferVehicleType =
  | "economy_car"
  | "standard_car"
  | "premium_car"
  | "minivan"
  | "minibus"
  | "coach"
  | "boat"
  | "speedboat";

export interface Transfer extends TripBase {
  type:            "transfer";
  pickup_location:  string;
  dropoff_location: string;
  pickup_address?:  string;
  dropoff_address?: string;
  vehicle_type:     TransferVehicleType;
  vehicle_model?:   string;
  vehicle_image?:   string;
  max_passengers:   number;
  max_luggage:      number;
  driver_name?:     string;
  driver_avatar?:   string;
  flight_tracking:  boolean;
  wait_time_minutes?: number;
  distance_km?:     number;
  estimated_time?:  string; // "45 min"
}

// ─── EXPERIENCE ───────────────────────────────────────────────────
export interface Host {
  id:         number;
  name:       string;
  avatar:     string;
  bio:        string;
  languages:  string[];
  since:      string;  // year joined
  verified:   boolean;
  superhost:  boolean;
  reviews_count: number;
  response_rate?: number; // percentage
}

export interface Experience extends TripBase {
  type:         "experience";
  host:         Host;
  story?:       string;  // Rich markdown narrative
  style:        "cooking" | "cultural" | "adventure" | "wellness" | "arts" | "nightlife" | "sport" | "other";
  setting:      "indoor" | "outdoor" | "both";
  skill_level:  "all" | "beginner" | "intermediate" | "advanced";
  what_to_bring?: string[];
  what_to_expect: string[];
}

// ─── ADDON ────────────────────────────────────────────────────────
export interface Addon {
  id:          number;
  slug:        string;
  name:        string;
  description: string;
  image?:      string;
  price:       number;
  price_currency: string;
  price_unit:  "per_person" | "per_group" | "fixed";
  is_required: boolean;
  max_quantity?: number;
  category?:   "transport" | "food" | "equipment" | "guide" | "insurance" | "photo" | "other";
}

// Union type for all trip variants
export type Trip = Tour | Transfer | Experience;

// ─── FILTERS & SEARCH ────────────────────────────────────────────
export interface TripFilters {
  type?:        ProductType | "all";
  location?:    string;
  category?:    string;
  price_min?:   number;
  price_max?:   number;
  rating_min?:  number;
  duration_min?: number;
  duration_max?: number;
  date?:        string;
  languages?:   string[];
  group_size?:  number;
  instant_confirmation?: boolean;
  free_cancellation?:    boolean;
  search?:      string;
  ordering?:    "price_asc" | "price_desc" | "rating" | "popularity" | "newest";
  page?:        number;
  page_size?:   number;
}

export interface SearchSuggestion {
  id:     string;
  type:   "location" | "trip" | "category";
  label:  string;
  sublabel?: string;
  image?: string;
  slug?:  string;
}

// ─── BOOKING ──────────────────────────────────────────────────────
export interface BookingParticipant {
  type:  "adult" | "child" | "infant";
  count: number;
  price: number;
}

export interface BookingAddon {
  addon:     Addon;
  quantity:  number;
  subtotal:  number;
}

export interface BookingCreate {
  trip_id:         number;
  trip_type:       ProductType;
  date:            string;
  time?:           string;
  participants:    BookingParticipant[];
  addons?:         { addon_id: number; quantity: number }[];
  special_requests?: string;

  // Contact info
  first_name:  string;
  last_name:   string;
  email:       string;
  phone:       string;
  nationality?: string;

  // Transfer specific
  pickup_location?:  string;
  dropoff_location?: string;
  flight_number?:    string;
  hotel_name?:       string;
}

export interface BookingSummary {
  trip_subtotal:    number;
  addons_subtotal:  number;
  taxes:            number;
  discount?:        number;
  total:            number;
  currency:         string;
}

export interface Booking {
  id:              number;
  reference:       string;  // e.g. "RH-2026-000123"
  status:          BookingStatus;
  trip:            TripBase;
  date:            string;
  time?:           string;
  participants:    BookingParticipant[];
  addons:          BookingAddon[];
  summary:         BookingSummary;
  created_at:      string;
  updated_at:      string;
  confirmation_sent: boolean;
  voucher_url?:    string;
  notes?:          string;

  // Contact
  first_name:  string;
  last_name:   string;
  email:       string;
  phone:       string;
}

// ─── USER / AUTH ──────────────────────────────────────────────────
export interface User {
  id:           number;
  email:        string;
  first_name:   string;
  last_name:    string;
  avatar?:      string;
  phone?:       string;
  nationality?: string;
  date_joined:  string;
  bookings_count: number;
}

export interface AuthTokens {
  access:  string;
  refresh: string;
}

// ─── UI STATE ────────────────────────────────────────────────────
export interface ToastMessage {
  id:      string;
  type:    "success" | "error" | "info" | "warning";
  title:   string;
  message?: string;
  duration?: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
