import React, { useState, useEffect, useRef } from "react";
import { 
    Send, 
    Mic, 
    MicOff, 
    Volume2, 
    ArrowRight
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
                "Apply for Income Certificate",
                "Apply for PM-Kisan Subsidy",
                "Apply for Solar Subsidy",
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

        let replyText = res?.reply || "I am processing your request. Please proceed to upload the required documents or review the application form.";
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
        <div className="flex flex-col h-[620px] bg-[#0c0c0e] rounded-xl border border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-[#111113] border-b border-neutral-800 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-semibold text-white">
                        AI Assistant
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                        {selectedService ? selectedService.shortName : "General Inquiry"}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Active</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                    const isAgent = m.sender === "agent";
                    return (
                        <div key={m.id} className={`flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
                            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                                isAgent
                                    ? "bg-neutral-900 border border-neutral-800 text-neutral-200"
                                    : "bg-white text-black font-medium"
                            }`}>
                                <p className="whitespace-pre-wrap">{m.text}</p>
                                
                                {isAgent && (
                                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-neutral-800/80 text-[10px] text-neutral-500">
                                        <span>{m.timestamp}</span>
                                        <button 
                                            onClick={() => speakText(m.text)}
                                            className="hover:text-white flex items-center gap-1 transition"
                                        >
                                            <Volume2 className="w-3 h-3" />
                                            <span>Listen</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Action chips */}
                            {isAgent && m.actions && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {m.actions.map((act, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleActionClick(act)}
                                            className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition flex items-center gap-1"
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
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                        <span>Thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 bg-[#111113] border-t border-neutral-800">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center gap-2"
                >
                    <button
                        type="button"
                        onClick={toggleSpeech}
                        title={isListening ? "Stop listening" : "Speak via microphone"}
                        className={`p-2 rounded-lg border transition ${
                            isListening
                                ? "bg-white text-black border-white"
                                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                    >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={isListening ? "Listening..." : t.chatPlaceholder}
                        className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
                    />

                    <button
                        type="submit"
                        disabled={!inputVal.trim()}
                        className="p-2 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-black transition"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AgentChat;
