import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Constituição Portuguesa — Assistente IA",
  description:
    "Consulte a Constituição da República Portuguesa com inteligência artificial. Faça perguntas em linguagem natural e receba respostas fundamentadas nos artigos constitucionais, com citações diretas.",
  keywords: [
    "Constituição Portuguesa",
    "Constituição da República Portuguesa",
    "direito constitucional",
    "artigos constitucionais",
    "IA jurídica",
    "assistente constitucional",
    "lei fundamental Portugal",
  ],
  authors: [{ name: "Constituição IA" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Constituição Portuguesa — Assistente IA",
    description:
      "Consulte a Constituição da República Portuguesa com inteligência artificial. Respostas fundamentadas nos artigos constitucionais.",
    locale: "pt_PT",
    type: "website",
    siteName: "Constituição IA",
  },
  twitter: {
    card: "summary",
    title: "Constituição Portuguesa — Assistente IA",
    description:
      "Consulte a Constituição da República Portuguesa com inteligência artificial. Respostas fundamentadas nos artigos constitucionais.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
