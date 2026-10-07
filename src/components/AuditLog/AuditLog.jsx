import React, { useState } from "react";
import { Search, Download, Copy, Check } from "lucide-react";

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        Immutable Audit Ledger
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Cryptographically hashed records of agent reasoning, document validation, and consent
                    </p>
                </div>
                <button
                    onClick={exportLogs}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-200 text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                </button>
            </div>

            {/* Filter */}
            <div className="bg-[#0c0c0e] rounded-xl border border-neutral-800 p-4 space-y-3">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search logs by keyword, actor, action code..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                    />
                </div>

                {/* Table */}
                <div className="rounded-lg border border-neutral-800 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-900 text-neutral-400 text-[11px] border-b border-neutral-800">
                            <tr>
                                <th className="p-2.5">ID / Time</th>
                                <th className="p-2.5">Actor</th>
                                <th className="p-2.5">Action</th>
                                <th className="p-2.5">Description</th>
                                <th className="p-2.5">Consent</th>
                                <th className="p-2.5">Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/80 bg-neutral-950">
                            {filtered.map((log) => (
                                <tr key={log.id} className="hover:bg-neutral-900/50">
                                    <td className="p-2.5 font-mono text-[11px] text-neutral-400">
                                        <div className="text-white">{log.id}</div>
                                        <div className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="p-2.5 font-medium text-neutral-300">{log.actor}</td>
                                    <td className="p-2.5">
                                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                                            {log.actionCode}
                                        </span>
                                    </td>
                                    <td className="p-2.5 text-neutral-400 text-[11px] max-w-sm">{log.description}</td>
                                    <td className="p-2.5 text-[11px]">
                                        {log.consentRequired ? (
                                            log.consentGiven ? <span className="text-white font-medium">Approved</span> : <span className="text-neutral-500">Declined</span>
                                        ) : (
                                            <span className="text-neutral-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-2.5 font-mono text-[10px] text-neutral-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate max-w-[90px]">{log.hash}</span>
                                            <button
                                                onClick={() => copyHash(log.hash)}
                                                className="hover:text-white transition"
                                                title="Copy hash"
                                            >
                                                {copied === log.hash ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
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
