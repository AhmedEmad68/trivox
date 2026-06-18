"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { TripFilters } from "@/types";

export type SortOption = "popularity" | "rating" | "price_asc" | "price_desc" | "newest";

export interface FilterState {
  type:         string;
  location:     string;
  search:       string;
  price_min:    number;
  price_max:    number;
  rating_min:   number;
  duration_max: number;
  free_cancel:  boolean;
  instant:      boolean;
  sort:         SortOption;
  page:         number;
}

export const DEFAULT_FILTERS: FilterState = {
  type:         "all",
  location:     "",
  search:       "",
  price_min:    0,
  price_max:    500,
  rating_min:   0,
  duration_max: 0,
  free_cancel:  false,
  instant:      false,
  sort:         "popularity",
  page:         1,
};

export function useFilterState() {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();

  // Read current filters from URL
  const filters: FilterState = useMemo(() => ({
    type:         params.get("type")         ?? DEFAULT_FILTERS.type,
    location:     params.get("location")     ?? DEFAULT_FILTERS.location,
    search:       params.get("search")       ?? DEFAULT_FILTERS.search,
    price_min:    Number(params.get("price_min"))    || DEFAULT_FILTERS.price_min,
    price_max:    Number(params.get("price_max"))    || DEFAULT_FILTERS.price_max,
    rating_min:   Number(params.get("rating_min"))   || DEFAULT_FILTERS.rating_min,
    duration_max: Number(params.get("duration_max")) || DEFAULT_FILTERS.duration_max,
    free_cancel:  params.get("free_cancel") === "true",
    instant:      params.get("instant")     === "true",
    sort:         (params.get("sort") as SortOption) ?? DEFAULT_FILTERS.sort,
    page:         Number(params.get("page")) || DEFAULT_FILTERS.page,
  }), [params]);

  // Update URL with new filter values
  const setFilters = useCallback((updates: Partial<FilterState>) => {
    const next = { ...filters, ...updates, page: 1 };
    const sp   = new URLSearchParams();

    if (next.type         && next.type !== "all")  sp.set("type",         next.type);
    if (next.location)                             sp.set("location",     next.location);
    if (next.search)                               sp.set("search",       next.search);
    if (next.price_min    > 0)                     sp.set("price_min",    String(next.price_min));
    if (next.price_max    < 500)                   sp.set("price_max",    String(next.price_max));
    if (next.rating_min   > 0)                     sp.set("rating_min",   String(next.rating_min));
    if (next.duration_max > 0)                     sp.set("duration_max", String(next.duration_max));
    if (next.free_cancel)                          sp.set("free_cancel",  "true");
    if (next.instant)                              sp.set("instant",      "true");
    if (next.sort !== "popularity")                sp.set("sort",         next.sort);

    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [filters, router, pathname]);

  const setPage = useCallback((page: number) => {
    const sp = new URLSearchParams(params.toString());
    if (page === 1) sp.delete("page");
    else sp.set("page", String(page));
    router.push(`${pathname}?${sp.toString()}`, { scroll: true });
  }, [params, router, pathname]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Convert to API query params
  const apiFilters: TripFilters = useMemo(() => ({
    type:          filters.type === "all" ? undefined : filters.type as TripFilters["type"],
    location:      filters.location  || undefined,
    search:        filters.search    || undefined,
    price_min:     filters.price_min  > 0   ? filters.price_min  : undefined,
    price_max:     filters.price_max  < 500 ? filters.price_max  : undefined,
    rating_min:    filters.rating_min > 0   ? filters.rating_min : undefined,
    duration_max:  filters.duration_max > 0 ? filters.duration_max : undefined,
    free_cancellation: filters.free_cancel || undefined,
    instant_confirmation: filters.instant || undefined,
    ordering:      filters.sort as TripFilters["ordering"],
    page:          filters.page,
    page_size:     12,
  }), [filters]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.type        !== "all") n++;
    if (filters.location)              n++;
    if (filters.price_min   > 0)       n++;
    if (filters.price_max   < 500)     n++;
    if (filters.rating_min  > 0)       n++;
    if (filters.duration_max > 0)      n++;
    if (filters.free_cancel)           n++;
    if (filters.instant)               n++;
    return n;
  }, [filters]);

  return { filters, setFilters, setPage, clearFilters, apiFilters, activeCount };
}
