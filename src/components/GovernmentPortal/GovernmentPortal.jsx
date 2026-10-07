import React, { useState } from "react";
import { Search, Printer, FileText, Check, Clock, Landmark, QrCode } from "lucide-react";
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
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                        <Landmark className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            JanSeva State Government Mock Portal
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time state gateway simulation for officer scrutiny, approval & digital certificate signing
                        </p>
                    </div>
                </div>
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium flex items-center gap-2 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Gateway Online (200 OK)</span>
                </div>
            </div>

            {/* Split Screen Queue & Scrutiny */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Queue (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
                    <div className="p-3.5 border-b border-slate-100">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, applicant name..."
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                        {filtered.map((app) => {
                            const isSelected = currentApp?.id === app.id;
                            const isApproved = app.status === "APPROVED";
                            return (
                                <div
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-3.5 rounded-xl cursor-pointer text-xs transition ${
                                        isSelected
                                            ? "bg-orange-50/80 border border-orange-200 shadow-xs"
                                            : "hover:bg-slate-50 border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-orange-700 font-bold">{app.id}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                            isApproved 
                                                ? "bg-emerald-100 text-emerald-800" 
                                                : "bg-amber-100 text-amber-800"
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mt-1">{app.applicantName}</h4>
                                    <p className="text-[11px] text-slate-500">{app.serviceName}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Scrutiny Console (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
                    {currentApp ? (
                        <div className="p-6 flex flex-col h-full overflow-y-auto space-y-4">
                            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <span className="font-mono text-xs text-slate-400 font-semibold">{currentApp.id}</span>
                                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentApp.serviceName}</h3>
                                    <p className="text-xs text-slate-500">Applicant: <strong className="text-slate-800">{currentApp.applicantName}</strong></p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                    currentApp.status === "APPROVED" 
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                        : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}>
                                    {currentApp.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-400 block font-semibold">Aadhaar (e-KYC)</span>
                                    <span className="font-mono font-bold text-slate-800 mt-0.5 block">{currentApp.aadhaarNumber}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-400 block font-semibold">Annual Income</span>
                                    <span className="font-bold text-orange-700 mt-0.5 block">{currentApp.annualIncome}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-400 block font-semibold">District</span>
                                    <span className="font-bold text-slate-800 mt-0.5 block">{currentApp.district}</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-400 block font-semibold">Consent Token</span>
                                    <span className="font-mono text-slate-800 mt-0.5 block">{currentApp.consentReceiptId || "CONSENT-VERIFIED"}</span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-2 pt-2">
                                <h4 className="text-xs font-bold text-slate-800">Processing Timeline</h4>
                                {(currentApp.timeline || []).map((step, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                                        <span className="text-slate-700 font-medium">{step.stage}</span>
                                        <span className={`text-[11px] font-semibold ${step.status === "COMPLETED" ? "text-emerald-600" : "text-slate-400"}`}>
                                            {step.status === "COMPLETED" ? "✓ Completed" : "Pending"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="pt-4 mt-auto flex items-center justify-end gap-2.5 border-t border-slate-100">
                                {currentApp.status === "APPROVED" ? (
                                    <button
                                        onClick={() => setCertificateView(currentApp)}
                                        className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>View Issued Certificate</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-sm"
                                    >
                                        {actionLoading ? "Signing Certificate..." : "Approve & Issue Certificate"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-xs text-slate-400 text-center my-auto">
                            Select an application from the queue to review.
                        </div>
                    )}
                </div>
            </div>

            {/* Official Certificate Modal */}
            {certificateView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
                    <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl p-8 space-y-5 border-2 border-orange-300 shadow-2xl relative">
                        <button
                            onClick={() => setCertificateView(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-sm p-1 rounded-lg"
                        >
                            ✕
                        </button>

                        <div className="text-center border-b-2 border-orange-200 pb-4">
                            <span className="text-3xl font-bold block mb-1">🏛️</span>
                            <h2 className="text-base font-extrabold tracking-wide uppercase text-slate-900">
                                GOVERNMENT OF UTTAR PRADESH
                            </h2>
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                                Department of Revenue • Citizen Service Delivery
                            </p>
                            <h3 className="text-sm font-bold uppercase mt-2 text-orange-700 bg-orange-50 inline-block px-3 py-1 rounded-md border border-orange-200">
                                {certificateView.serviceName}
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                            <div className="flex justify-between font-mono text-[11px] text-slate-500 border-b border-slate-100 pb-1">
                                <span>Cert No: <strong>{certificateView.certificateNo || "CERT-UP-INC-2026-98104"}</strong></span>
                                <span>Date of Issue: {new Date().toLocaleDateString()}</span>
                            </div>

                            <p>
                                This is to certify that <strong>{certificateView.applicantName}</strong>, resident of District <strong>{certificateView.district}</strong>, has been officially verified for <strong>{certificateView.serviceName}</strong>.
                            </p>

                            <p>
                                Official assessment value: <strong className="text-slate-900">{certificateView.annualIncome}</strong>.
                            </p>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600">
                                UIDAI Reference: {certificateView.aadhaarNumber} | Consent Hash: {certificateView.consentReceiptId || "CONSENT-VERIFIED"}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t-2 border-orange-200 text-xs">
                            <div className="flex items-center gap-3">
                                <QrCode className="w-10 h-10 text-slate-800" />
                                <div className="text-[10px] text-slate-500 font-mono">
                                    <span className="font-bold text-slate-700 block">Digitally Signed</span>
                                    <span className="truncate max-w-[180px] block">{certificateView.qrDigest || "SHA256:4f89b1c93a9081e7d82b4a11f9"}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Certificate</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GovernmentPortal;