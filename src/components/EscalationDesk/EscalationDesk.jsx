import React, { useState } from "react";
import { AlertCircle, Check, ArrowRight } from "lucide-react";
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        Jan-Sevak Helpdesk
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Human escalation queue for stuck agents and document discrepancies
                    </p>
                </div>
                <button
                    onClick={onSimulateStuckAgent}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-200 text-xs transition self-start sm:self-auto"
                >
                    Simulate Stuck Case
                </button>
            </div>

            {/* Split Screen Queue & Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Queue (5 cols) */}
                <div className="lg:col-span-5 bg-[#0c0c0e] rounded-xl border border-neutral-800 h-[500px] overflow-y-auto divide-y divide-neutral-800/80 p-2 space-y-1">
                    {escalations.map((esc) => {
                        const isSelected = active?.id === esc.id;
                        const isResolved = esc.status === "RESOLVED";
                        return (
                            <div
                                key={esc.id}
                                onClick={() => setSelectedId(esc.id)}
                                className={`p-3 rounded-lg cursor-pointer text-xs transition ${
                                    isSelected
                                        ? "bg-neutral-800 border border-neutral-700"
                                        : "hover:bg-neutral-900 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-white font-medium">{esc.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                                        isResolved ? "bg-white text-black font-semibold" : "bg-neutral-800 text-neutral-400"
                                    }`}>
                                        {esc.status}
                                    </span>
                                </div>
                                <h4 className="font-medium text-neutral-200 mt-1">{esc.citizenName} ({esc.serviceName})</h4>
                                <p className="text-[11px] text-neutral-400 mt-0.5">{esc.reason}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Right Workbench (7 cols) */}
                <div className="lg:col-span-7 bg-[#0c0c0e] rounded-xl border border-neutral-800 h-[500px] p-5 flex flex-col justify-between">
                    {active ? (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                                <div>
                                    <span className="font-mono text-xs text-neutral-400">{active.id}</span>
                                    <h3 className="text-sm font-semibold text-white mt-0.5">{active.reason}</h3>
                                    <p className="text-xs text-neutral-400">Citizen: {active.citizenName}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-white font-medium">
                                    {active.status}
                                </span>
                            </div>

                            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                                <span className="text-neutral-400 font-medium">Agent Diagnosis</span>
                                <p className="text-white leading-relaxed">{active.agentDiagnosis}</p>
                            </div>

                            {active.status === "RESOLVED" ? (
                                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                                    <span className="text-neutral-400 font-medium">Officer Resolution</span>
                                    <p className="text-white italic">"{active.resolutionNote}"</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-400 block font-medium">
                                        Resolution Action / Override Note
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={resolutionText}
                                        onChange={(e) => setResolutionText(e.target.value)}
                                        placeholder="Add resolution note to unblock the agent..."
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-white outline-none focus:border-neutral-600"
                                    />
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={handleResolve}
                                            disabled={resolving}
                                            className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition"
                                        >
                                            {resolving ? "Resolving..." : "Resolve & Unblock Agent"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-xs text-neutral-500 text-center py-12">
                            Select a ticket from the queue.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EscalationDesk;
