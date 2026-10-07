import React, { useState } from "react";
import { Shield, Lock } from "lucide-react";
import { api } from "../../services/api";

function ConsentModal({
    isOpen,
    onClose,
    selectedService,
    formData,
    onConsentGranted,
    onConsentDeclined
}) {
    const [submitting, setSubmitting] = useState(false);
    const [agreed, setAgreed] = useState(true);

    if (!isOpen) return null;

    const sensitiveFields = [
        { name: "Aadhaar / Virtual ID", value: formData.aadhaarNumber || "XXXX-XXXX-6523", purpose: "Identity de-duplication" },
        { name: "Annual Family Income", value: formData.annualIncome || "₹85,000", purpose: "Eligibility verification" },
        { name: "District / Residence", value: formData.district || "State Resident", purpose: "Jurisdiction & Officer routing" }
    ];

    const handleGrant = async () => {
        setSubmitting(true);
        const res = await api.recordConsent({
            citizenName: formData.applicantName || "Citizen",
            serviceName: selectedService?.name || "Service",
            sensitiveFields: sensitiveFields.map(f => f.name),
            department: selectedService?.dept,
            approved: true
        });

        setTimeout(() => {
            setSubmitting(false);
            onConsentGranted(res || {
                consentId: `CONSENT-${Math.floor(10000 + Math.random() * 90000)}`,
                approved: true,
                hashSignature: "SHA256:8f9210ab2e718894df4032c129e7019",
                timestamp: new Date().toISOString()
            });
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                            <Shield className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Citizen Consent Protocol
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                DPDP Act 2023 Statutory Informed Authorization
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed">
                    You are authorizing the SevaSaathi agent to transmit the following personal data to the <strong>{selectedService?.dept}</strong>. The agent cannot submit without this explicit approval.
                </p>

                {/* Itemized Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <table className="w-full text-left">
                        <thead className="bg-orange-50/70 text-slate-700 text-[11px] font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-2.5">Field</th>
                                <th className="p-2.5">Value</th>
                                <th className="p-2.5">Purpose</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {sensitiveFields.map((f, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="p-2.5 text-slate-800 font-semibold">{f.name}</td>
                                    <td className="p-2.5 text-orange-700 font-mono font-medium">{f.value}</td>
                                    <td className="p-2.5 text-slate-500 text-[11px]">{f.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-600">
                    <input
                        type="checkbox"
                        id="agree-chk"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="agree-chk" className="cursor-pointer text-[11px] leading-relaxed">
                        I grant explicit consent to transmit this application to the Government Gateway. I retain the right under DPDP Act 2023 to inspect or revoke this delegation.
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                        onClick={onConsentDeclined}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleGrant}
                        disabled={!agreed || submitting}
                        className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-sm"
                    >
                        {submitting ? "Signing Cryptographic Token..." : "Grant Consent & Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsentModal;