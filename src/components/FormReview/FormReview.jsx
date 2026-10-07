import React, { useState } from "react";
import { ArrowRight, Edit2, Lock, CheckCircle2 } from "lucide-react";

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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <h3 className="text-sm font-bold text-slate-900">
                            Auto-Filled Application Preview
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Data extracted directly from verified proofs for {selectedService?.shortName}
                    </p>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                    <Edit2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isEditing ? "Lock Fields" : "Edit Values"}</span>
                </button>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(formData).map(([k, v]) => {
                    const label = k.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                    return (
                        <div key={k} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1">
                            <label className="text-[11px] text-slate-500 block font-semibold">
                                {label}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={v}
                                    onChange={(e) => handleFieldChange(k, e.target.value)}
                                    className="w-full bg-white border border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none font-medium"
                                />
                            ) : (
                                <div className="text-xs text-slate-900 font-bold flex items-center justify-between">
                                    <span>{v}</span>
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Statutory Self-Declaration */}
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                    I hereby affirm that the facts stated above are accurate and backed by verified records. Submitting false statements attracts penalties under statutory rules.
                </p>
            </div>

            {/* Proceed */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={onProceedToConsent}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
                >
                    <span>Proceed to Explicit Consent</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default FormReview;