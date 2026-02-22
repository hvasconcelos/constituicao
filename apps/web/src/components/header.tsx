export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-12 max-w-3xl items-center gap-3 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-950">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
        <span className="text-sm font-medium tracking-tight text-neutral-950">
          Constituição Portuguesa
        </span>
      </div>
    </header>
  );
}
