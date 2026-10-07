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
import logo from "../../assets/logo.jpeg";

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
        <header className="sticky top-0 z-30 bg-white border-b border-orange-100 shadow-sm">
            {/* Top Accent Strip in Warm GovTech Orange */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Brand with Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-orange-200 shadow-sm flex items-center justify-center bg-orange-50">
                            <img src={logo} alt="SevaSaathi" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                                    {t.appTitle}
                                </span>
                                <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 hidden sm:inline">
                                    GovTech AI
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                                Citizen Assistant for Government Services
                            </p>
                        </div>
                    </div>

                    {/* Right Tools: Voice & Language */}
                    <div className="flex items-center gap-2">
                        {/* Audio Toggle */}
                        <button
                            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                            title={isVoiceMuted ? "Enable Voice Assistant" : "Mute Voice Assistant"}
                            className={`p-2 rounded-lg border text-xs transition ${
                                isVoiceMuted
                                    ? "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                    : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                            }`}
                        >
                            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-200 hover:bg-orange-50 text-slate-700 text-xs font-medium transition"
                            >
                                <Globe className="w-3.5 h-3.5 text-orange-600" />
                                <span>{currentLangObj.native}</span>
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-50">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setLangOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition ${
                                                currentLanguage === lang.code ? "text-orange-700 font-bold bg-orange-50/60" : "text-slate-700"
                                            }`}
                                        >
                                            <span>{lang.native}</span>
                                            <span className="text-[10px] text-slate-400">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Citizen Profile Badge */}
                        <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold flex items-center justify-center ml-1">
                            A
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                    isActive
                                        ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                                        : "text-slate-600 hover:text-orange-700 hover:bg-orange-50"
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