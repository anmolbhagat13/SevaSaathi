import React, { useState } from "react";
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
        { name: "Annual Income", value: formData.annualIncome || "₹85,000", purpose: "Eligibility verification" },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0e0e11] rounded-xl border border-neutral-800 shadow-2xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Citizen Consent Protocol
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            DPDP Act 2023 Statutory Authorization
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-neutral-500 hover:text-white text-xs p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Explanation */}
                <p className="text-xs text-neutral-400 leading-relaxed">
                    You are authorizing the SevaSaathi agent to transmit the following personal data to the <strong>{selectedService?.dept}</strong>. The agent cannot submit without this explicit approval.
                </p>

                {/* Itemized Table */}
                <div className="rounded-lg border border-neutral-800 overflow-hidden text-xs">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-900 text-neutral-400 text-[11px] border-b border-neutral-800">
                            <tr>
                                <th className="p-2.5 font-medium">Field</th>
                                <th className="p-2.5 font-medium">Value</th>
                                <th className="p-2.5 font-medium">Purpose</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/80 bg-neutral-950">
                            {sensitiveFields.map((f, i) => (
                                <tr key={i}>
                                    <td className="p-2.5 text-neutral-300 font-medium">{f.name}</td>
                                    <td className="p-2.5 text-white font-mono">{f.value}</td>
                                    <td className="p-2.5 text-neutral-400">{f.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-2 pt-1 text-xs text-neutral-400">
                    <input
                        type="checkbox"
                        id="agree-chk"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-700 bg-neutral-900"
                    />
                    <label htmlFor="agree-chk" className="cursor-pointer">
                        I grant explicit consent to transmit this application to the Government Gateway. I retain the right under DPDP Act 2023 to inspect or revoke this delegation.
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                    <button
                        onClick={onConsentDeclined}
                        className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs transition"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleGrant}
                        disabled={!agreed || submitting}
                        className="px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs font-semibold transition"
                    >
                        {submitting ? "Signing..." : "Grant Consent & Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsentModal;
