"use client";

const TABS = [
  {
    value: "all",
    label: "All Trips",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7.5 4.5v3l1.8 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: "tour",
    label: "Tours",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5L2 12h11L7.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M5.5 12v1.5h4V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: "transfer",
    label: "Transfers",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="6.5" width="13" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1 8l2.5-3.5h8L14 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="4.5"  cy="12" r="1.4" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="10.5" cy="12" r="1.4" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    value: "experience",
    label: "Experiences",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1C4.8 1 2.5 3.5 2.5 6c0 3.8 5 8 5 8s5-4.2 5-8C12.5 3.5 10.2 1 7.5 1z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="7.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
];

interface TypeTabsProps {
  value:    string;
  onChange: (type: string) => void;
}

export function TypeTabs({ value, onChange }: TypeTabsProps) {
  return (
    <>
      <style>{`
        .tv-type-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 15px;
          border-radius: 10px;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.16s;
          flex-shrink: 0;
          white-space: nowrap;
          border: 1.5px solid transparent;
        }
        .tv-type-tab-inactive {
          background: rgba(255,255,255,0.07);
          color: rgba(253,252,250,0.6);
          border-color: rgba(255,255,255,0.1);
        }
        .tv-type-tab-inactive:hover {
          background: rgba(255,255,255,0.13) !important;
          color: rgba(253,252,250,0.88) !important;
          border-color: rgba(255,255,255,0.18) !important;
        }
        .tv-type-tab-active {
          background: #C8913A;
          color: #1A1208;
          border-color: #C8913A;
          font-weight: 600;
          box-shadow: 0 3px 14px rgba(200,145,58,0.45);
        }
      `}</style>

      <div style={{
        display: "flex", gap: "7px", overflowX: "auto",
        scrollbarWidth: "none", paddingBottom: "2px",
      }}>
        {TABS.map((tab) => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`tv-type-tab ${active ? "tv-type-tab-active" : "tv-type-tab-inactive"}`}
            >
              <span style={{ display: "flex", alignItems: "center", opacity: active ? 1 : 0.75 }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
