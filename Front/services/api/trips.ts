import { api } from "./client";
import {
  type Trip,
  type TripBase,
  type TripFilters,
  type PaginatedResponse,
  type Location,
  type Review,
  type Addon,
} from "@/types";
import { buildQueryString } from "@/lib/utils";

// ─── TRIPS ────────────────────────────────────────────────────────
export const tripsService = {
  /**
   * List trips with filters & pagination
   */
  list(filters: TripFilters = {}) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined)
    ) as Record<string, string | number | boolean>;

    return api.get<PaginatedResponse<TripBase>>("/trips/", { params });
  },

  /**
   * Get single trip by slug (returns full detail with type-specific fields)
   */
  get(slug: string) {
    return api.get<Trip>(`/trips/${slug}/`, {
      next: { revalidate: 120 },
    });
  },

  /**
   * Get featured trips for homepage
   */
  featured(limit = 6) {
    return api.get<TripBase[]>("/trips/featured/", {
      params: { limit },
      next: { revalidate: 300 },
    });
  },

  /**
   * Get trips by destination
   */
  byDestination(locationSlug: string, limit = 8) {
    return api.get<PaginatedResponse<TripBase>>("/trips/", {
      params: { location: locationSlug, page_size: limit },
    });
  },

  /**
   * Get related trips (same type & location)
   */
  related(slug: string, limit = 4) {
    return api.get<TripBase[]>(`/trips/${slug}/related/`, {
      params: { limit },
    });
  },

  /**
   * Get available dates for a trip
   */
  availability(slug: string, month?: string) {
    return api.get<{ date: string; available: boolean; spots: number }[]>(
      `/trips/${slug}/availability/`,
      { params: { month } }
    );
  },

  /**
   * Get reviews for a trip
   */
  reviews(slug: string, page = 1, pageSize = 10) {
    return api.get<PaginatedResponse<Review>>(`/trips/${slug}/reviews/`, {
      params: { page, page_size: pageSize },
    });
  },

  /**
   * Get add-ons for a trip
   */
  addons(slug: string) {
    return api.get<Addon[]>(`/trips/${slug}/addons/`);
  },

  /**
   * Search suggestions (autocomplete)
   */
  searchSuggestions(query: string) {
    return api.get<{ trips: TripBase[]; locations: Location[] }>(
      "/trips/search/suggestions/",
      { params: { q: query }, noAuth: true }
    );
  },

  /**
   * Check price for given participants
   */
  checkPrice(slug: string, body: {
    date:         string;
    participants: { type: string; count: number }[];
    addon_ids?:   number[];
  }) {
    return api.post<{
      subtotal:    number;
      taxes:       number;
      total:       number;
      currency:    string;
      breakdown:   { label: string; amount: number }[];
    }>(`/trips/${slug}/price/`, body);
  },
};

// ─── LOCATIONS ────────────────────────────────────────────────────
export const locationsService = {
  list() {
    return api.get<Location[]>("/locations/", {
      next: { revalidate: 3600 }, // Refresh hourly
    });
  },

  get(slug: string) {
    return api.get<Location>(`/locations/${slug}/`);
  },

  popular(limit = 8) {
    return api.get<Location[]>("/locations/popular/", {
      params: { limit },
      next: { revalidate: 3600 },
    });
  },
};
