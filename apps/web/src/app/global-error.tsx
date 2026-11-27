"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1c3a",
          color: "#f7fff7",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9cc5d8",
            }}
          >
            LLM Arena
          </p>
          <h1 style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}>
            The app could not load
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#9cc5d8" }}>
            An unexpected error stopped the shell from rendering. Reloading
            usually clears it; no run data was changed.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ffe66d",
              background: "#ffe66d",
              color: "#1b1c3a",
              padding: "0.5rem 0.9rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload the app
          </button>
          <p
            style={{
              marginTop: "0.75rem",
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              color: "#9cc5d8",
            }}
          >
            reference {error.digest ?? "local"}
          </p>
        </div>
      </body>
    </html>
  );
}
