import React, { useState } from "react";
import { ArrowRight, Edit2, Lock } from "lucide-react";

function FormReview({
    selectedService,
    formData,
    setFormData,
    onProceedToConsent
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleFieldChange = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="bg-[#0c0c0e] rounded-xl border border-neutral-800 p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Application Form Preview
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Extracted from verified proofs for {selectedService?.shortName}
                    </p>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 text-xs flex items-center gap-1.5 transition"
                >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditing ? "Lock" : "Edit"}</span>
                </button>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(formData).map(([k, v]) => {
                    const label = k.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                    return (
                        <div key={k} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
                            <label className="text-[11px] text-neutral-400 block font-medium">
                                {label}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={v}
                                    onChange={(e) => handleFieldChange(k, e.target.value)}
                                    className="w-full bg-black border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                            ) : (
                                <div className="text-xs text-white font-medium flex items-center justify-between">
                                    <span>{v}</span>
                                    <Lock className="w-3 h-3 text-neutral-600" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Statutory Self-Declaration */}
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                I hereby affirm that the facts stated above are accurate and backed by verified records.
            </div>

            {/* Proceed */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={onProceedToConsent}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition"
                >
                    <span>Proceed to Explicit Consent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default FormReview;
