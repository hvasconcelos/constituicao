import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold text-foreground">
        Página não encontrada
      </h2>
      <p className="max-w-sm text-center text-[13px] text-muted-foreground">
        A página que procura não existe.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-[14px] text-primary-foreground hover:bg-primary/90"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
