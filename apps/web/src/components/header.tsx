export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-sm font-bold text-white">
          CRP
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight">
            Constituição Portuguesa
          </h1>
          <p className="text-xs text-gray-500">
            Assistente sobre a Constituição da República Portuguesa
          </p>
        </div>
      </div>
    </header>
  );
}
