"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Mic, CheckCircle, AlertTriangle, Play, Square, RotateCcw, AlertOctagon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function VoiceMatcher() {
  const { language, dict } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle");
  const [voiceResult, setVoiceResult] = useState<any>(null);
  
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Voice Handlers ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setVoiceStatus("recording");

      // Mock language detection
      setTimeout(() => setDetectedLang("Detecting..."), 500);
      setTimeout(() => setDetectedLang(`${language} 🇮🇳`), 1500);
    } catch (err) {
      console.error("Microphone access error:", err);
      setVoiceStatus("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVoiceStatus("processing");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/api/match-voice`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || "Failed to process audio.");
      }

      setVoiceResult(data);
      setVoiceStatus("success");
      setDetectedLang(null);
    } catch (err) {
      console.error(err);
      setVoiceStatus("error");
      setDetectedLang(null);
    }
  };

  // Reactive translation: Re-fetch schemes if language changes and we already have a profile
  useEffect(() => {
    if (voiceStatus === "success" && voiceResult?.profile) {
      // Show processing status while translating
      setVoiceStatus("processing");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      fetch(`${API_URL}/api/recommend-schemes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profile: voiceResult.profile, language })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVoiceResult({ ...voiceResult, matchedSchemes: data.schemes });
          setVoiceStatus("success");
        } else {
          setVoiceStatus("error");
        }
      })
      .catch(err => {
        console.error(err);
        setVoiceStatus("error");
      });
    }
  }, [language]);

  const [expandedSchemeIdx, setExpandedSchemeIdx] = useState<number | null>(null);

  const toggleScheme = (idx: number) => {
    setExpandedSchemeIdx(expandedSchemeIdx === idx ? null : idx);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-black uppercase tracking-tight">
        {dict.tellUs}
      </h2>
      
      {/* Language Detection Pill */}
      <div className="h-10 mb-6">
        {detectedLang && (
          <div className="animate-in fade-in zoom-in duration-300 bg-[#1D4ED8] text-white border-2 border-black px-4 py-1 font-bold text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            [ {dict.listeningIn}: {detectedLang} ]
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center mb-10">
        {/* Pulse rings / Waveform placeholder when recording */}
        {isRecording && (
          <div className="absolute flex items-end justify-center gap-2 h-40 w-40 z-0">
             <div className="w-3 bg-[#FF5A00] animate-[pulse_0.8s_ease-in-out_infinite] h-full"></div>
             <div className="w-3 bg-[#FF5A00] animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-1/2"></div>
             <div className="w-3 bg-[#FF5A00] animate-[pulse_0.6s_ease-in-out_infinite_0.4s] h-3/4"></div>
             <div className="w-3 bg-[#FF5A00] animate-[pulse_0.9s_ease-in-out_infinite_0.1s] h-1/4"></div>
             <div className="w-3 bg-[#FF5A00] animate-[pulse_0.4s_ease-in-out_infinite_0.3s] h-full"></div>
          </div>
        )}
        
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-none border-8 border-black flex items-center justify-center transition-transform active:scale-95 ${
            isRecording ? "bg-black shadow-[inset_0px_0px_0px_0px_rgba(0,0,0,1)]" : "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          }`}
        >
          <Mic size={56} className={`${isRecording ? "text-[#FF5A00]" : "text-black"}`} strokeWidth={3} />
        </button>
      </div>
      
      <p className="text-xl font-extrabold uppercase tracking-widest text-center text-black bg-[#f0f0f0] border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {voiceStatus === "idle" && dict.holdToSpeak}
        {voiceStatus === "recording" && dict.listening}
        {voiceStatus === "processing" && dict.analyzingAudio}
        {voiceStatus === "success" && dict.profileExtracted}
        {voiceStatus === "error" && dict.audioFailed}
      </p>

      {/* Brutalist Error State */}
      {voiceStatus === "error" && (
        <div className="mt-8 bg-red-100 border-4 border-black p-6 w-full max-w-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
          <AlertOctagon size={48} className="text-red-600 mb-2" strokeWidth={3} />
          <h3 className="text-2xl font-extrabold uppercase text-red-600 mb-4">{dict.audioFailed}</h3>
          <p className="font-bold text-red-800 mb-4">Please check your API rate limits or try speaking again.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setVoiceStatus("idle")} 
              className="bg-black text-white px-4 py-2 font-bold uppercase border-2 border-black flex items-center gap-2 hover:bg-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <RotateCcw size={20} strokeWidth={3} /> {dict.retryMic}
            </button>
          </div>
        </div>
      )}

      {/* Success Results */}
      {voiceStatus === "success" && voiceResult && (
        <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-extrabold uppercase mb-6 flex items-center gap-2 bg-[#1D4ED8] text-white p-2 border-2 border-black w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle size={28} strokeWidth={3} /> {dict.profileExtracted}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8 font-bold text-lg">
              <div className="border-4 border-black p-3 bg-[#f7f7f7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{dict.age}: <span className="text-[#FF5A00]">{voiceResult.profile?.age || "N/A"}</span></div>
              <div className="border-4 border-black p-3 bg-[#f7f7f7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{dict.income}: <span className="text-[#FF5A00]">{voiceResult.profile?.income || "N/A"}</span></div>
              <div className="border-4 border-black p-3 bg-[#f7f7f7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{dict.occupation}: <span className="text-[#FF5A00]">{voiceResult.profile?.occupation || "N/A"}</span></div>
              <div className="border-4 border-black p-3 bg-[#f7f7f7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{dict.state}: <span className="text-[#FF5A00]">{voiceResult.profile?.state || "N/A"}</span></div>
            </div>

            <h3 className="text-2xl font-extrabold uppercase mb-6 border-b-4 border-black pb-2">{dict.topMatches}</h3>
            <div className="space-y-6">
              {voiceResult.matchedSchemes?.length > 0 ? voiceResult.matchedSchemes.map((scheme: any, idx: number) => {
                const isExpanded = expandedSchemeIdx === idx;
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleScheme(idx)}
                    className="border-4 border-black p-4 bg-[#f0f0f0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-white transition-colors group"
                  >
                    <h4 className="text-xl font-extrabold text-[#1D4ED8] uppercase group-hover:text-[#FF5A00] transition-colors">{scheme.title}</h4>
                    <p className="mt-2 font-bold text-lg text-black">{scheme.description}</p>
                    <div className="mt-4 mb-2 inline-block bg-[#FF5A00] text-white font-extrabold px-3 py-1 border-2 border-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {scheme.matchReason}
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-6 border-t-4 border-black pt-4 animate-in slide-in-from-top-2 fade-in">
                        <div className="mb-4">
                          <p className="text-lg text-black font-semibold">{scheme.fullDetails}</p>
                        </div>
                        
                        <div className="mb-4 bg-white border-2 border-black p-3">
                          <h5 className="font-extrabold text-black uppercase mb-2 bg-[#f0f0f0] border-2 border-black px-2 py-1 w-fit">{dict.howToApply}</h5>
                          <p className="whitespace-pre-wrap font-medium">{scheme.howToApply}</p>
                        </div>
                        
                        {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
                          <div className="mb-4 bg-white border-2 border-black p-3">
                            <h5 className="font-extrabold text-black uppercase mb-2 bg-[#f0f0f0] border-2 border-black px-2 py-1 w-fit">{dict.documentsRequired}</h5>
                            <ul className="list-disc list-inside font-medium space-y-1">
                              {scheme.documentsRequired.map((doc: string, i: number) => (
                                <li key={i}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {scheme.portalLink && (
                          <a 
                            href={scheme.portalLink.startsWith('http') ? scheme.portalLink : `https://${scheme.portalLink}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block mt-2 bg-[#00FF00] text-black border-4 border-black px-4 py-2 font-extrabold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            {dict.applyOnline}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="bg-orange-100 border-4 border-black p-4 font-bold text-orange-800">
                  {dict.emptyProfileWarning}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
