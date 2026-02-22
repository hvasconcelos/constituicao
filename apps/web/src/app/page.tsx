import { Header } from "@/components/header";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <Chat />
    </div>
  );
}
