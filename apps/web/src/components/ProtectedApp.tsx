"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import Header from "./Header";
import FloatingChatbot from "./FloatingChatbot";

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="text-4xl font-black uppercase animate-pulse tracking-widest text-[#FF5A00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 bg-white">
          Loading Yojana-Saathi...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] p-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ccc_10px,#ccc_20px)]">
        <AuthModal isOpen={true} onClose={() => {}} forceOpen={true} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <FloatingChatbot />
    </>
  );
}
