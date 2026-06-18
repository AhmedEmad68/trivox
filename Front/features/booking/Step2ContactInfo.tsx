"use client";

import { useState } from "react";

export interface ContactInfo {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  nationality: string;
  requests:    string;
}

interface Step2Props {
  data:    ContactInfo;
  onChange:(d: ContactInfo) => void;
  onNext:  () => void;
  onBack:  () => void;
}

interface FieldProps {
  label:       string;
  required?:   boolean;
  error?:      string;
  children:    React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
        {label}{required && <span style={{ color: "#B54A2C", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#B54A2C" }}>{error}</p>}
    </div>
  );
}

const NATIONALITIES = [
  "Afghan","Albanian","Algerian","American","Andorran","Angolan","Argentine","Armenian","Australian","Austrian",
  "Azerbaijani","Bahraini","Bangladeshi","Belgian","Bolivian","Bosnian","Brazilian","British","Bulgarian","Canadian",
  "Chilean","Chinese","Colombian","Croatian","Cuban","Czech","Danish","Dutch","Egyptian","Emirati",
  "Estonian","Ethiopian","Finnish","French","Georgian","German","Ghanaian","Greek","Hungarian","Indian",
  "Indonesian","Iranian","Iraqi","Irish","Israeli","Italian","Japanese","Jordanian","Kazakhstani","Kenyan",
  "Korean","Kuwaiti","Latvian","Lebanese","Libyan","Lithuanian","Malaysian","Maltese","Mexican","Moldovan",
  "Moroccan","Mozambican","Namibian","New Zealander","Nigerian","Norwegian","Omani","Pakistani","Palestinian",
  "Peruvian","Philippine","Polish","Portuguese","Qatari","Romanian","Russian","Saudi","Serbian","Singaporean",
  "Slovak","Slovenian","South African","Spanish","Sri Lankan","Sudanese","Swedish","Swiss","Syrian",
  "Taiwanese","Tanzanian","Thai","Tunisian","Turkish","Ugandan","Ukrainian","Uruguayan","Venezuelan","Vietnamese",
];

export function Step2ContactInfo({ data, onChange, onNext, onBack }: Step2Props) {
  const [touched, setTouched] = useState<Set<keyof ContactInfo>>(new Set());

  const touch = (field: keyof ContactInfo) => setTouched((t) => new Set([...t, field]));

  const errors: Partial<ContactInfo> = {};
  if (!data.firstName.trim())                                  errors.firstName = "First name is required";
  if (!data.lastName.trim())                                   errors.lastName  = "Last name is required";
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))        errors.email     = "Please enter a valid email address";
  if (!data.phone.trim())                                      errors.phone     = "Phone number is required";

  const canProceed = Object.keys(errors).length === 0;

  const set = (field: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: "12px",
    fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208",
    background: "#fff", outline: "none",
    border: "1.5px solid rgba(226,216,194,0.8)",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const errorStyle: React.CSSProperties = { ...inputStyle, borderColor: "#B54A2C" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <Field label="First name" required error={touched.has("firstName") ? errors.firstName : undefined}>
          <input
            type="text" value={data.firstName} onChange={set("firstName")}
            onBlur={() => touch("firstName")}
            placeholder="Sarah"
            style={touched.has("firstName") && errors.firstName ? errorStyle : inputStyle}
          />
        </Field>
        <Field label="Last name" required error={touched.has("lastName") ? errors.lastName : undefined}>
          <input
            type="text" value={data.lastName} onChange={set("lastName")}
            onBlur={() => touch("lastName")}
            placeholder="Mitchell"
            style={touched.has("lastName") && errors.lastName ? errorStyle : inputStyle}
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email address" required error={touched.has("email") ? errors.email : undefined}>
        <input
          type="email" value={data.email} onChange={set("email")}
          onBlur={() => touch("email")}
          placeholder="sarah@example.com"
          style={touched.has("email") && errors.email ? errorStyle : inputStyle}
        />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D" }}>
          Confirmation voucher will be sent here
        </p>
      </Field>

      {/* Phone */}
      <Field label="Phone number" required error={touched.has("phone") ? errors.phone : undefined}>
        <input
          type="tel" value={data.phone} onChange={set("phone")}
          onBlur={() => touch("phone")}
          placeholder="+44 7700 900000"
          style={touched.has("phone") && errors.phone ? errorStyle : inputStyle}
        />
      </Field>

      {/* Nationality */}
      <Field label="Nationality">
        <select
          value={data.nationality}
          onChange={set("nationality")}
          style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        >
          <option value="">Select nationality</option>
          {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </Field>

      {/* Special requests */}
      <Field label="Special requests">
        <textarea
          value={data.requests}
          onChange={set("requests")}
          rows={3}
          placeholder="Dietary requirements, accessibility needs, celebrations…"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </Field>

      {/* Privacy note */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "12px 14px", background: "#F5F0E8", borderRadius: "12px" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <path d="M7 1.5L2 4v4c0 2.75 2.24 4.63 5 5 2.76-.37 5-2.25 5-5V4L7 1.5z" stroke="#7A6E60" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", lineHeight: 1.6 }}>
          Your information is encrypted and secure. We never share personal data with third parties.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onBack}
          style={{ flex: "none", padding: "14px 20px", borderRadius: "14px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer", transition: "all 0.15s" }}
        >
          ← Back
        </button>
        <button onClick={() => { setTouched(new Set(Object.keys(errors) as (keyof ContactInfo)[])); if (canProceed) onNext(); }}
          style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "none", cursor: "pointer", background: canProceed ? "#C8913A" : "#E2D8C2", color: canProceed ? "#1A1208" : "#948A7D", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", boxShadow: canProceed ? "0 4px 20px rgba(200,145,58,0.35)" : "none", transition: "all 0.2s" }}
        >
          Continue to add-ons →
        </button>
      </div>
    </div>
  );
}
