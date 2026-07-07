import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jan-Sahayak | AI Civic & Legal Empowerment",
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
      className={`${plusJakartaSans.variable} font-sans h-full antialiased bg-[#FFFDF9] text-[#1A1A1A]`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
