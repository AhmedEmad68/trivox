import { api, getAccessToken } from "./client";
import type { User, AuthTokens } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const authService = {
  /** Login with email + password → returns JWT tokens */
  login(email: string, password: string) {
    return api.post<AuthTokens>("/auth/token/", { email, password }, { noAuth: true });
  },

  /** Register a new account */
  register(data: {
    email:      string;
    password:   string;
    first_name: string;
    last_name:  string;
    phone?:     string;
  }) {
    return api.post<{ user: User; tokens: AuthTokens }>(
      "/auth/register/",
      data,
      { noAuth: true }
    );
  },

  /** Get current authenticated user */
  me() {
    return api.get<User>("/auth/me/");
  },

  /** Update profile */
  updateProfile(data: Partial<Pick<User, "first_name" | "last_name" | "phone" | "nationality">>) {
    return api.patch<User>("/auth/me/", data);
  },

  /** Change password */
  changePassword(old_password: string, new_password: string) {
    return api.post<{ success: boolean }>("/auth/change-password/", {
      old_password,
      new_password,
    });
  },

  /** Request password reset email */
  forgotPassword(email: string) {
    return api.post<{ success: boolean }>(
      "/auth/password-reset/",
      { email },
      { noAuth: true }
    );
  },

  /** Confirm password reset with token */
  resetPassword(token: string, new_password: string) {
    return api.post<{ success: boolean }>(
      "/auth/password-reset/confirm/",
      { token, new_password },
      { noAuth: true }
    );
  },

  /** Verify email address */
  verifyEmail(token: string) {
    return api.post<{ success: boolean }>(
      "/auth/email-verify/",
      { token },
      { noAuth: true }
    );
  },

  /** Upload a new avatar image (multipart/form-data) */
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API_BASE_URL}/auth/avatar/`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.detail ?? "Failed to upload avatar.");
    }
    return data as { avatar: string };
  },

  /** Permanently delete the authenticated user's account */
  deleteAccount(password: string) {
    return api.post<void>("/auth/delete-account/", { password });
  },
};
