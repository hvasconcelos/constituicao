"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt">
      <body className="font-sans antialiased">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100dvh", gap: "1rem", padding: "1rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            Algo correu mal
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#737373", textAlign: "center", maxWidth: "24rem" }}>
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          <button
            onClick={reset}
            style={{ backgroundColor: "#0a0a0a", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", border: "none", cursor: "pointer" }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
