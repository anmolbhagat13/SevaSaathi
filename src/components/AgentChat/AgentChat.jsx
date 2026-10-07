import React, { useState, useEffect, useRef } from "react";
import { 
    Send, 
    Mic, 
    MicOff, 
    Volume2, 
    ArrowRight,
    Paperclip,
    Sparkles,
    Bot
} from "lucide-react";
import { api } from "../../services/api";
import { LANGUAGES } from "../../data/translations";

function AgentChat({
    t,
    currentLanguage,
    isVoiceMuted,
    selectedService,
    onOpenDocs,
    onOpenConsent,
    onOpenFormReview,
    onOpenEscalation
}) {
    const [messages, setMessages] = useState([
        {
            id: "msg-welcome",
            sender: "agent",
            text: t.welcomeMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
                "Upload Documents",
                "Apply for Income Certificate",
                "Apply for PM-Kisan Subsidy",
                "Check Application Status"
            ]
        }
    ]);
    const [inputVal, setInputVal] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const speakText = (text) => {
        if (isVoiceMuted || !("speechSynthesis" in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage);
            if (currentLangObj) utterance.lang = currentLangObj.voiceLang || "en-IN";
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn(e);
        }
    };

    const toggleSpeech = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        try {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRec();
            recognitionRef.current = rec;

            const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage);
            rec.lang = currentLangObj ? currentLangObj.voiceLang : "en-IN";
            rec.onstart = () => setIsListening(true);
            rec.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                setInputVal(transcript);
                setIsListening(false);
                handleSend(transcript);
            };
            rec.onerror = () => setIsListening(false);
            rec.onend = () => setIsListening(false);
            rec.start();
        } catch (e) {
            setIsListening(false);
        }
    };

    const handleSend = async (customText = null) => {
        const text = (customText !== null ? customText : inputVal).trim();
        if (!text) return;

        const userMsg = {
            id: `msg-${Date.now()}`,
            sender: "user",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputVal("");
        setIsTyping(true);

        const res = await api.chatWithAgent(
            text,
            currentLanguage === "hi" ? "Hindi" : currentLanguage === "mr" ? "Marathi" : "English",
            messages,
            selectedService ? selectedService.id : null
        );

        setIsTyping(false);

        let replyText = res?.reply || "I am processing your request. Please upload your required documents or review the application form.";
        let actions = res?.suggestedActions || ["Upload Documents", "Review Form", "Need Human Help"];

        const agentMsg = {
            id: `msg-agent-${Date.now()}`,
            sender: "agent",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions
        };

        setMessages(prev => [...prev, agentMsg]);
        speakText(replyText);
    };

    const handleActionClick = (action) => {
        if (action.includes("Upload Documents") || action.includes("Document")) {
            onOpenDocs();
        } else if (action.includes("Review") || action.includes("Consent") || action.includes("Form")) {
            onOpenFormReview();
        } else if (action.includes("Human") || action.includes("Jan-Sevak") || action.includes("Help")) {
            onOpenEscalation();
        } else {
            handleSend(action);
        }
    };

    return (
        <div className="flex flex-col h-[620px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3.5 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800">
                            AI Citizen Assistant
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            {selectedService ? selectedService.shortName : "General Citizen Inquiries"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-orange-700 bg-white px-2.5 py-1 rounded-full border border-orange-200 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Agent Online</span>
                </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
                {messages.map((m) => {
                    const isAgent = m.sender === "agent";
                    return (
                        <div key={m.id} className={`flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                isAgent
                                    ? "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                                    : "bg-orange-600 text-white rounded-tr-sm shadow-sm"
                            }`}>
                                <p className="whitespace-pre-wrap">{m.text}</p>
                                
                                {isAgent && (
                                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                                        <span>{m.timestamp}</span>
                                        <button 
                                            onClick={() => speakText(m.text)}
                                            className="hover:text-orange-600 flex items-center gap-1 transition font-medium"
                                        >
                                            <Volume2 className="w-3 h-3" />
                                            <span>Listen</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Suggested Action Chips */}
                            {isAgent && m.actions && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {m.actions.map((act, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleActionClick(act)}
                                            className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-orange-50 border border-orange-200 text-orange-700 hover:border-orange-400 font-medium transition flex items-center gap-1 shadow-2xs"
                                        >
                                            <span>{act}</span>
                                            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 pl-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span>SevaSaathi is reviewing portal rules...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center gap-2"
                >
                    {/* Attachment: directly opens document upload */}
                    <button
                        type="button"
                        onClick={onOpenDocs}
                        title="Upload Documents"
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition"
                    >
                        <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Microphone Toggle */}
                    <button
                        type="button"
                        onClick={toggleSpeech}
                        title={isListening ? "Stop listening" : "Speak via microphone"}
                        className={`p-2.5 rounded-xl border transition ${
                            isListening
                                ? "bg-orange-600 text-white border-orange-600 animate-pulse ring-2 ring-orange-200"
                                : "border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600"
                        }`}
                    >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Text input */}
                    <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={isListening ? "Listening to your voice..." : t.chatPlaceholder}
                        className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition"
                    />

                    {/* Send button */}
                    <button
                        type="submit"
                        disabled={!inputVal.trim()}
                        className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AgentChat;