import { Button } from "@/components/ui/button";
import { BookIcon, PlusIcon } from "./icons";

interface HeaderProps {
  onNewChat?: () => void;
  showNewChat?: boolean;
}

export function Header({ onNewChat, showNewChat }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookIcon size={12} strokeWidth={2.5} />
          </div>
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
