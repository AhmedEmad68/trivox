import { api } from "./client";

export interface LocationHighlight {
  icon:  string;
  label: string;
  desc:  string;
}

export interface LocationListItem {
  id:          number;
  name:        string;
  slug:        string;
  country:     string;
  cover_image: string;
  trip_count:  number;
  subtitle:    string;
  description: string;
  highlights:  LocationHighlight[];
  climate:     string;
}

export interface LocationDetail extends LocationListItem {
  hero_image:       string;
  long_description: string;
  best_time:        string;
  language:         string;
  currency:         string;
  timezone:         string;
  country_code:     string;
  latitude:         number | null;
  longitude:        number | null;
}

export const locationsService = {
  list(): Promise<LocationListItem[]> {
    return api.get<LocationListItem[]>("/locations/");
  },
  detail(slug: string): Promise<LocationDetail> {
    return api.get<LocationDetail>(`/locations/${slug}/`);
  },
};
