// DEMO VERIFICATION ONLY.
// Replace with official DigiLocker/API Setu/government verification
// after obtaining authorized API credentials.

import React, { useState, useRef } from "react";
import { 
    Upload, 
    Check, 
    AlertCircle, 
    ArrowRight, 
    RefreshCw, 
    FileText, 
    X, 
    Eye,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { api } from "../../services/api";

// Map frontend doc IDs / service to backend supported document types
const mapToSupportedDocType = (docId, serviceId) => {
    const id = (docId || "").toLowerCase();
    const sId = (serviceId || "").toLowerCase();

    if (id.includes("aadhaar")) return "aadhaar";
    if (id.includes("pan")) return "pan";
    if (id.includes("income") || id.includes("salary") || sId.includes("income")) return "income_certificate";
    if (id.includes("domicile") || sId.includes("domicile")) return "domicile_certificate";
    if (id.includes("caste") || id.includes("ancestry") || sId.includes("caste")) return "caste_certificate";
    if (id.includes("licence") || id.includes("license") || id.includes("driving") || sId.includes("driving")) return "driving_license";
    if (id.includes("voter")) return "voter_id";
    if (id.includes("birth")) return "birth_certificate";

    const supported = [
        "aadhaar", "pan", "income_certificate", "domicile_certificate",
        "caste_certificate", "driving_license", "voter_id", "birth_certificate"
    ];
    if (supported.includes(id)) return id;
    return id;
};

// Default realistic sample document numbers for demo verification
const getSampleDocNumber = (docType) => {
    switch (docType) {
        case "aadhaar": return "1234-5678-9012";
        case "pan": return "ABCDE1234F";
        case "income_certificate": return "INC-2026-98104";
        case "domicile_certificate": return "DOM-2026-44123";
        case "caste_certificate": return "CST-2026-78192";
        case "driving_license": return "DL-0420110012345";
        case "voter_id": return "ABC1234567";
        case "birth_certificate": return "BIRTH-2026-1029";
        default: return "DOC-991204";
    }
};

const formatFileSize = (bytes) => {
    if (!bytes) return "1.2 MB";
    return bytes > 1024 * 1024 
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

function DocumentHub({
    selectedService,
    documentsState,
    setDocumentsState,
    onProceedToForm,
    onRaiseEscalation
}) {
    const [uploadingDocId, setUploadingDocId] = useState(null);
    const [scanAlert, setScanAlert] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRefs = useRef({});

    const requiredDocs = selectedService?.requiredDocs || [
        { id: "aadhaar", name: "Aadhaar Card", mandatory: true, sampleName: "Aadhaar_Card.pdf" },
        { id: "salary_slip", name: "Income Proof / Salary Slip", mandatory: true, sampleName: "Patwari_Report.pdf" },
        { id: "ration_card", name: "Ration Card", mandatory: true, sampleName: "NFSA_Ration.pdf" }
    ];

    /**
     * Executes Document Verification via Express Backend (POST /api/documents/verify)
     */
    const runVerification = async (docId, file = null, overrideNumber = null) => {
        setUploadingDocId(docId);
        setScanAlert(null);

        const fileName = file ? file.name : (documentsState[docId]?.fileName || `${docId}.pdf`);
        const formattedSize = file ? formatFileSize(file.size) : (documentsState[docId]?.fileSize || "1.2 MB");

        // 1. Set the document status to "SCANNING"
        setDocumentsState(prev => ({
            ...prev,
            [docId]: {
                ...prev[docId],
                status: "SCANNING",
                fileName,
                fileSize: formattedSize,
                uploadedAt: prev[docId]?.uploadedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        }));

        // Check simulated visual edge cases
        const isScenarioBlurry = fileName.toLowerCase().includes("blur");
        const isScenarioMismatch = fileName.toLowerCase().includes("mismatch");

        if (isScenarioBlurry) {
            setTimeout(() => {
                setUploadingDocId(null);
                const failRes = {
                    status: "WARNING_BLURRY",
                    error: `Low OCR quality (42%) for "${fileName}". Glare detected.`,
                    advice: "Hold camera parallel on a dark flat surface with natural light, or upload a clear PDF."
                };
                setScanAlert(failRes);
                setDocumentsState(prev => ({
                    ...prev,
                    [docId]: { 
                        status: "WARNING_BLURRY",
                        fileName,
                        fileSize: formattedSize,
                        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                }));
            }, 600);
            return;
        }

        if (isScenarioMismatch) {
            setTimeout(() => {
                setUploadingDocId(null);
                const mismatchRes = {
                    status: "MISMATCH_NAME",
                    error: `Name discrepancy detected in "${fileName}".`,
                    advice: "Safety block active. Escalate to Jan-Sevak desk for manual attestation."
                };
                setScanAlert(mismatchRes);
                setDocumentsState(prev => ({
                    ...prev,
                    [docId]: { 
                        status: "MISMATCH_NAME",
                        fileName,
                        fileSize: formattedSize,
                        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                }));
            }, 600);
            return;
        }

        // Determine documentType and documentNumber
        let docType = mapToSupportedDocType(docId, selectedService?.id);
        let docNumber = overrideNumber !== null 
            ? overrideNumber 
            : (documentsState[docId]?.documentNumber || getSampleDocNumber(docType));

        if (fileName.toLowerCase().includes("invalid_num") || fileName.toLowerCase().includes("invalid_doc")) {
            docNumber = "INVALID-999-XYZ";
        } else if (fileName.toLowerCase().includes("missing_num")) {
            docNumber = "";
        } else if (fileName.toLowerCase().includes("unsupported")) {
            docType = "unsupported_doc_type";
        }

        try {
            // 2. Call api.verifyDocument()
            const response = await api.verifyDocument({
                documentType: docType,
                documentNumber: docNumber,
                name: "Anmol Kumar"
            });

            setUploadingDocId(null);

            if (!response || response.status === "SERVER_ERROR") {
                setDocumentsState(prev => ({
                    ...prev,
                    [docId]: {
                        ...prev[docId],
                        status: "FAILED"
                    }
                }));
                setScanAlert({
                    status: "FAILED",
                    error: "Unable to verify the document. Please try again."
                });
                alert("Unable to verify the document. Please try again.");
                return;
            }

            // 3. Handle response verification result
            const isApproved = response.verified === true || response.status === "VALID_APPEARING" || response.status === "VERIFIED";

            if (isApproved) {
                // Mark document as VALID_APPEARING / VERIFIED
                setDocumentsState(prev => ({
                    ...prev,
                    [docId]: {
                        ...prev[docId],
                        status: response.status || "VERIFIED",
                        fileName,
                        fileSize: formattedSize,
                        documentNumber: response.extractedData?.aadhaarNumberMasked || response.documentNumber || docNumber,
                        documentType: response.documentType || docType,
                        confidence: response.confidence,
                        checks: response.checks,
                        uploadedAt: prev[docId]?.uploadedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                }));

                // Show success UI and message
                setScanAlert({
                    status: "VALID",
                    message: response.message || "Document verified successfully."
                });
            } else {
                const failureStatus = response.status || "INVALID";
                // Mark document with resulting failure status (INVALID, SUSPICIOUS, NEEDS_REVIEW)
                setDocumentsState(prev => ({
                    ...prev,
                    [docId]: {
                        ...prev[docId],
                        status: failureStatus,
                        fileName,
                        fileSize: formattedSize,
                        documentNumber: docNumber,
                        documentType: docType,
                        confidence: response.confidence,
                        checks: response.checks,
                        issues: response.issues,
                        warnings: response.warnings,
                        error: response.message || "Document verification failed."
                    }
                }));

                setScanAlert({
                    status: failureStatus,
                    error: response.message || "Document verification failed. The document details could not be verified.",
                    advice: response.issues?.join(". ") || (response.warnings ? response.warnings.join(". ") : null)
                });

                // Alert user of verification status
                alert(response.message || "Document verification failed.");
            }
        } catch (error) {
            // Network or client-server communication error
            setUploadingDocId(null);
            setDocumentsState(prev => ({
                ...prev,
                [docId]: {
                    ...prev[docId],
                    status: "FAILED"
                }
            }));
            setScanAlert({
                status: "FAILED",
                error: "Unable to verify the document. Please try again."
            });
            alert("Unable to verify the document. Please try again.");
        }
    };

    // Handle real file upload / selection
    const handleFileUpload = (docId, file) => {
        if (!file) return;
        runVerification(docId, file);
    };

    // Remove an uploaded file
    const handleRemoveFile = (docId) => {
        setDocumentsState(prev => {
            const next = { ...prev };
            delete next[docId];
            return next;
        });
        if (fileInputRefs.current[docId]) {
            fileInputRefs.current[docId].value = "";
        }
    };

    // 1-Click Load Sample Files (Instant verification)
    const handleLoadSampleFiles = () => {
        const next = {};
        requiredDocs.forEach((d) => {
            const docType = mapToSupportedDocType(d.id, selectedService?.id);
            next[d.id] = {
                status: "VERIFIED",
                fileName: d.sampleName || `${d.name.replace(/\s+/g, "_")}.pdf`,
                fileSize: "1.2 MB",
                documentNumber: getSampleDocNumber(docType),
                documentType: docType,
                uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        });
        setDocumentsState(next);
        setScanAlert({
            status: "VALID",
            message: "Document verified successfully."
        });
    };

    // General Drag and Drop Zone handler
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const pendingDoc = requiredDocs.find(d => documentsState[d.id]?.status !== "VALID" && documentsState[d.id]?.status !== "VERIFIED") || requiredDocs[0];
            handleFileUpload(pendingDoc.id, file);
        }
    };

    const isAllValid = requiredDocs.every(
        (d) => ["VALID", "VERIFIED", "VALID_APPEARING"].includes(documentsState[d.id]?.status)
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <h3 className="text-sm font-bold text-slate-900">
                            Upload Required Documents
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Upload digital copies (PDF, JPG, PNG) for automated OCR extraction & validation
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLoadSampleFiles}
                        className="px-3.5 py-1.5 rounded-xl border border-orange-200 hover:border-orange-300 bg-orange-50/60 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        <span>Load Sample Files (1-Click)</span>
                    </button>
                </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-2xl border-2 border-dashed text-center transition cursor-pointer ${
                    dragActive 
                        ? "border-orange-500 bg-orange-50" 
                        : "border-orange-200 hover:border-orange-400 bg-orange-50/20 hover:bg-orange-50/50"
                }`}
                onClick={() => {
                    const firstPending = requiredDocs.find(d => !["VALID", "VERIFIED", "VALID_APPEARING"].includes(documentsState[d.id]?.status)) || requiredDocs[0];
                    if (fileInputRefs.current[firstPending.id]) {
                        fileInputRefs.current[firstPending.id].click();
                    }
                }}
            >
                <div className="w-11 h-11 rounded-full bg-white border border-orange-200 text-orange-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop files here
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                    Supports PDF, JPG, PNG up to 10MB per document
                </p>
            </div>

            {/* Checklist of Individual Required Documents */}
            <div className="space-y-2.5">
                {requiredDocs.map((doc) => {
                    const docState = documentsState[doc.id];
                    const status = docState?.status;
                    const isScanning = uploadingDocId === doc.id || status === "SCANNING";
                    const isValid = ["VALID", "VERIFIED", "VALID_APPEARING"].includes(status);
                    const isSuspicious = status === "SUSPICIOUS";
                    const isNeedsReview = status === "NEEDS_REVIEW" || status === "WARNING_BLURRY";
                    const isMismatch = status === "MISMATCH_NAME";
                    const isFailed = status === "INVALID" || status === "FAILED";

                    return (
                        <div
                            key={doc.id}
                            className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
                        >
                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                                ref={(el) => (fileInputRefs.current[doc.id] = el)}
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(doc.id, e.target.files[0]);
                                    }
                                }}
                            />

                            {/* Left: Document info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                                        {doc.mandatory && (
                                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">
                                                Required
                                            </span>
                                        )}
                                    </div>

                                    {docState?.fileName ? (
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                            <span className="text-slate-800 font-medium font-mono">{docState.fileName}</span>
                                            <span>•</span>
                                            <span>{docState.fileSize}</span>
                                            <span>•</span>
                                            <span className={
                                                isValid ? "text-emerald-600 font-semibold" 
                                                : isSuspicious ? "text-rose-600 font-semibold" 
                                                : isNeedsReview ? "text-amber-600 font-semibold" 
                                                : isFailed ? "text-rose-600 font-semibold" 
                                                : isMismatch ? "text-amber-600 font-semibold" 
                                                : "text-slate-600 font-medium"
                                            }>
                                                {isValid ? "Valid Appearing" : isSuspicious ? "Suspicious" : isNeedsReview ? "Needs Review" : isFailed ? "Verification Failed" : isMismatch ? "Discrepancy" : "Uploaded"}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[11px] text-slate-400">
                                            No file chosen yet
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                                {isScanning ? (
                                    <span className="text-orange-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 font-medium">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                                        <span>Scanning & Verifying...</span>
                                    </span>
                                ) : isValid ? (
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Verified</span>
                                        </span>
                                        <button
                                            onClick={() => fileInputRefs.current[doc.id]?.click()}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition"
                                            title="Replace file"
                                        >
                                            Replace
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFile(doc.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : isFailed ? (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1.5 shadow-2xs">
                                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                            <span>Invalid</span>
                                        </span>
                                        <button
                                            onClick={() => runVerification(doc.id)}
                                            className="px-3 py-1.5 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                                            <span>Verify</span>
                                        </button>
                                        <button
                                            onClick={() => fileInputRefs.current[doc.id]?.click()}
                                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>Upload File</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => fileInputRefs.current[doc.id]?.click()}
                                            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>Upload File</span>
                                        </button>

                                        <button
                                            onClick={() => runVerification(doc.id)}
                                            className="px-3 py-1.5 rounded-xl border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                                            title="Verify document"
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                                            <span>Verify</span>
                                        </button>

                                        {isMismatch && (
                                            <button
                                                onClick={() => onRaiseEscalation({
                                                    reason: `Name Discrepancy in ${doc.name}`,
                                                    agentDiagnosis: `Aadhaar name differs from ${doc.name}. Requires Jan-Sevak attestation.`
                                                })}
                                                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs hover:bg-rose-100 font-semibold transition"
                                            >
                                                Escalate
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edge-Case Simulators */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border-t border-slate-100 text-slate-500">
                <span>Simulate verification scenarios:</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleFileUpload(requiredDocs[0].id, new File(["mock"], "blurry_scan_photo.jpg", { type: "image/jpeg" }))}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 text-[11px] font-medium transition"
                    >
                        Simulate Blurry Cam
                    </button>
                    <button
                        onClick={() => handleFileUpload(requiredDocs[0].id, new File(["mock"], "name_mismatch_proof.pdf", { type: "application/pdf" }))}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 text-[11px] font-medium transition"
                    >
                        Simulate Name Mismatch
                    </button>
                    <button
                        onClick={() => runVerification(requiredDocs[0].id, new File(["mock"], "invalid_num_doc.pdf", { type: "application/pdf" }), "INVALID-NUMBER")}
                        className="px-3 py-1 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-[11px] font-medium transition"
                    >
                        Simulate Invalid Doc
                    </button>
                    <button
                        onClick={() => runVerification(requiredDocs[0].id, new File(["mock"], "missing_num_doc.pdf", { type: "application/pdf" }), "")}
                        className="px-3 py-1 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-800 text-[11px] font-medium transition"
                    >
                        Simulate Missing Doc No
                    </button>
                </div>
            </div>

            {/* Diagnostic Alert Box */}
            {scanAlert && (
                <div className={`p-4 rounded-xl text-xs space-y-1 ${
                    scanAlert.status === "VALID" 
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
                        : scanAlert.status === "INVALID" || scanAlert.status === "FAILED"
                        ? "bg-rose-50 border border-rose-200 text-rose-800"
                        : "bg-amber-50 border border-amber-200 text-amber-800"
                }`}>
                    <div className="flex items-center gap-2 font-bold">
                        {scanAlert.status === "VALID" ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                        ) : scanAlert.status === "INVALID" || scanAlert.status === "FAILED" ? (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{scanAlert.message || scanAlert.error}</span>
                    </div>
                    {scanAlert.advice && (
                        <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">{scanAlert.advice}</p>
                    )}
                </div>
            )}

            {/* Bottom Proceed */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500">
                    {isAllValid ? "All required documents uploaded & verified." : "Please upload all mandatory documents to proceed."}
                </span>

                <button
                    onClick={onProceedToForm}
                    disabled={!isAllValid}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
                >
                    <span>Proceed to Review Form</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default DocumentHub;