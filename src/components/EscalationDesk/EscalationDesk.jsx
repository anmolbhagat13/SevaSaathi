import React, { useState } from "react";
import { AlertCircle, Check, Headphones, UserCheck } from "lucide-react";
import { api } from "../../services/api";

function EscalationDesk({
    escalations = [],
    setEscalations,
    onSimulateStuckAgent
}) {
    const [selectedId, setSelectedId] = useState(escalations[0]?.id || null);
    const [resolutionText, setResolutionText] = useState("");
    const [resolving, setResolving] = useState(false);

    const active = escalations.find(e => e.id === selectedId) || escalations[0];

    const handleResolve = async () => {
        if (!active) return;
        setResolving(true);

        const res = await api.resolveEscalation(active.id, {
            resolutionNote: resolutionText || "Manual officer attestation verified and approved.",
            officerName: "Vikram Jadhav (Helpdesk Officer)"
        });

        setTimeout(() => {
            setResolving(false);
            setResolutionText("");
            if (res?.escalation) {
                setEscalations(prev => prev.map(e => e.id === res.escalation.id ? res.escalation : e));
            } else {
                const updated = {
                    ...active,
                    status: "RESOLVED",
                    resolutionNote: resolutionText || "Manual clearance issued."
                };
                setEscalations(prev => prev.map(e => e.id === updated.id ? updated : e));
            }
        }, 500);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                        <Headphones className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Jan-Sevak Helpdesk: Human Escalation Desk
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Human-in-the-loop escalation queue for blocked applications, low quality scans & manual attestations
                        </p>
                    </div>
                </div>
                <button
                    onClick={onSimulateStuckAgent}
                    className="px-3.5 py-2 rounded-xl border border-orange-200 hover:border-orange-300 bg-orange-50/60 hover:bg-orange-100 text-orange-700 text-xs font-semibold transition self-start sm:self-auto"
                >
                    Simulate Stuck Case
                </button>
            </div>

            {/* Split Screen Queue & Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Queue (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm h-[500px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                    {escalations.map((esc) => {
                        const isSelected = active?.id === esc.id;
                        const isResolved = esc.status === "RESOLVED";
                        return (
                            <div
                                key={esc.id}
                                onClick={() => setSelectedId(esc.id)}
                                className={`p-3.5 rounded-xl cursor-pointer text-xs transition ${
                                    isSelected
                                        ? "bg-orange-50/80 border border-orange-200 shadow-xs"
                                        : "hover:bg-slate-50 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-orange-700 font-bold">{esc.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                        isResolved 
                                            ? "bg-emerald-100 text-emerald-800" 
                                            : "bg-amber-100 text-amber-800"
                                    }`}>
                                        {esc.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 mt-1">{esc.citizenName} ({esc.serviceName})</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">{esc.reason}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Right Workbench (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm h-[500px] p-6 flex flex-col justify-between">
                    {active ? (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <span className="font-mono text-xs text-slate-400 font-semibold">{active.id}</span>
                                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{active.reason}</h3>
                                    <p className="text-xs text-slate-500">Citizen: <strong className="text-slate-800">{active.citizenName}</strong></p>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                    active.status === "RESOLVED"
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}>
                                    {active.status}
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                                <span className="text-orange-700 font-bold block">Autonomous Agent Diagnosis</span>
                                <p className="text-slate-700 leading-relaxed">{active.agentDiagnosis}</p>
                            </div>

                            {active.status === "RESOLVED" ? (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                                    <span className="text-emerald-800 font-bold block">Officer Resolution Recorded</span>
                                    <p className="text-emerald-700 italic">"{active.resolutionNote}"</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-700 block font-bold">
                                        Resolution Action / Override Note
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={resolutionText}
                                        onChange={(e) => setResolutionText(e.target.value)}
                                        placeholder="Add officer resolution notes to unblock the agent..."
                                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl p-3 text-xs text-slate-800 outline-none resize-none transition"
                                    />
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={handleResolve}
                                            disabled={resolving}
                                            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm"
                                        >
                                            {resolving ? "Resolving..." : "Resolve & Unblock Agent"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 text-center py-12 my-auto">
                            Select an escalation ticket from the queue.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EscalationDesk;