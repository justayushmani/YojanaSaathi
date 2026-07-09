"use client";

import React, { useState } from "react";
import { User, Info, Globe, X, LogOut } from "lucide-react";
import { useLanguage, LanguageType } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { language, setLanguage, dict } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black w-full shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left Side: Branding */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-black">
              Yojana-Saathi
            </h1>
            <span className="bg-[#FF5A00] text-white text-xs font-bold px-2 py-1 uppercase border-2 border-black rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Beta
            </span>
          </div>

          {/* Right Side: Interactive Elements */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-[#f0f0f0] border-2 border-black px-3 py-2 font-bold uppercase text-sm hover:bg-[#e0e0e0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Globe size={18} strokeWidth={3} /> {language}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50">
                  {(["English", "Hindi", "Hinglish"] as LanguageType[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLanguage(l);
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-left font-bold uppercase hover:bg-[#1D4ED8] hover:text-white border-b-2 border-black last:border-b-0"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Button */}
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="flex items-center gap-2 bg-white border-2 border-black px-3 py-2 font-bold uppercase text-sm hover:bg-[#FF5A00] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Info size={18} strokeWidth={3} /> {dict.aboutPlatform}
            </button>

            {/* Custom Authentication */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-10 h-10 bg-[#FF5A00] text-white border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-lg uppercase"
                >
                  {user.name.charAt(0)}
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50">
                    <div className="px-4 py-3 border-b-2 border-black">
                      <p className="font-black uppercase text-sm truncate">{user.name}</p>
                      <p className="text-xs font-bold text-gray-600 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="px-4 py-2 flex items-center gap-2 text-left font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <LogOut size={16} strokeWidth={3} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* About Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-8 max-w-2xl w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-4xl font-black uppercase">{dict.aboutPlatform}</h2>
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="prose prose-lg prose-headings:font-black prose-p:font-bold prose-strong:text-accent">
              <p>{dict.aboutIntro}</p>
              
              <h3>🎙️ {dict.voiceMatcher}</h3>
              <p>{dict.aboutVoiceMatcher}</p>
              
              <h3>📄 {dict.docSimplifier}</h3>
              <p>{dict.aboutDocSimplifier}</p>
              
              <h3>🤖 {dict.saathiChat}</h3>
              <p>{dict.aboutSaathiChat}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
