"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/api/auth";
import { MOCK_USER } from "@/lib/mockUserData";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "12px",
  fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208",
  border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff",
  outline: "none", transition: "border-color 0.15s",
  boxSizing: "border-box",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>{label}</label>
      {children}
      {hint && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D" }}>{hint}</p>}
    </div>
  );
}

function SaveFeedback({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#4A7C3F", display: "flex", alignItems: "center", gap: "5px" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7l3 3 6-6" stroke="#4A7C3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Saved
    </span>
  );
}

export function ProfileSettings() {
  const { user: authUser, refreshUser, logout } = useAuth();
  const user = authUser ?? MOCK_USER;

  // ─── Personal info ────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName:   user.first_name,
    lastName:    user.last_name,
    email:       user.email,
    phone:       user.phone ?? "",
    nationality: user.nationality ?? "",
  });
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [apiError, setApiError] = useState("");

  // ─── Password ─────────────────────────────────────────────────────
  const [pwForm,   setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved,  setPwSaved]  = useState(false);
  const [pwError,  setPwError]  = useState("");

  // ─── Avatar ───────────────────────────────────────────────────────
  const fileInputRef             = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError,   setAvatarError]   = useState("");

  // ─── Delete account modal ─────────────────────────────────────────
  const [showDelete,    setShowDelete]    = useState(false);
  const [deletePass,    setDeletePass]    = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError,   setDeleteError]   = useState("");

  /* Sync form when auth user loads */
  useEffect(() => {
    if (authUser) {
      setForm({
        firstName:   authUser.first_name,
        lastName:    authUser.last_name,
        email:       authUser.email,
        phone:       authUser.phone ?? "",
        nationality: authUser.nationality ?? "",
      });
    }
  }, [authUser]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#C8913A"; e.target.style.boxShadow = "0 0 0 3px rgba(200,145,58,0.15)"; },
    onBlur:  (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(226,216,194,0.8)"; e.target.style.boxShadow = "none"; },
  };

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setApiError("");
    try {
      await authService.updateProfile({
        first_name:  form.firstName,
        last_name:   form.lastName,
        phone:       form.phone || undefined,
        nationality: form.nationality || undefined,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handlePwSave = async () => {
    setPwError("");
    if (pwForm.next.length < 8)        { setPwError("Password must be at least 8 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords don't match."); return; }
    setPwSaving(true);
    try {
      await authService.changePassword(pwForm.current, pwForm.next);
      setPwSaved(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      setAvatarError("Please choose a JPEG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 5 MB.");
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    setAvatarLoading(true);
    try {
      await authService.uploadAvatar(file);
      await refreshUser();
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed.");
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePass) { setDeleteError("Please enter your password."); return; }
    setDeleteLoading(true);
    try {
      await authService.deleteAccount(deletePass);
      logout();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete account.");
      setDeleteLoading(false);
    }
  };

  const displayAvatar = avatarPreview ?? user.avatar ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.375rem, 3vw, 1.75rem)", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "4px" }}>Profile Settings</h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60" }}>Manage your account details and preferences.</p>
      </div>

      {/* ── Avatar ─────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />

        {/* Avatar circle */}
        <div style={{ position: "relative", width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", background: "#EDE5D5", border: "3px solid rgba(200,145,58,0.25)", flexShrink: 0 }}>
          {displayAvatar ? (
            <Image src={displayAvatar} alt={user.first_name} fill className="object-cover" unoptimized={!!avatarPreview} />
          ) : (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#C8913A" }}>
              {user.first_name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          {avatarLoading && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(26,18,8,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="10" cy="10" r="8" stroke="rgba(253,252,250,0.3)" strokeWidth="2.5"/>
                <path d="M10 2 A8 8 0 0 1 18 10" stroke="#C8913A" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>

        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem", color: "#1A1208", marginBottom: "2px" }}>{user.first_name} {user.last_name}</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D", marginBottom: "8px" }}>
            Member since {new Date(user.date_joined).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            style={{ padding: "6px 14px", borderRadius: "9px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: avatarLoading ? "#948A7D" : "#7A6E60", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 500, cursor: avatarLoading ? "wait" : "pointer" }}
          >
            {avatarLoading ? "Uploading…" : "Change photo"}
          </button>
          {avatarError && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#923A22", marginTop: "6px" }}>{avatarError}</p>
          )}
        </div>
      </div>

      {/* ── Personal info ───────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.015em", marginBottom: "20px" }}>Personal information</h2>
        {apiError && (
          <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(181,74,44,0.08)", border: "1px solid rgba(181,74,44,0.2)", marginBottom: "16px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#923A22" }}>{apiError}</p>
          </div>
        )}
        <div style={{ display: "grid", gap: "16px" }} className="sm:grid-cols-2">
          <Field label="First name"><input type="text" value={form.firstName} onChange={set("firstName")} style={inputStyle} {...focusHandlers}/></Field>
          <Field label="Last name"><input type="text" value={form.lastName} onChange={set("lastName")} style={inputStyle} {...focusHandlers}/></Field>
          <Field label="Email address" hint="Used for booking confirmations">
            <input type="email" value={form.email} disabled style={{ ...inputStyle, background: "#F5F0E8", color: "#948A7D", cursor: "not-allowed" }}/>
          </Field>
          <Field label="Phone number">
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+44 7700 900000" style={inputStyle} {...focusHandlers}/>
          </Field>
          <Field label="Nationality">
            <input type="text" value={form.nationality} onChange={set("nationality")} placeholder="e.g. British" style={inputStyle} {...focusHandlers}/>
          </Field>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px" }}>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "11px 28px", borderRadius: "12px", background: saving ? "#E2D8C2" : "#1A1208", color: saving ? "#948A7D" : "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: saving ? "wait" : "pointer", transition: "all 0.2s" }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <SaveFeedback saved={saved} />
        </div>
      </div>

      {/* ── Change password ─────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.015em", marginBottom: "20px" }}>Change password</h2>
        {pwError && (
          <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(181,74,44,0.08)", border: "1px solid rgba(181,74,44,0.2)", marginBottom: "14px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#923A22" }}>{pwError}</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "480px" }}>
          {[
            { label: "Current password",     key: "current", placeholder: "••••••••" },
            { label: "New password",          key: "next",    placeholder: "Min. 8 characters" },
            { label: "Confirm new password",  key: "confirm", placeholder: "Repeat new password" },
          ].map(({ label, key, placeholder }) => (
            <Field key={key} label={label}>
              <input type="password" value={pwForm[key as keyof typeof pwForm]}
                onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} style={inputStyle} {...focusHandlers as React.InputHTMLAttributes<HTMLInputElement>}/>
            </Field>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
          <button onClick={handlePwSave} disabled={pwSaving}
            style={{ padding: "11px 28px", borderRadius: "12px", background: pwSaving ? "#E2D8C2" : "#1A1208", color: pwSaving ? "#948A7D" : "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: pwSaving ? "wait" : "pointer", transition: "all 0.2s" }}>
            {pwSaving ? "Updating…" : "Update password"}
          </button>
          <SaveFeedback saved={pwSaved} />
        </div>
      </div>

      {/* ── Danger zone ─────────────────────────────────────────────── */}
      <div style={{ background: "rgba(181,74,44,0.04)", borderRadius: "20px", border: "1px solid rgba(181,74,44,0.2)", padding: "24px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#923A22", marginBottom: "8px" }}>Delete account</h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.6, marginBottom: "14px" }}>
          Permanently delete your account and all booking history. This cannot be undone.
        </p>
        <button
          onClick={() => { setShowDelete(true); setDeletePass(""); setDeleteError(""); }}
          style={{ padding: "9px 20px", borderRadius: "10px", border: "1.5px solid rgba(181,74,44,0.4)", background: "transparent", color: "#923A22", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer" }}
        >
          Delete my account
        </button>
      </div>

      {/* ── Delete confirmation modal ────────────────────────────────── */}
      {showDelete && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(26,18,8,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDelete(false); }}
        >
          <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", maxWidth: "440px", width: "100%", boxShadow: "0 24px 64px rgba(26,18,8,0.2)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.02em", marginBottom: "4px" }}>Delete account?</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.6 }}>
                  This will permanently delete your account and all your booking history. Enter your password to confirm.
                </p>
              </div>
              <button onClick={() => setShowDelete(false)} style={{ marginLeft: "12px", flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#948A7D", padding: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            {deleteError && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(181,74,44,0.08)", border: "1px solid rgba(181,74,44,0.2)", marginBottom: "14px" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#923A22" }}>{deleteError}</p>
              </div>
            )}

            <Field label="Current password">
              <input
                type="password"
                value={deletePass}
                onChange={(e) => setDeletePass(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleDeleteAccount(); }}
                placeholder="••••••••"
                autoFocus
                style={inputStyle}
                {...focusHandlers}
              />
            </Field>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setShowDelete(false)}
                style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "none", background: deleteLoading ? "#E2D8C2" : "#B54A2C", color: deleteLoading ? "#948A7D" : "#fff", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", cursor: deleteLoading ? "wait" : "pointer", transition: "all 0.2s" }}
              >
                {deleteLoading ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
