"use client";

export interface Step {
  id:     number;
  label:  string;
  sublabel?: string;
}

interface StepIndicatorProps {
  steps:       Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {steps.map((step, i) => {
        const done    = step.id < currentStep;
        const active  = step.id === currentStep;
        const pending = step.id > currentStep;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            {/* Circle + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600,
                transition: "all 0.25s",
                background: done ? "#4A7C3F" : active ? "#C8913A" : "#F5F0E8",
                color:      done ? "#fff"    : active ? "#1A1208"  : "#948A7D",
                border:     `2px solid ${done ? "#4A7C3F" : active ? "#C8913A" : "#E2D8C2"}`,
                boxShadow:  active ? "0 0 0 4px rgba(200,145,58,0.18)" : "none",
              }}>
                {done ? (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 7.5l3.5 3.5 6-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : step.id}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: "0.75rem", fontWeight: 500, fontFamily: "var(--font-sans)",
                  color: done ? "#4A7C3F" : active ? "#1A1208" : "#948A7D",
                  whiteSpace: "nowrap",
                }}>{step.label}</p>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "2px", margin: "0 8px", marginBottom: "22px",
                background: done ? "#4A7C3F" : "#E2D8C2",
                borderRadius: "2px",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
