"use client";

import React, { useState, useRef } from "react";
import { Mic, UploadCloud, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [activeTab, setActiveTab] = useState<"voice" | "document">("voice");

  // State for Voice Tab
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle");
  const [voiceResult, setVoiceResult] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // State for Document Tab
  const [docStatus, setDocStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [docResult, setDocResult] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const response = await fetch("http://localhost:4000/api/match-voice", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process audio.");
      }

      setVoiceResult(data);
      setVoiceStatus("success");
    } catch (err) {
      console.error(err);
      setVoiceStatus("error");
    }
  };

  // --- Document Handlers ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processDocument(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processDocument(e.target.files[0]);
    }
  };

  const processDocument = async (file: File) => {
    try {
      setDocStatus("uploading");
      setDocStatus("processing");

      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch("http://localhost:4000/api/simplify-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process document.");
      }

      setDocResult(data.markdown);
      setDocStatus("success");
    } catch (err) {
      console.error(err);
      setDocStatus("error");
    }
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      <header className="mb-8 border-4 border-foreground p-6 bg-accent text-background shadow-[6px_6px_0px_0px_var(--color-foreground)]">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
          Jan-Sahayak
        </h1>
        <p className="text-xl md:text-2xl font-bold mt-2">
          Your AI Civic & Legal Empowerment Platform
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab("voice")}
          className={`flex-1 min-w-[200px] h-16 flex items-center justify-center gap-2 border-4 border-foreground font-extrabold text-lg uppercase transition-all duration-200 ${
            activeTab === "voice"
              ? "bg-secondary text-white shadow-[4px_4px_0px_0px_var(--color-foreground)] translate-x-[-2px] translate-y-[-2px]"
              : "bg-background text-foreground hover:bg-secondary/10 shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--color-foreground)]"
          }`}
        >
          <Mic size={24} strokeWidth={3} /> Voice Matcher
        </button>
        <button
          onClick={() => setActiveTab("document")}
          className={`flex-1 min-w-[200px] h-16 flex items-center justify-center gap-2 border-4 border-foreground font-extrabold text-lg uppercase transition-all duration-200 ${
            activeTab === "document"
              ? "bg-secondary text-white shadow-[4px_4px_0px_0px_var(--color-foreground)] translate-x-[-2px] translate-y-[-2px]"
              : "bg-background text-foreground hover:bg-secondary/10 shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--color-foreground)]"
          }`}
        >
          <FileText size={24} strokeWidth={3} /> Doc Simplifier
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col border-4 border-foreground bg-white shadow-[8px_8px_0px_0px_var(--color-foreground)] p-6 md:p-10 relative overflow-hidden">
        
        {/* Voice Tab */}
        {activeTab === "voice" && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <h2 className="text-3xl font-extrabold text-center mb-12">
              Tell us about yourself to find schemes.
            </h2>
            
            <div className="relative flex items-center justify-center mb-12">
              {/* Pulse rings */}
              {isRecording && (
                <>
                  <div className="absolute w-48 h-48 rounded-full border-4 border-accent animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
                  <div className="absolute w-64 h-64 rounded-full border-4 border-accent animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 animation-delay-500"></div>
                </>
              )}
              
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`relative z-10 w-40 h-40 rounded-full border-8 border-foreground flex items-center justify-center transition-transform active:scale-95 ${
                  isRecording ? "bg-accent shadow-[inset_0px_0px_20px_rgba(0,0,0,0.5)]" : "bg-white shadow-[8px_8px_0px_0px_var(--color-foreground)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_var(--color-foreground)]"
                }`}
              >
                <Mic size={64} className={`${isRecording ? "text-white" : "text-foreground"}`} strokeWidth={3} />
              </button>
            </div>
            
            <p className="text-xl font-bold uppercase tracking-wider text-center">
              {voiceStatus === "idle" && "Hold to Speak"}
              {voiceStatus === "recording" && "Listening..."}
              {voiceStatus === "processing" && "Analyzing Audio..."}
              {voiceStatus === "error" && <span className="text-red-600">Audio processing failed. Try again.</span>}
            </p>

            {voiceStatus === "success" && voiceResult && (
              <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-4 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                  <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
                    <CheckCircle className="text-success" /> Profile Extracted
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-8 font-bold text-lg">
                    <div className="border-2 border-foreground p-3 bg-secondary/10">Age: {voiceResult.profile?.age || "N/A"}</div>
                    <div className="border-2 border-foreground p-3 bg-secondary/10">Income: {voiceResult.profile?.income || "N/A"}</div>
                    <div className="border-2 border-foreground p-3 bg-secondary/10">Occupation: {voiceResult.profile?.occupation || "N/A"}</div>
                    <div className="border-2 border-foreground p-3 bg-secondary/10">State: {voiceResult.profile?.state || "N/A"}</div>
                  </div>

                  <h3 className="text-2xl font-extrabold mb-4 border-b-4 border-foreground pb-2">Matching Schemes</h3>
                  <div className="space-y-4">
                    {voiceResult.matchedSchemes?.map((scheme: any, idx: number) => (
                      <div key={idx} className="border-4 border-foreground p-4 bg-white shadow-[4px_4px_0px_0px_var(--color-foreground)]">
                        <h4 className="text-xl font-extrabold text-secondary">{scheme.title}</h4>
                        <p className="mt-2 font-medium text-lg">{scheme.description}</p>
                        <div className="mt-4 inline-block bg-accent text-white font-bold px-3 py-1 border-2 border-foreground">
                          {scheme.matchReason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document Tab */}
        {activeTab === "document" && (
          <div className="flex flex-col h-full min-h-[400px]">
            <h2 className="text-3xl font-extrabold mb-6">
              Simplify Legal & Official Documents
            </h2>
            
            <div
              className={`flex-1 min-h-[250px] border-4 border-dashed border-foreground flex flex-col items-center justify-center p-8 transition-colors ${
                dragActive ? "bg-secondary/20 border-solid" : "bg-background/50 hover:bg-background"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadCloud size={64} className="text-foreground mb-4" strokeWidth={2} />
              <p className="text-2xl font-extrabold text-center mb-2">Drag & Drop Document</p>
              <p className="text-lg font-bold text-center mb-6 opacity-75">PNG or JPEG allowed</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-4 bg-accent text-white text-xl font-extrabold uppercase border-4 border-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-foreground)] transition-all"
              >
                Browse Files
              </button>
            </div>

            <p className="text-xl font-bold uppercase tracking-wider text-center mt-6">
              {docStatus === "uploading" && "Uploading Document..."}
              {docStatus === "processing" && "Analyzing Text..."}
              {docStatus === "error" && <span className="text-red-600">Processing failed. Try again.</span>}
            </p>

            {docStatus === "success" && docResult && (
              <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-4 border-foreground bg-[#E5E7EB] p-6 shadow-[4px_4px_0px_0px_var(--color-foreground)] prose prose-lg prose-headings:font-extrabold prose-p:font-bold prose-strong:text-accent prose-li:font-bold max-w-none">
                  <ReactMarkdown>{docResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
