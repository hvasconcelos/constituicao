import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Constituição Portuguesa - Chatbot",
  description:
    "Chatbot sobre a Constituição da República Portuguesa. Faça perguntas e receba respostas fundamentadas nos artigos constitucionais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
