"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText, AlertTriangle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useLanguage } from "../contexts/LanguageContext";

export default function DocSimplifier() {
  const { language, dict } = useLanguage();
  const [docStatus, setDocStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [docResult, setDocResult] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [selectedMockFile, setSelectedMockFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reactive translation: Re-fetch document summary if language changes and we already have a result
  useEffect(() => {
    if (docStatus === "success" && docResult) {
      setDocStatus("processing");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      fetch(`${API_URL}/api/translate-markdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: docResult, language })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDocResult(data.markdown);
          setDocStatus("success");
        } else {
          setDocStatus("error");
        }
      })
      .catch(err => {
        console.error(err);
        setDocStatus("error");
      });
    }
  }, [language]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
      setSelectedMockFile(file.name);
      
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setFileType(file.type);

      const formData = new FormData();
      formData.append("document", file);
      formData.append("language", language);

      setDocStatus("processing");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/api/simplify-document`, {
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

  // Mock functions for predefined suggestions
  const triggerMockAnalysis = (type: string) => {
    setDocStatus("processing");
    setSelectedMockFile(`${type}.pdf`);
    setPreviewUrl(null);
    setFileType("application/pdf");
    
    // Simulate API delay
    setTimeout(() => {
      setDocResult(`
### What happened
- The document is a standard **${type}** outlining the primary terms.
- It was created on the current date for the involved parties.

### User Rights
- You have the right to request amendments before signing.
- You are entitled to a full copy of the finalized document.

### Exact Next Action Steps
- **Review** all highlighted clauses carefully.
- **Consult** a local legal advisor if you disagree with any terms.
- **Sign** the document on the last page once satisfied.

> **Disclaimer:** I am an AI civic literacy assistant, not a lawyer. This information is for educational purposes and does not constitute legal advice. Please consult a qualified legal professional for your specific situation.
      `);
      setDocStatus("success");
    }, 1500);
  };

  return (
    <div className={`flex flex-col h-full min-h-[400px] ${docStatus === "success" ? "" : "items-center"}`}>
      
      {/* Title */}
      {docStatus !== "success" && (
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-black uppercase tracking-tight text-center">
          {dict.simplifyJargon}
        </h2>
      )}

      {/* Main Container changes to flex-row on success */}
      <div className={`w-full ${docStatus === "success" ? "flex flex-col lg:flex-row gap-6 h-[600px]" : "w-full max-w-2xl"}`}>
        
        {/* Left Side (or Full Width) - Upload Area / Mock Viewer */}
        <div className={`${docStatus === "success" ? "flex-1 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col" : "w-full"}`}>
          
          {docStatus === "success" ? (
            <>
              <div className="bg-black text-white p-2 border-2 border-black font-bold uppercase mb-4 shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] flex items-center gap-2">
                <FileText size={20} /> {selectedMockFile || "Document Viewer"}
              </div>
              <div className="flex-1 border-4 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {previewUrl ? (
                  fileType?.startsWith('image/') ? (
                    <img src={previewUrl} alt="Document Preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <iframe src={previewUrl} className="w-full h-full border-none" title="Document Preview" />
                  )
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ccc_10px,#ccc_20px)] opacity-20"></div>
                    <span className="font-extrabold uppercase text-gray-500 text-xl rotate-[-15deg]">{dict.originalViewer}</span>
                  </>
                )}
              </div>
              <button onClick={() => { setDocStatus("idle"); setDocResult(null); setPreviewUrl(null); }} className="mt-4 bg-[#FF5A00] text-white px-4 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                {dict.newDocument}
              </button>
            </>
          ) : (
            <>
              <div
                className={`w-full min-h-[250px] border-4 border-dashed border-black flex flex-col items-center justify-center p-8 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white relative ${
                  dragActive ? "bg-[#1D4ED8] bg-opacity-20 border-solid" : "hover:bg-[#f0f0f0]"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud size={80} className="text-black mb-6" strokeWidth={2} />
                <p className="text-2xl font-extrabold text-center mb-2 uppercase">{dict.dragDrop}</p>
                <p className="text-lg font-bold text-center mb-6 opacity-75 uppercase bg-black text-white px-2 py-1">{dict.allowedFiles}</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-[#1D4ED8] text-white text-xl font-extrabold uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
                >
                  {dict.browseFiles}
                </button>
              </div>

              {/* Suggestion Badges */}
              <div className="mt-8">
                <p className="text-sm font-extrabold uppercase mb-3 text-center tracking-widest text-gray-600">{dict.orMockDoc}:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["Rent Agreement", "FIR Draft", "Traffic Chalan"].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => triggerMockAnalysis(badge)}
                      className="bg-[#f7f7f7] text-black border-2 border-black font-bold uppercase text-sm px-4 py-2 hover:bg-[#FF5A00] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      [ {badge} ]
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Markdown Output */}
        {docStatus === "success" && docResult && (
          <div className="flex-1 flex flex-col border-4 border-black bg-[#f0f0f0] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-[#FF5A00] border-b-4 border-black p-3 font-extrabold uppercase text-white tracking-wider flex items-center justify-between">
              <span>{dict.analysisComplete}</span>
              <span className="bg-black text-white text-xs px-2 py-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">Verified</span>
            </div>
            <div className="p-6 overflow-y-auto prose prose-lg prose-headings:font-extrabold prose-headings:uppercase prose-p:font-bold prose-strong:text-[#1D4ED8] prose-li:font-bold max-w-none prose-blockquote:border-l-4 prose-blockquote:border-[#FF5A00] prose-blockquote:bg-white prose-blockquote:p-4 prose-blockquote:font-normal prose-blockquote:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ReactMarkdown>{docResult}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>

      {/* Loading/Error States when not in success view */}
      {docStatus !== "idle" && docStatus !== "success" && (
        <div className={`mt-8 text-xl font-extrabold tracking-widest text-center text-black border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${docStatus === "error" ? "bg-red-200" : "bg-[#f0f0f0] animate-pulse uppercase"}`}>
          {docStatus === "uploading" && dict.uploading}
          {docStatus === "processing" && dict.analyzingText}
          {docStatus === "error" && (
            <div className="flex flex-col items-center text-red-700">
              <AlertTriangle className="w-10 h-10 mb-2" />
              <span>Failed to process document. Please try again. (API Rate limit may have been exceeded)</span>
              <button onClick={() => setDocStatus("idle")} className="mt-4 bg-black text-white text-sm px-4 py-2 hover:bg-gray-800">Dismiss</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
