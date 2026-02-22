import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { Logo } from "./logo";
import { PortugueseFlag } from "./portuguese-flag";

interface HeaderProps {
  onNewChat?: () => void;
  showNewChat?: boolean;
}

export function Header({ onNewChat, showNewChat }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Logo size={24} />
          <span className="text-sm font-medium tracking-tight text-foreground">
            Constituição Portuguesa
          </span>
          <PortugueseFlag size={18} />
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
