"use client";

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsService, locationsService } from "@/services/api/trips";
import { bookingsService } from "@/services/api/bookings";
import { type TripFilters, type BookingCreate } from "@/types";

// ─── QUERY KEYS ───────────────────────────────────────────────────
export const queryKeys = {
  trips:       (filters?: TripFilters) => ["trips", filters] as const,
  trip:        (slug: string)          => ["trip", slug] as const,
  featured:    ()                      => ["trips", "featured"] as const,
  related:     (slug: string)          => ["trips", slug, "related"] as const,
  reviews:     (slug: string)          => ["trips", slug, "reviews"] as const,
  addons:      (slug: string)          => ["trips", slug, "addons"] as const,
  availability:(slug: string)          => ["trips", slug, "availability"] as const,
  locations:   ()                      => ["locations"] as const,
  popular:     ()                      => ["locations", "popular"] as const,
  bookings:    ()                      => ["bookings"] as const,
  booking:     (ref: string)           => ["bookings", ref] as const,
};

// ─── TRIPS HOOKS ──────────────────────────────────────────────────
export function useTrips(filters: TripFilters = {}) {
  return useQuery({
    queryKey: queryKeys.trips(filters),
    queryFn:  () => tripsService.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useFeaturedTrips(limit = 6) {
  return useQuery({
    queryKey: queryKeys.featured(),
    queryFn:  () => tripsService.featured(limit),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useTrip(slug: string) {
  return useQuery({
    queryKey: queryKeys.trip(slug),
    queryFn:  () => tripsService.get(slug),
    enabled:  !!slug,
  });
}

export function useRelatedTrips(slug: string, limit = 4) {
  return useQuery({
    queryKey: queryKeys.related(slug),
    queryFn:  () => tripsService.related(slug, limit),
    enabled:  !!slug,
  });
}

export function useTripReviews(slug: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...queryKeys.reviews(slug), page],
    queryFn:  () => tripsService.reviews(slug, page, pageSize),
    enabled:  !!slug,
  });
}

export function useTripAddons(slug: string) {
  return useQuery({
    queryKey: queryKeys.addons(slug),
    queryFn:  () => tripsService.addons(slug),
    enabled:  !!slug,
  });
}

export function useTripAvailability(slug: string, month?: string) {
  return useQuery({
    queryKey: [...queryKeys.availability(slug), month],
    queryFn:  () => tripsService.availability(slug, month),
    enabled:  !!slug,
  });
}

// Infinite scroll for trips listing
export function useInfiniteTrips(filters: Omit<TripFilters, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.trips(filters), "infinite"],
    queryFn:  ({ pageParam = 1 }) =>
      tripsService.list({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last, _, page) =>
      last.next ? (page as number) + 1 : undefined,
  });
}

// ─── LOCATION HOOKS ───────────────────────────────────────────────
export function useLocations() {
  return useQuery({
    queryKey: queryKeys.locations(),
    queryFn:  locationsService.list,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function usePopularLocations(limit = 8) {
  return useQuery({
    queryKey: queryKeys.popular(),
    queryFn:  () => locationsService.popular(limit),
    staleTime: 60 * 60 * 1000,
  });
}

// ─── BOOKING HOOKS ────────────────────────────────────────────────
export function useBookings(status?: string) {
  return useQuery({
    queryKey: queryKeys.bookings(),
    queryFn:  () => bookingsService.list(1, status),
  });
}

export function useBooking(reference: string) {
  return useQuery({
    queryKey: queryKeys.booking(reference),
    queryFn:  () => bookingsService.get(reference),
    enabled:  !!reference,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingCreate) => bookingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reference, reason }: { reference: string; reason?: string }) =>
      bookingsService.cancel(reference, reason),
    onSuccess: (_, { reference }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(reference) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
    },
  });
}
