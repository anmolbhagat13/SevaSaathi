import React, { useState } from "react";
import { 
    Check, 
    AlertCircle, 
    ArrowRight, 
    RefreshCw, 
    FileText
} from "lucide-react";
import { api } from "../../services/api";

function DocumentHub({
    selectedService,
    documentsState,
    setDocumentsState,
    onProceedToForm,
    onRaiseEscalation
}) {
    const [scanningId, setScanningId] = useState(null);
    const [scanAlert, setScanAlert] = useState(null);

    const requiredDocs = selectedService?.requiredDocs || [
        { id: "aadhaar", name: "Aadhaar Card", mandatory: true },
        { id: "salary_slip", name: "Income Proof / Salary Slip", mandatory: true },
        { id: "ration_card", name: "Ration Card", mandatory: true }
    ];

    const runValidation = async (docId, scenario = "VALID") => {
        setScanningId(docId);
        setScanAlert(null);

        await api.validateDocument({
            docType: docId,
            applicantName: scenario === "NAME_MISMATCH" ? "Rameshwar P. Singh" : "Anmol Kumar",
            simulatedScenario: scenario
        });

        setTimeout(() => {
            setScanningId(null);
            if (scenario === "BLURRY_IMAGE") {
                const failRes = {
                    status: "WARNING_BLURRY",
                    error: "Low OCR quality (42%). Glare detected.",
                    advice: "Hold camera parallel on a dark flat surface with natural light."
                };
                setScanAlert(failRes);
                setDocumentsState(prev => ({ ...prev, [docId]: { status: "WARNING_BLURRY" } }));
            } else if (scenario === "NAME_MISMATCH") {
                const mismatchRes = {
                    status: "MISMATCH_NAME",
                    error: "Name discrepancy ('Rameshwar P. Singh' vs 'Rameshwar Prasad').",
                    advice: "Safety block active. Escalate to Jan-Sevak desk for attestation."
                };
                setScanAlert(mismatchRes);
                setDocumentsState(prev => ({ ...prev, [docId]: { status: "MISMATCH_NAME" } }));
            } else {
                setDocumentsState(prev => ({ ...prev, [docId]: { status: "VALID" } }));
                setScanAlert({ status: "VALID", message: "Document verified successfully." });
            }
        }, 600);
    };

    const handleVerifyAll = () => {
        const next = {};
        requiredDocs.forEach(d => {
            next[d.id] = { status: "VALID" };
        });
        setDocumentsState(next);
        setScanAlert({ status: "VALID", message: "All mandatory documents verified." });
    };

    const isAllValid = requiredDocs.every(d => documentsState[d.id]?.status === "VALID");

    return (
        <div className="bg-[#0c0c0e] rounded-xl border border-neutral-800 p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Required Documents
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Verify identity and eligibility proofs before form submission
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleVerifyAll}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-medium transition"
                    >
                        Verify All (1-Click)
                    </button>
                </div>
            </div>

            {/* Document List */}
            <div className="space-y-2">
                {requiredDocs.map((doc) => {
                    const status = documentsState[doc.id]?.status;
                    const isScanning = scanningId === doc.id;
                    const isValid = status === "VALID";
                    const isBlurry = status === "WARNING_BLURRY";
                    const isMismatch = status === "MISMATCH_NAME";

                    return (
                        <div
                            key={doc.id}
                            className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-neutral-800 text-neutral-300 flex items-center justify-center">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{doc.name}</h4>
                                    <span className="text-[11px] text-neutral-400">
                                        {isValid ? "Verified" : isBlurry ? "Blurry capture" : isMismatch ? "Name mismatch" : "Pending"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isScanning ? (
                                    <span className="text-neutral-400 flex items-center gap-1">
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        <span>Scanning...</span>
                                    </span>
                                ) : isValid ? (
                                    <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-white font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        <span>Ready</span>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => runValidation(doc.id, "VALID")}
                                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition"
                                    >
                                        Scan
                                    </button>
                                )}

                                {isMismatch && (
                                    <button
                                        onClick={() => onRaiseEscalation({
                                            reason: `Name Discrepancy in ${doc.name}`,
                                            agentDiagnosis: `Aadhaar name differs from ${doc.name}. Requires Jan-Sevak attestation.`
                                        })}
                                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-neutral-700 transition"
                                    >
                                        Escalate
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Test Edge Cases */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-800 text-neutral-400">
                <span>Simulate failure recovery:</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => runValidation(requiredDocs[0].id, "BLURRY_IMAGE")}
                        className="px-2 py-1 rounded border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[11px] transition"
                    >
                        Test Blurry Cam
                    </button>
                    <button
                        onClick={() => runValidation(requiredDocs[0].id, "NAME_MISMATCH")}
                        className="px-2 py-1 rounded border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[11px] transition"
                    >
                        Test Name Mismatch
                    </button>
                </div>
            </div>

            {/* Feedback Alert */}
            {scanAlert && (
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-white font-medium">
                        {scanAlert.status === "VALID" ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>{scanAlert.message || scanAlert.error}</span>
                    </div>
                    {scanAlert.advice && (
                        <p className="text-[11px] text-neutral-400 pl-5">{scanAlert.advice}</p>
                    )}
                </div>
            )}

            {/* Bottom Proceed */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={onProceedToForm}
                    disabled={!isAllValid}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs font-semibold flex items-center gap-1.5 transition"
                >
                    <span>Proceed to Review Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default DocumentHub;
