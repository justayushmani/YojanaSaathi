"use client";

import React, { useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function SidebarFeed() {
  const { dict } = useLanguage();
  const [expandedSchemeIdx, setExpandedSchemeIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Card 1: Trending Govt Schemes */}
      <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col flex-1 max-h-[60vh]">
        <h3 className="text-xl font-extrabold uppercase mb-4 flex items-center gap-2 border-b-4 border-black pb-2">
          <TrendingUp size={24} strokeWidth={3} className="text-[#FF5A00]" />
          {dict.trendingSchemes}
        </h3>
        <div className="overflow-y-auto pr-2 space-y-4">
          {dict.trendingSchemesList.map((scheme, idx) => {
            const isExpanded = expandedSchemeIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedSchemeIdx(isExpanded ? null : idx)}
                className="border-2 border-black p-3 bg-[#f7f7f7] hover:bg-[#FF5A00] hover:text-white transition-colors cursor-pointer group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-white text-black">
                  {scheme.title}
                </h4>
                <span
                  className={`${scheme.tagColor} text-white text-xs font-bold px-2 py-1 uppercase border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] inline-block`}
                >
                  {scheme.category}
                </span>

                {isExpanded && (
                  <div className="mt-4 border-t-2 border-black pt-3 group-hover:text-white text-black animate-in slide-in-from-top-2 fade-in cursor-default" onClick={(e) => e.stopPropagation()}>
                    <p className="text-sm font-semibold mb-3">{scheme.description}</p>
                    
                    <div className="mb-3 bg-white text-black border-2 border-black p-2">
                      <h5 className="font-extrabold uppercase text-xs mb-1">{dict.howToApply}</h5>
                      <p className="text-sm font-medium">{scheme.howToApply}</p>
                    </div>

                    <div className="mb-3 bg-white text-black border-2 border-black p-2">
                      <h5 className="font-extrabold uppercase text-xs mb-1">{dict.documentsRequired}</h5>
                      <ul className="list-disc list-inside text-sm font-medium">
                        {scheme.documentsRequired.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <a 
                      href={scheme.portalLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-black text-white border-2 border-white px-3 py-1 font-extrabold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform"
                    >
                      {dict.applyOnline}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 2: Recent Legal Updates */}
      <div className="bg-[#1D4ED8] text-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
        <h3 className="text-xl font-extrabold uppercase mb-4 flex items-center gap-2 border-b-4 border-black pb-2">
          <AlertTriangle size={24} strokeWidth={3} className="text-[#FF5A00]" />
          {dict.liveLegalUpdates}
        </h3>
        <div className="bg-black text-[#00FF00] font-mono p-3 border-2 border-white overflow-hidden relative h-16 flex items-center group cursor-default">
          <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] font-bold">
            {dict.tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}
