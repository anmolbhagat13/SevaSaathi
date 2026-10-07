import React, { useState } from "react";
import { Search, Printer, FileText, Check, Clock } from "lucide-react";
import { api } from "../../services/api";

function GovernmentPortal({
    applications,
    setApplications,
    selectedAppId,
    setSelectedAppId
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [certificateView, setCertificateView] = useState(null);

    const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

    const filtered = applications.filter(a => 
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async () => {
        if (!currentApp) return;
        setActionLoading(true);

        const res = await api.officerAction(currentApp.id, {
            action: "APPROVE",
            remarks: "Verified against revenue records. Approved.",
            officerName: "R. K. Verma (Tehsildar Grade-I)"
        });

        setTimeout(() => {
            setActionLoading(false);
            if (res?.application) {
                setApplications(prev => prev.map(a => a.id === res.application.id ? res.application : a));
                setCertificateView(res.application);
            } else {
                const updated = {
                    ...currentApp,
                    status: "APPROVED",
                    currentStage: "Certificate Issued & Digitally Signed",
                    certificateNo: `CERT-UP-${Math.floor(100000 + Math.random() * 900000)}`,
                    qrDigest: "SHA256:4f89b1c93a9081e7d82b4a11f9"
                };
                setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
                setCertificateView(updated);
            }
        }, 500);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        Government Mock Portal
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Simulating live departmental gateway scrutiny & officer approval
                    </p>
                </div>
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>Gateway Online (HTTP 200)</span>
                </div>
            </div>

            {/* Split Screen Queue & Scrutiny */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Queue (5 cols) */}
                <div className="lg:col-span-5 bg-[#0c0c0e] rounded-xl border border-neutral-800 flex flex-col h-[560px] overflow-hidden">
                    <div className="p-3 border-b border-neutral-800">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, applicant name..."
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/80 p-2 space-y-1">
                        {filtered.map((app) => {
                            const isSelected = currentApp?.id === app.id;
                            const isApproved = app.status === "APPROVED";
                            return (
                                <div
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-3 rounded-lg cursor-pointer text-xs transition ${
                                        isSelected
                                            ? "bg-neutral-800 border border-neutral-700"
                                            : "hover:bg-neutral-900 border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-white font-medium">{app.id}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                                            isApproved ? "bg-white text-black font-semibold" : "bg-neutral-800 text-neutral-400"
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-neutral-200 mt-1">{app.applicantName}</h4>
                                    <p className="text-[11px] text-neutral-400">{app.serviceName}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Scrutiny Console (7 cols) */}
                <div className="lg:col-span-7 bg-[#0c0c0e] rounded-xl border border-neutral-800 flex flex-col h-[560px] overflow-hidden">
                    {currentApp ? (
                        <div className="p-5 flex flex-col h-full overflow-y-auto space-y-4">
                            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                                <div>
                                    <span className="font-mono text-xs text-neutral-400">{currentApp.id}</span>
                                    <h3 className="text-sm font-semibold text-white mt-0.5">{currentApp.serviceName}</h3>
                                    <p className="text-xs text-neutral-400">Applicant: {currentApp.applicantName}</p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-white font-medium">
                                    {currentApp.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <span className="text-[11px] text-neutral-500 block">Aadhaar (e-KYC)</span>
                                    <span className="font-mono font-medium text-white">{currentApp.aadhaarNumber}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <span className="text-[11px] text-neutral-500 block">Annual Income</span>
                                    <span className="font-medium text-white">{currentApp.annualIncome}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <span className="text-[11px] text-neutral-500 block">District</span>
                                    <span className="font-medium text-white">{currentApp.district}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <span className="text-[11px] text-neutral-500 block">Consent Token</span>
                                    <span className="font-mono text-white">{currentApp.consentReceiptId || "CONSENT-VERIFIED"}</span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-2 pt-2">
                                <h4 className="text-xs font-semibold text-neutral-400">Processing Timeline</h4>
                                {(currentApp.timeline || []).map((step, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60">
                                        <span className="text-neutral-300">{step.stage}</span>
                                        <span className="text-[11px] text-neutral-500">
                                            {step.status === "COMPLETED" ? "Done" : "Pending"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="pt-3 mt-auto flex items-center justify-end gap-2 border-t border-neutral-800">
                                {currentApp.status === "APPROVED" ? (
                                    <button
                                        onClick={() => setCertificateView(currentApp)}
                                        className="px-3.5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>View Issued Certificate</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-semibold transition"
                                    >
                                        {actionLoading ? "Signing Certificate..." : "Approve & Issue Certificate"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-xs text-neutral-500 text-center">
                            Select an application from the queue.
                        </div>
                    )}
                </div>
            </div>

            {/* Clean Monochrome Certificate Modal */}
            {certificateView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                    <div className="w-full max-w-xl bg-white text-black rounded-xl p-8 space-y-5 border border-neutral-300 shadow-2xl relative">
                        <button
                            onClick={() => setCertificateView(null)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-black text-xs p-1"
                        >
                            ✕
                        </button>

                        <div className="text-center border-b border-neutral-300 pb-4">
                            <span className="text-2xl font-bold block mb-1">🏛️</span>
                            <h2 className="text-base font-bold tracking-wide uppercase">
                                GOVERNMENT OF UTTAR PRADESH
                            </h2>
                            <p className="text-xs text-neutral-600 uppercase">
                                Department of Revenue • Citizen Service Delivery
                            </p>
                            <h3 className="text-sm font-bold uppercase mt-2">
                                {certificateView.serviceName}
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                            <div className="flex justify-between font-mono text-[11px] text-neutral-600 border-b border-neutral-200 pb-1">
                                <span>Cert No: <strong>{certificateView.certificateNo || "CERT-UP-INC-2026-98104"}</strong></span>
                                <span>Date: {new Date().toLocaleDateString()}</span>
                            </div>

                            <p>
                                This is to certify that <strong>{certificateView.applicantName}</strong>, resident of District <strong>{certificateView.district}</strong>, has been officially verified for <strong>{certificateView.serviceName}</strong>.
                            </p>

                            <p>
                                Annual household assessment: <strong>{certificateView.annualIncome}</strong>.
                            </p>

                            <div className="p-2.5 rounded bg-neutral-100 text-[11px] font-mono text-neutral-700">
                                UIDAI Ref: {certificateView.aadhaarNumber} | Consent Ref: {certificateView.consentReceiptId || "CONSENT-VERIFIED"}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-300 text-xs">
                            <div className="text-[10px] text-neutral-600 font-mono">
                                <span>Digitally Signed</span>
                                <span className="block truncate max-w-[200px]">{certificateView.qrDigest || "SHA256:4f89b1c93a9081e7d82b4a11f9"}</span>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GovernmentPortal;
