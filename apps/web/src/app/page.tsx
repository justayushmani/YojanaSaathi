"use client";

import React, { useState } from "react";
import { Mic, FileText } from "lucide-react";
import VoiceMatcher from "../components/VoiceMatcher";
import DocSimplifier from "../components/DocSimplifier";
import SidebarFeed from "../components/SidebarFeed";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"voice" | "document">("voice");

  return (
    <div className="max-w-[1440px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 flex flex-col lg:grid lg:grid-cols-[65%_minmax(0,1fr)] gap-8">

      {/* Left Column: Interactive Core Canvas */}
      <div className="flex flex-col min-h-0">

        {/* Tab Switcher */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab("voice")}
            className={`flex-1 min-w-[200px] h-16 flex items-center justify-center gap-2 border-4 border-black font-extrabold text-lg sm:text-xl uppercase transition-all duration-200 ${activeTab === "voice"
                ? "bg-[#1D4ED8] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                : "bg-white text-black hover:bg-[#f0f0f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              }`}
          >
            <Mic size={24} strokeWidth={3} /> Voice Matcher
          </button>

          <button
            onClick={() => setActiveTab("document")}
            className={`flex-1 min-w-[200px] h-16 flex items-center justify-center gap-2 border-4 border-black font-extrabold text-lg sm:text-xl uppercase transition-all duration-200 ${activeTab === "document"
                ? "bg-[#1D4ED8] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                : "bg-white text-black hover:bg-[#f0f0f0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              }`}
          >
            <FileText size={24} strokeWidth={3} /> Doc Simplifier
          </button>
        </div>

        {/* Dynamic Canvas Space */}
        <div className="flex-1 bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {activeTab === "voice" ? <VoiceMatcher /> : <DocSimplifier />}
        </div>
      </div>

      {/* Right Column: Knowledge Feed Sidebar */}
      <div className="hidden lg:block min-h-0">
        <SidebarFeed />
      </div>

      {/* Mobile Sidebar display (stacks below on small screens) */}
      <div className="block lg:hidden w-full">
        <SidebarFeed />
      </div>

    </div>
  );
}
