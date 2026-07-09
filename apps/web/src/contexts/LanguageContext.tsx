"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type LanguageType = "English" | "Hindi" | "Hinglish";

export const t = {
  English: {
    aboutPlatform: "About Platform",
    voiceMatcher: "Voice Matcher",
    docSimplifier: "Doc Simplifier",
    findSchemes: "Find Schemes with Your Voice",
    tellUs: "Tell us your age, income, and occupation.",
    listeningIn: "Listening in",
    holdToSpeak: "Hold to Speak",
    listening: "Listening...",
    analyzingAudio: "Analyzing Audio...",
    audioFailed: "Audio Failed",
    retryMic: "Retry Mic",
    viewDetails: "View Details",
    profileExtracted: "Profile Extracted",
    reset: "Reset",
    age: "Age",
    income: "Income",
    occupation: "Occupation",
    state: "State",
    topMatches: "Top Matches",
    matchLabel: "Match!",
    simplifyJargon: "Simplify Legal Jargon",
    uploadMock: "Upload a document below or choose a mock one.",
    dragDrop: "Drag & Drop Document",
    allowedFiles: "PNG, JPEG, PDF allowed",
    browseFiles: "Browse Files",
    orMockDoc: "Or try a mock document",
    uploading: "Uploading...",
    analyzingText: "AI is analyzing text...",
    analysisComplete: "Analysis Complete",
    newDocument: "New Document",
    originalViewer: "Original Document Viewer",
    trendingYojana: "Trending Yojana (Govt Schemes)",
    recentUpdates: "Recent Policy Updates",
    civicNotices: "Important Civic Notices",
    saathiChat: "Sahayak AI Chat",
    saathiTyping: "Sahayak is typing...",
    askSaathi: "Ask Sahayak anything...",
    schemeDetails: "Scheme Details",
    howToApply: "How to Apply",
    close: "Close",
    emptyProfileWarning: "No profile details could be extracted. Please speak clearly.",
    documentsRequired: "Required Documents",
    applyOnline: "Apply on Official Portal",
    liveLegalUpdates: "Live Legal Updates",
    trendingSchemes: "Trending Schemes",
    tickerText: "** NEW RENT ACT PASSED IN MAHARASHTRA ** SUPREME COURT RULING ON FIR REGISTRATION ** DIGITAL DATA PROTECTION ACT ENFORCED **",
    aboutIntro: "Welcome to Yojana-Saathi! This platform uses Artificial Intelligence to make Indian government services and legal documents radically accessible to everyone.",
    aboutVoiceMatcher: "Speak naturally in English, Hindi, or Hinglish. We extract your profile (Age, Income, Occupation) from your audio and instantly query a vector database to find exactly which Government Schemes you are eligible for.",
    aboutDocSimplifier: "Got a confusing legal notice or FIR? Upload a picture of it. Our AI parses the document and outputs a simple 3-bullet-point summary explaining exactly what it means and what you need to do next.",
    aboutSaathiChat: "Need more help? Tap the floating chat bubble on the bottom right. Sahayak AI is always available to answer your civic questions.",
  },
  Hindi: {
    aboutPlatform: "प्लेटफ़ॉर्म के बारे में",
    voiceMatcher: "आवाज़ पहचानकर्ता",
    docSimplifier: "दस्तावेज़ सरलीकर्ता",
    findSchemes: "अपनी आवाज़ से योजनाएँ खोजें",
    tellUs: "हमें अपनी उम्र, आय और पेशा बताएं।",
    listeningIn: "सुन रहे हैं",
    holdToSpeak: "बोलने के लिए दबाएं",
    listening: "सुन रहे हैं...",
    analyzingAudio: "ऑडियो का विश्लेषण हो रहा है...",
    audioFailed: "ऑडियो विफल",
    retryMic: "माइक फिर से प्रयास करें",
    viewDetails: "विवरण देखें",
    profileExtracted: "प्रोफ़ाइल निकाली गई",
    reset: "रीसेट करें",
    age: "उम्र",
    income: "आय",
    occupation: "पेशा",
    state: "राज्य",
    topMatches: "शीर्ष मिलान",
    matchLabel: "मैच!",
    simplifyJargon: "कानूनी शब्दावली सरल करें",
    uploadMock: "नीचे एक दस्तावेज़ अपलोड करें या मॉक चुनें।",
    dragDrop: "दस्तावेज़ खींचें और छोड़ें",
    allowedFiles: "PNG, JPEG, PDF अनुमत",
    browseFiles: "फ़ाइलें ब्राउज़ करें",
    orMockDoc: "या मॉक दस्तावेज़ आज़माएं",
    uploading: "अपलोड हो रहा है...",
    analyzingText: "AI पाठ का विश्लेषण कर रहा है...",
    analysisComplete: "विश्लेषण पूर्ण",
    newDocument: "नया दस्तावेज़",
    originalViewer: "मूल दस्तावेज़ दर्शक",
    trendingYojana: "ट्रेंडिंग योजना (सरकारी योजनाएं)",
    recentUpdates: "हाल के नीति अपडेट",
    civicNotices: "महत्वपूर्ण नागरिक नोटिस",
    saathiChat: "सहायक एआई चैट",
    saathiTyping: "सहायक टाइप कर रहा है...",
    askSaathi: "सहायक से कुछ भी पूछें...",
    schemeDetails: "योजना विवरण",
    howToApply: "आवेदन कैसे करें",
    close: "बंद करें",
    emptyProfileWarning: "कोई प्रोफ़ाइल विवरण नहीं निकाला जा सका। कृपया स्पष्ट बोलें।",
    documentsRequired: "आवश्यक दस्तावेज़",
    applyOnline: "आधिकारिक पोर्टल पर आवेदन करें",
    liveLegalUpdates: "लाइव कानूनी अपडेट",
    trendingSchemes: "ट्रेंडिंग योजनाएं",
    tickerText: "** महाराष्ट्र में नया किराया अधिनियम पारित ** एफआईआर पंजीकरण पर सर्वोच्च न्यायालय का फैसला ** डिजिटल डेटा संरक्षण अधिनियम लागू **",
    aboutIntro: "योजना-साथी में आपका स्वागत है! यह प्लेटफ़ॉर्म भारतीय सरकारी सेवाओं और कानूनी दस्तावेजों को सभी के लिए सुलभ बनाने के लिए आर्टिफिशियल इंटेलिजेंस (AI) का उपयोग करता है।",
    aboutVoiceMatcher: "अंग्रेजी, हिंदी या हिंग्लिश में स्वाभाविक रूप से बोलें। हम आपके ऑडियो से आपकी प्रोफ़ाइल (उम्र, आय, पेशा) निकालते हैं और तुरंत यह पता लगाते हैं कि आप किन सरकारी योजनाओं के लिए पात्र हैं।",
    aboutDocSimplifier: "कोई भ्रमित करने वाला कानूनी नोटिस या FIR मिली है? उसकी एक तस्वीर अपलोड करें। हमारा AI दस्तावेज़ का विश्लेषण करता है और एक सरल 3-बिंदु सारांश देता है जो स्पष्ट रूप से समझाता है कि इसका क्या अर्थ है और आपको आगे क्या करने की आवश्यकता है।",
    aboutSaathiChat: "क्या अधिक मदद चाहिए? नीचे दाईं ओर तैरते चैट बुलबुले पर टैप करें। सहायक AI आपके नागरिक प्रश्नों का उत्तर देने के लिए हमेशा उपलब्ध है।",
  },
  Hinglish: {
    aboutPlatform: "Platform ke baare mein",
    voiceMatcher: "Voice Matcher",
    docSimplifier: "Document Simplify karein",
    findSchemes: "Apni Awaaz se Schemes khojein",
    tellUs: "Humein apni age, income, aur occupation ke baare mein batayein.",
    listeningIn: "Sun raha hai in",
    holdToSpeak: "Bolne ke liye dabayein",
    listening: "Sun raha hai...",
    analyzingAudio: "Audio analyze ho raha hai...",
    audioFailed: "Audio Fail ho gaya",
    retryMic: "Mic wapas try karein",
    viewDetails: "Details dekhein",
    profileExtracted: "Profile Extract ho gayi",
    reset: "Reset karein",
    age: "Umar",
    income: "Aamdani",
    occupation: "Kaam",
    state: "Rajya",
    topMatches: "Top Matches",
    matchLabel: "Match!",
    simplifyJargon: "Legal Jargon ko aasan banayein",
    uploadMock: "Neeche document upload karein ya chunein.",
    dragDrop: "Document Drag aur Drop karein",
    allowedFiles: "PNG, JPEG, PDF allowed hai",
    browseFiles: "Files Browse karein",
    orMockDoc: "Ya mock document try karein",
    uploading: "Upload ho raha hai...",
    analyzingText: "AI text analyze kar raha hai...",
    analysisComplete: "Analysis complete hua",
    newDocument: "Naya Document",
    originalViewer: "Original Document Viewer",
    trendingYojana: "Trending Yojana (Govt Schemes)",
    recentUpdates: "Recent Policy Updates",
    civicNotices: "Zaroori Civic Notices",
    saathiChat: "Sahayak AI Chat",
    saathiTyping: "Sahayak type kar raha hai...",
    askSaathi: "Sahayak se kuch bhi poochein...",
    schemeDetails: "Scheme Details",
    howToApply: "Kaise Apply Karein",
    close: "Band karein",
    emptyProfileWarning: "Koi profile extract nahi ho payi. Kripya clearly bolein.",
    documentsRequired: "Zaroori Documents",
    applyOnline: "Official Portal par Apply karein",
    liveLegalUpdates: "Live Legal Updates",
    trendingSchemes: "Trending Schemes",
    tickerText: "** MAHARASHTRA MEIN NAYA RENT ACT PASS HUA ** FIR REGISTRATION PAR SUPREME COURT KA FAISLA ** DIGITAL DATA PROTECTION ACT LAAgu **",
    aboutIntro: "Yojana-Saathi mein aapka swagat hai! Yeh platform Artificial Intelligence ka use karke Indian government services aur legal documents ko sabke liye accessible banata hai.",
    aboutVoiceMatcher: "English, Hindi, ya Hinglish mein naturally bolein. Hum aapke audio se aapki profile (Age, Income, Occupation) nikalte hain aur turant pata lagate hain ki aap kis Government Schemes ke liye eligible hain.",
    aboutDocSimplifier: "Koi confusing legal notice ya FIR mili hai? Uski picture upload karein. Hamara AI document ko parse karta hai aur ek simple 3-bullet-point summary deta hai jo explain karta hai ki iska kya matlab hai aur aapko aage kya karna hai.",
    aboutSaathiChat: "Kya aur madad chahiye? Bottom right mein floating chat bubble par tap karein. Sahayak AI aapke civic questions ka answer dene ke liye hamesha available hai.",
  }
};

type LanguageContextType = {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  dict: typeof t.English;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>("English");
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict: t[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
