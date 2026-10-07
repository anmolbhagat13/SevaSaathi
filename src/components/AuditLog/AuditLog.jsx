import React, { useState } from "react";
import { Search, Download, Copy, Check, Shield } from "lucide-react";

function AuditLog({ auditLogs = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [copied, setCopied] = useState(null);

    const filtered = auditLogs.filter(l => 
        l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.actionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.actor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyHash = (hash) => {
        navigator.clipboard.writeText(hash);
        setCopied(hash);
        setTimeout(() => setCopied(null), 1500);
    };

    const exportLogs = () => {
        const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit_ledger_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                        <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Immutable Accountability Audit Ledger
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cryptographically hashed records of agent reasoning, document validation, and consent
                        </p>
                    </div>
                </div>
                <button
                    onClick={exportLogs}
                    className="px-3.5 py-2 rounded-xl border border-orange-200 hover:border-orange-300 bg-orange-50/60 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>Export JSON</span>
                </button>
            </div>

            {/* Filter & Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search logs by keyword, actor, action code..."
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition"
                    />
                </div>

                {/* Table */}
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-orange-50/70 text-slate-700 text-[11px] font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-3">ID / Time</th>
                                <th className="p-3">Actor</th>
                                <th className="p-3">Action Code</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Consent</th>
                                <th className="p-3">Cryptographic Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filtered.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                                    <td className="p-3 font-mono text-[11px]">
                                        <div className="font-bold text-slate-900">{log.id}</div>
                                        <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="p-3 font-bold text-slate-800">{log.actor}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-mono font-semibold text-orange-700">
                                            {log.actionCode}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-600 text-[11px] max-w-sm leading-relaxed">{log.description}</td>
                                    <td className="p-3 text-[11px]">
                                        {log.consentRequired ? (
                                            log.consentGiven 
                                                ? <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">Approved</span> 
                                                : <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">Declined</span>
                                        ) : (
                                            <span className="text-slate-400">Autonomous</span>
                                        )}
                                    </td>
                                    <td className="p-3 font-mono text-[10px] text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate max-w-[100px]">{log.hash}</span>
                                            <button
                                                onClick={() => copyHash(log.hash)}
                                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-orange-600 transition"
                                                title="Copy hash"
                                            >
                                                {copied === log.hash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AuditLog;