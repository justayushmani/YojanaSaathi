import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import FloatingChatbot from "../components/FloatingChatbot";
import { LanguageProvider } from "../contexts/LanguageContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yojana-Saathi | AI Civic & Legal Empowerment",
  description: "AI Civic & Legal Empowerment Platform for India's Next Billion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-[#FF5A00] selection:text-white">
        <LanguageProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <FloatingChatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
