"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useLanguage } from "../contexts/LanguageContext";

export default function FloatingChatbot() {
  const { language, dict } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Namaste! I am Sahayak, your welfare companion. How can I help you today?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory.slice(1), // excluding initial static message
          language
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || "Failed to send message.");
      }

      setChatHistory(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', content: "⚠️ Sorry, I encountered an error connecting to the server. (Check API rate limits)" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#FF5A00] text-white border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:scale-110 hover:rotate-12 transition-transform duration-200"
          style={{ borderBottomLeftRadius: "0" }} // Comic bubble effect
        >
          <MessageSquare size={32} strokeWidth={2.5} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-[400px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-[#1D4ED8] text-white p-4 border-b-4 border-black flex items-center justify-between">
            <h3 className="font-extrabold uppercase tracking-widest text-lg">{dict.saathiChat}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FF5A00] transition-colors"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#f7f7f7] flex flex-col gap-4">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-[85%] font-bold ${
                  msg.role === 'user' 
                    ? 'bg-yellow-200 self-end rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                    : 'bg-white self-start rounded-tl-xl rounded-tr-xl rounded-br-xl'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-white border-2 border-black p-3 self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-tl-xl rounded-tr-xl rounded-br-xl font-bold animate-pulse">
                {dict.saathiTyping}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t-4 border-black flex gap-2">
            <input
              type="text"
              placeholder={dict.askSaathi}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
              className="flex-1 border-2 border-black px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A00]"
            />
            <button onClick={sendChatMessage} className="bg-[#FF5A00] text-white border-2 border-black p-2 hover:bg-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Send size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
