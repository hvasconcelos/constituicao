import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";

interface HeaderProps {
  onNewChat?: () => void;
  showNewChat?: boolean;
}

export function Header({ onNewChat, showNewChat }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="default" size="icon-xs" className="pointer-events-none">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </Button>
          <span className="text-sm font-medium tracking-tight text-foreground">
            Constituição Portuguesa
          </span>
        </div>
        {showNewChat && onNewChat && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNewChat}
            title="Nova conversa"
          >
            <PlusIcon size={16} strokeWidth={2} />
          </Button>
        )}
      </div>
    </header>
  );
}
