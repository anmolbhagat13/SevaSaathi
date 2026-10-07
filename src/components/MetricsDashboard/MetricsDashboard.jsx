import React from "react";

function MetricsDashboard({ middlemanSaved = 9400 }) {
    const funnel = [
        { label: "1. Service Selection & Eligibility", rate: "99.4%" },
        { label: "2. Document Validation & OCR", rate: "96.8%" },
        { label: "3. Explicit DPDP Consent Signoff", rate: "100.0%" },
        { label: "4. Government Gateway Submission", rate: "98.2%" },
        { label: "5. Officer Scrutiny & Certificate Issuance", rate: "95.8%" }
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-neutral-800">
                <h2 className="text-base font-semibold text-white">
                    Long-Horizon Performance & Success Rate
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                    Empirical benchmarks across multi-stage government processes
                </p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800">
                    <span className="text-[11px] text-neutral-500 block font-medium">Task Success Rate</span>
                    <span className="text-xl font-bold text-white mt-1 block">95.8%</span>
                    <span className="text-[10px] text-neutral-400">End-to-end completion</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800">
                    <span className="text-[11px] text-neutral-500 block font-medium">Middleman Fees Saved</span>
                    <span className="text-xl font-bold text-white mt-1 block">₹{middlemanSaved.toLocaleString()}</span>
                    <span className="text-[10px] text-neutral-400">Zero broker commissions</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800">
                    <span className="text-[11px] text-neutral-500 block font-medium">Average TAT</span>
                    <span className="text-xl font-bold text-white mt-1 block">3.2 Hours</span>
                    <span className="text-[10px] text-neutral-400">vs. 14 days offline</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0c0c0e] border border-neutral-800">
                    <span className="text-[11px] text-neutral-500 block font-medium">Consent Compliance</span>
                    <span className="text-xl font-bold text-white mt-1 block">100.0%</span>
                    <span className="text-[10px] text-neutral-400">DPDP Act audited</span>
                </div>
            </div>

            {/* Pipeline Funnel */}
            <div className="bg-[#0c0c0e] rounded-xl border border-neutral-800 p-5 space-y-4">
                <h3 className="text-xs font-semibold text-white">
                    Long-Horizon Workflow Progression
                </h3>

                <div className="space-y-3">
                    {funnel.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-300">{item.label}</span>
                                <span className="text-white font-mono font-medium">{item.rate}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: item.rate }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MetricsDashboard;
