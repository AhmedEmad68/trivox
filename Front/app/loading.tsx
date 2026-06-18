export default function Loading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
        paddingTop: "var(--navbar-height)",
      }}
    >
      {/* Animated compass spinner */}
      <div style={{ position: "relative", width: "56px", height: "56px" }}>
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          style={{ animation: "spin 1.2s linear infinite" }}
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="#EDE5D5"
            strokeWidth="3"
          />
          <path
            d="M28 4 A24 24 0 0 1 52 28"
            stroke="#C8913A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: "16px",
            borderRadius: "50%",
            background: "rgba(200,145,58,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 6.5 7 5.5 5.5 6.5Z" fill="#C8913A" />
            <path d="M7 13L5.5 7.5 7 8.5 8.5 7.5Z" fill="rgba(200,145,58,0.35)" />
          </svg>
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.9375rem",
          color: "#948A7D",
        }}
      >
        Loading…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
