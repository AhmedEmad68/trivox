import { api } from "./client";
import {
  type Booking,
  type BookingCreate,
  type BookingSummary,
  type User,
  type AuthTokens,
  type PaginatedResponse,
} from "@/types";

// ─── BOOKINGS ─────────────────────────────────────────────────────
export const bookingsService = {
  /**
   * Create a new booking
   */
  create(data: BookingCreate) {
    return api.post<Booking>("/bookings/", data);
  },

  /**
   * Get user's bookings
   */
  list(page = 1, status?: string) {
    return api.get<PaginatedResponse<Booking>>("/bookings/", {
      params: { page, status },
    });
  },

  /**
   * Get single booking by reference
   */
  get(reference: string) {
    return api.get<Booking>(`/bookings/${reference}/`);
  },

  /**
   * Cancel a booking
   */
  cancel(reference: string, reason?: string) {
    return api.post<{ success: boolean; refund_amount?: number }>(
      `/bookings/${reference}/cancel/`,
      { reason }
    );
  },

  /**
   * Get voucher PDF URL
   */
  getVoucher(reference: string) {
    return api.get<{ url: string }>(`/bookings/${reference}/voucher/`);
  },

  /**
   * Preview price before creating booking
   */
  previewPrice(data: Omit<BookingCreate, "first_name" | "last_name" | "email" | "phone">) {
    return api.post<BookingSummary>("/bookings/preview-price/", data);
  },
};

// ─── AUTH ────────────────────────────────────────────────────────
export const authService = {
  /**
   * Login with email + password
   */
  login(email: string, password: string) {
    return api.post<AuthTokens>("/auth/token/", { email, password }, { noAuth: true });
  },

  /**
   * Register new user
   */
  register(data: {
    email:      string;
    password:   string;
    first_name: string;
    last_name:  string;
    phone?:     string;
  }) {
    return api.post<{ user: User; tokens: AuthTokens }>("/auth/register/", data, { noAuth: true });
  },

  /**
   * Get current user profile
   */
  me() {
    return api.get<User>("/auth/me/");
  },

  /**
   * Update user profile
   */
  updateProfile(data: Partial<User>) {
    return api.patch<User>("/auth/me/", data);
  },

  /**
   * Change password
   */
  changePassword(data: { old_password: string; new_password: string }) {
    return api.post<{ success: boolean }>("/auth/change-password/", data);
  },

  /**
   * Request password reset
   */
  forgotPassword(email: string) {
    return api.post<{ success: boolean }>(
      "/auth/password-reset/",
      { email },
      { noAuth: true }
    );
  },
};
