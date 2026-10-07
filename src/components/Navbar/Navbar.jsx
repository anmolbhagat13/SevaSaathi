import React, { useState } from "react";
import { 
    Globe, 
    Volume2, 
    VolumeX, 
    Bot, 
    Landmark, 
    Shield, 
    AlertCircle, 
    BarChart3, 
    FileText 
} from "lucide-react";
import { LANGUAGES } from "../../data/translations";

function Navbar({ 
    activeTab, 
    setActiveTab, 
    currentLanguage, 
    setLanguage, 
    isVoiceMuted, 
    setIsVoiceMuted,
    t
}) {
    const [langOpen, setLangOpen] = useState(false);
    const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

    const navTabs = [
        { id: "agent", label: t.tabs.agent, icon: Bot },
        { id: "portal", label: t.tabs.portal, icon: Landmark },
        { id: "audit", label: t.tabs.audit, icon: Shield },
        { id: "escalation", label: t.tabs.escalation, icon: AlertCircle },
        { id: "metrics", label: t.tabs.metrics, icon: BarChart3 },
        { id: "designNote", label: t.tabs.designNote, icon: FileText }
    ];

    return (
        <header className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white text-black font-bold flex items-center justify-center text-sm tracking-tight">
                            S
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-white tracking-tight text-sm sm:text-base">
                                {t.appTitle}
                            </span>
                            <span className="text-xs text-neutral-500 hidden sm:inline">
                                Citizen Agent
                            </span>
                        </div>
                    </div>

                    {/* Right Tools: Voice & Language */}
                    <div className="flex items-center gap-2">
                        {/* Audio Toggle */}
                        <button
                            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                            title={isVoiceMuted ? "Enable Voice" : "Mute Voice"}
                            className={`p-2 rounded-lg border text-xs transition ${
                                isVoiceMuted
                                    ? "border-neutral-800 text-neutral-500 hover:text-white"
                                    : "border-neutral-700 bg-neutral-800 text-white"
                            }`}
                        >
                            {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 text-xs transition"
                            >
                                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{currentLangObj.native}</span>
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-1.5 w-36 rounded-lg bg-neutral-900 border border-neutral-800 shadow-xl py-1 z-50">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setLangOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-800 transition ${
                                                currentLanguage === lang.code ? "text-white font-semibold bg-neutral-800/60" : "text-neutral-400"
                                            }`}
                                        >
                                            <span>{lang.native}</span>
                                            <span className="text-[10px] text-neutral-500">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Minimal Profile Icon */}
                        <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center ml-1">
                            A
                        </div>
                    </div>
                </div>

                {/* Minimal Navigation Tabs */}
                <nav className="flex space-x-1 overflow-x-auto py-1.5 border-t border-neutral-900 no-scrollbar">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition ${
                                    isActive
                                        ? "bg-white text-black font-medium"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;