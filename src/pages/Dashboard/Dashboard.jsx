import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AgentChat from "../../components/AgentChat/AgentChat";
import DocumentHub from "../../components/DocumentHub/DocumentHub";
import FormReview from "../../components/FormReview/FormReview";
import ConsentModal from "../../components/ConsentModal/ConsentModal";
import GovernmentPortal from "../../components/GovernmentPortal/GovernmentPortal";
import AuditLog from "../../components/AuditLog/AuditLog";
import EscalationDesk from "../../components/EscalationDesk/EscalationDesk";
import MetricsDashboard from "../../components/MetricsDashboard/MetricsDashboard";
import DesignNote from "../../components/DesignNote/DesignNote";

import { SERVICES_DATA } from "../../data/servicesData";
import { TRANSLATIONS } from "../../data/translations";
import { api } from "../../services/api";

function Dashboard() {
    const [activeTab, setActiveTab] = useState("agent");
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const [isVoiceMuted, setIsVoiceMuted] = useState(false);

    const [selectedService, setSelectedService] = useState(SERVICES_DATA[0]);
    const [agentSubView, setAgentSubView] = useState("docs"); // docs, autofill, tracking

    const [documentsState, setDocumentsState] = useState({});
    const [formData, setFormData] = useState(SERVICES_DATA[0].defaultFields);
    const [isConsentOpen, setIsConsentOpen] = useState(false);

    const [applications, setApplications] = useState([
        {
            id: "APP-REV-2026-8812",
            serviceId: "income-cert",
            serviceName: "Income Certificate",
            applicantName: "Sunita Devi",
            annualIncome: "₹72,000",
            district: "Varanasi",
            aadhaarNumber: "XXXX-XXXX-4812",
            status: "APPROVED",
            currentStage: "Certificate Issued & Digitally Signed",
            submittedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            certificateNo: "CERT-UP-INC-2026-98104",
            qrDigest: "SHA256:4f89b1c93a9081e7d82b4a11f9",
            consentReceiptId: "CONSENT-99120",
            timeline: [
                { stage: "Draft Created by SevaSaathi Agent", status: "COMPLETED" },
                { stage: "Citizen Explicit Consent Recorded", status: "COMPLETED" },
                { stage: "Submitted to Mock JanSeva State Gateway", status: "COMPLETED" },
                { stage: "Officer Scrutiny & Field Report", status: "COMPLETED" },
                { stage: "Digital Signature & Dispatch", status: "COMPLETED" }
            ]
        }
    ]);
    const [selectedAppId, setSelectedAppId] = useState("APP-REV-2026-8812");

    const [auditLogs, setAuditLogs] = useState([
        {
            id: "AUDIT-1001",
            timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            actionCode: "INTENT_IDENTIFIED",
            actor: "SevaSaathi Agent",
            description: "Citizen selected Income Certificate workflow.",
            consentRequired: false,
            consentGiven: null,
            hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        },
        {
            id: "AUDIT-1002",
            timestamp: new Date(Date.now() - 35.8 * 3600 * 1000).toISOString(),
            actionCode: "SENSITIVE_CONSENT_GRANTED",
            actor: "Citizen (Sunita Devi)",
            description: "Explicit DPDP consent granted to transmit Aadhaar and income to Revenue Department.",
            consentRequired: true,
            consentGiven: true,
            hash: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
        }
    ]);

    const [escalations, setEscalations] = useState([
        {
            id: "ESC-2026-042",
            applicationId: "DRAFT-7721",
            citizenName: "Rameshwar Prasad",
            serviceName: "Caste Certificate",
            reason: "Name Spelling Discrepancy",
            agentDiagnosis: "Aadhaar says 'Rameshwar P. Singh' while ancestral paper says 'Rameshwar Prasad'.",
            status: "RESOLVED",
            resolutionNote: "Verified father's voter roll linkage. Alias waiver attached."
        }
    ]);

    const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

    useEffect(() => {
        const loadInit = async () => {
            const apps = await api.getApplications();
            if (apps && apps.length > 0) setApplications(apps);
            const logs = await api.getAuditLogs();
            if (logs && logs.length > 0) setAuditLogs(logs);
            const escs = await api.getEscalations();
            if (escs && escs.length > 0) setEscalations(escs);
        };
        loadInit();
    }, []);

    const handleSelectService = (srv) => {
        setSelectedService(srv);
        setFormData(srv.defaultFields);
        setDocumentsState({});
        setAgentSubView("docs");
    };

    const handleConsentGranted = async (consentData) => {
        setIsConsentOpen(false);

        const res = await api.submitApplication({
            serviceId: selectedService.id,
            serviceName: selectedService.shortName,
            applicantName: formData.applicantName,
            fatherName: formData.fatherName,
            annualIncome: formData.annualIncome,
            district: formData.district,
            aadhaarNumber: formData.aadhaarNumber,
            consentReceiptId: consentData.consentId,
            extraData: formData
        });

        const newApp = res?.application || {
            id: `APP-${selectedService.id.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            serviceId: selectedService.id,
            serviceName: selectedService.shortName,
            applicantName: formData.applicantName,
            fatherName: formData.fatherName,
            annualIncome: formData.annualIncome,
            district: formData.district,
            aadhaarNumber: formData.aadhaarNumber,
            status: "SUBMITTED",
            currentStage: "Submitted to Mock JanSeva State Gateway",
            submittedAt: new Date().toISOString(),
            consentReceiptId: consentData.consentId,
            timeline: [
                { stage: "Draft Created", status: "COMPLETED" },
                { stage: "Citizen Consent Signed", status: "COMPLETED" },
                { stage: "Submitted to Gateway", status: "COMPLETED" },
                { stage: "Officer Scrutiny", status: "IN_PROGRESS" }
            ]
        };

        setApplications(prev => [newApp, ...prev]);
        setSelectedAppId(newApp.id);
        setAgentSubView("tracking");

        setAuditLogs(prev => [
            {
                id: `AUDIT-${Date.now().toString().slice(-4)}`,
                timestamp: new Date().toISOString(),
                actionCode: "PORTAL_FORM_SUBMITTED",
                actor: "SevaSaathi Agent",
                description: `Submitted application ${newApp.id} for ${formData.applicantName}. Consent ID: ${consentData.consentId}`,
                consentRequired: true,
                consentGiven: true,
                hash: consentData.hashSignature || "SHA256:4e07408562bedb8b60ce05c1decfe3ad"
            },
            ...prev
        ]);
    };

    const handleConsentDeclined = () => {
        setIsConsentOpen(false);
        setAuditLogs(prev => [
            {
                id: `AUDIT-${Date.now().toString().slice(-4)}`,
                timestamp: new Date().toISOString(),
                actionCode: "CONSENT_REVOKED",
                actor: `Citizen (${formData.applicantName})`,
                description: "Consent declined. Transmission safely cancelled.",
                consentRequired: true,
                consentGiven: false,
                hash: "SHA256:0000000000000000000000000000000"
            },
            ...prev
        ]);
    };

    const handleRaiseEscalation = async ({ reason, agentDiagnosis }) => {
        const res = await api.raiseEscalation({
            citizenName: formData.applicantName,
            serviceName: selectedService.shortName,
            reason,
            agentDiagnosis
        });

        const newEsc = res?.escalation || {
            id: `ESC-2026-${Math.floor(100 + Math.random() * 900)}`,
            citizenName: formData.applicantName,
            serviceName: selectedService.shortName,
            reason,
            agentDiagnosis,
            status: "OPEN"
        };

        setEscalations(prev => [newEsc, ...prev]);
        setActiveTab("escalation");
    };

    const totalMiddlemanSaved = applications.reduce((sum, a) => {
        const s = SERVICES_DATA.find(srv => srv.id === a.serviceId);
        return sum + (s ? s.middlemanFeeAvoided : 1500);
    }, 0);

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-200 flex flex-col">
            {/* Minimal Header */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentLanguage={currentLanguage}
                setLanguage={setCurrentLanguage}
                isVoiceMuted={isVoiceMuted}
                setIsVoiceMuted={setIsVoiceMuted}
                t={t}
            />

            {/* Main */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
                {activeTab === "agent" && (
                    <div className="space-y-4">
                        {/* Minimal Service Selector */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {SERVICES_DATA.map((srv) => {
                                const isSelected = selectedService.id === srv.id;
                                return (
                                    <button
                                        key={srv.id}
                                        onClick={() => handleSelectService(srv)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                            isSelected
                                                ? "bg-white text-black"
                                                : "bg-[#0c0c0e] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                                        }`}
                                    >
                                        {srv.shortName}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Split Screen Chat & Workspace */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Left: Chat (5 cols) */}
                            <div className="lg:col-span-5">
                                <AgentChat
                                    t={t}
                                    currentLanguage={currentLanguage}
                                    isVoiceMuted={isVoiceMuted}
                                    selectedService={selectedService}
                                    onOpenDocs={() => setAgentSubView("docs")}
                                    onOpenConsent={() => setIsConsentOpen(true)}
                                    onOpenFormReview={() => setAgentSubView("autofill")}
                                    onOpenEscalation={() => setActiveTab("escalation")}
                                />
                            </div>

                            {/* Right: Workspace (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col space-y-3">
                                {/* Sub-navigation */}
                                <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2 text-xs">
                                    <button
                                        onClick={() => setAgentSubView("docs")}
                                        className={`px-3 py-1 rounded-md transition ${
                                            agentSubView === "docs" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        1. Documents
                                    </button>
                                    <button
                                        onClick={() => setAgentSubView("autofill")}
                                        className={`px-3 py-1 rounded-md transition ${
                                            agentSubView === "autofill" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        2. Form Review
                                    </button>
                                    <button
                                        onClick={() => setAgentSubView("tracking")}
                                        className={`px-3 py-1 rounded-md transition ${
                                            agentSubView === "tracking" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        3. Status & Tracking
                                    </button>
                                </div>

                                {/* Active Subview */}
                                <div>
                                    {agentSubView === "docs" && (
                                        <DocumentHub
                                            selectedService={selectedService}
                                            documentsState={documentsState}
                                            setDocumentsState={setDocumentsState}
                                            onProceedToForm={() => setAgentSubView("autofill")}
                                            onRaiseEscalation={handleRaiseEscalation}
                                        />
                                    )}

                                    {agentSubView === "autofill" && (
                                        <FormReview
                                            selectedService={selectedService}
                                            formData={formData}
                                            setFormData={setFormData}
                                            onProceedToConsent={() => setIsConsentOpen(true)}
                                        />
                                    )}

                                    {agentSubView === "tracking" && (
                                        <div className="bg-[#0c0c0e] rounded-xl border border-neutral-800 p-5 space-y-3">
                                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                                                <h3 className="text-sm font-semibold text-white">Application Status</h3>
                                                <button
                                                    onClick={() => setActiveTab("portal")}
                                                    className="text-xs text-neutral-400 hover:text-white"
                                                >
                                                    View in Gov Portal →
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {applications.map((app) => (
                                                    <div
                                                        key={app.id}
                                                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs"
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-white font-medium">{app.id}</span>
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                                                                    {app.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-neutral-400 mt-0.5">{app.serviceName} ({app.applicantName})</p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAppId(app.id);
                                                                setActiveTab("portal");
                                                            }}
                                                            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs transition"
                                                        >
                                                            Inspect
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "portal" && (
                    <GovernmentPortal
                        applications={applications}
                        setApplications={setApplications}
                        selectedAppId={selectedAppId}
                        setSelectedAppId={setSelectedAppId}
                    />
                )}

                {activeTab === "audit" && (
                    <AuditLog auditLogs={auditLogs} />
                )}

                {activeTab === "escalation" && (
                    <EscalationDesk
                        escalations={escalations}
                        setEscalations={setEscalations}
                        onSimulateStuckAgent={() => handleRaiseEscalation({
                            reason: "Water-damaged 1952 Record & Disputed Boundary",
                            agentDiagnosis: "Automated OCR rejected scan twice. Escalated to Jan-Sevak desk."
                        })}
                    />
                )}

                {activeTab === "metrics" && (
                    <MetricsDashboard middlemanSaved={totalMiddlemanSaved} />
                )}

                {activeTab === "designNote" && (
                    <DesignNote />
                )}
            </main>

            {/* Consent Modal */}
            <ConsentModal
                isOpen={isConsentOpen}
                onClose={() => setIsConsentOpen(false)}
                selectedService={selectedService}
                formData={formData}
                onConsentGranted={handleConsentGranted}
                onConsentDeclined={handleConsentDeclined}
            />
        </div>
    );
}

export default Dashboard;
