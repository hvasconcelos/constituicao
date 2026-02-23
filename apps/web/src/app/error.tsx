"use client";

export default function ErrorPage({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold text-foreground">Algo correu mal</h2>
      <p className="max-w-sm text-center text-[13px] text-muted-foreground">
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-[14px] text-primary-foreground hover:bg-primary/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
