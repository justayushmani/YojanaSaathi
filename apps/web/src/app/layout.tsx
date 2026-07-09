import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedApp from "../components/ProtectedApp";

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
    <AuthProvider>
      <html
        lang="en"
        className={`${plusJakartaSans.variable} font-sans h-full antialiased`}
      >
        <body className="min-h-full flex flex-col selection:bg-[#FF5A00] selection:text-white">
          <LanguageProvider>
            <ProtectedApp>
              {children}
            </ProtectedApp>
          </LanguageProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
