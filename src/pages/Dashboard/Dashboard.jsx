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
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">

            {/* Navbar */}
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
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {activeTab === "agent" && (
                    <div className="space-y-5">

                        {/* Page Heading */}
                        <div className="border-b border-slate-200 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-blue-800 mb-1">
                                        Citizen Services
                                    </p>

                                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        SevaSaathi Service Assistant
                                    </h1>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Apply for government services and track your applications.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="w-2 h-2 rounded-full bg-green-600" />
                                    Services Available
                                </div>

                            </div>
                        </div>


                        {/* Service Selector */}
                        <section>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-semibold text-slate-800">
                                    Select a Service
                                </h2>

                                <span className="text-xs text-slate-500">
                                    Available services
                                </span>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">

                                {SERVICES_DATA.map((srv) => {
                                    const isSelected = selectedService.id === srv.id;

                                    return (
                                        <button
                                            key={srv.id}
                                            onClick={() => handleSelectService(srv)}
                                            className={`px-4 py-2 rounded-md border text-sm font-medium whitespace-nowrap transition ${isSelected
                                                    ? "bg-blue-900 border-blue-900 text-white shadow-sm"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-900 hover:bg-blue-50"
                                                }`}
                                        >
                                            {srv.shortName}
                                        </button>
                                    );
                                })}

                            </div>
                        </section>


                        {/* Main Workspace */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                            {/* Citizen Assistant */}
                            <div className="lg:col-span-5">

                                <div className="mb-2 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Citizen Assistance
                                    </h2>

                                    <span className="text-xs text-slate-500">
                                        Step 1
                                    </span>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
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

                            </div>


                            {/* Workspace */}
                            <div className="lg:col-span-7">

                                <div className="mb-2 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Application Workspace
                                    </h2>

                                    <span className="text-xs text-slate-500">
                                        Step {agentSubView === "docs" ? "1" : agentSubView === "autofill" ? "2" : "3"} of 3
                                    </span>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">

                                    {/* Sub Navigation */}
                                    <div className="flex items-center overflow-x-auto border-b border-slate-200 bg-slate-50">

                                        <button
                                            onClick={() => setAgentSubView("docs")}
                                            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${agentSubView === "docs"
                                                    ? "border-blue-800 text-blue-900 font-semibold bg-white"
                                                    : "border-transparent text-slate-500 hover:text-blue-900 hover:bg-white"
                                                }`}
                                        >
                                            <span className="mr-2">1.</span>
                                            Documents
                                        </button>

                                        <button
                                            onClick={() => setAgentSubView("autofill")}
                                            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${agentSubView === "autofill"
                                                    ? "border-blue-800 text-blue-900 font-semibold bg-white"
                                                    : "border-transparent text-slate-500 hover:text-blue-900 hover:bg-white"
                                                }`}
                                        >
                                            <span className="mr-2">2.</span>
                                            Form Review
                                        </button>

                                        <button
                                            onClick={() => setAgentSubView("tracking")}
                                            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${agentSubView === "tracking"
                                                    ? "border-blue-800 text-blue-900 font-semibold bg-white"
                                                    : "border-transparent text-slate-500 hover:text-blue-900 hover:bg-white"
                                                }`}
                                        >
                                            <span className="mr-2">3.</span>
                                            Status & Tracking
                                        </button>

                                    </div>


                                    {/* Active Subview */}
                                    <div className="p-4 sm:p-5">

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
                                            <div className="space-y-4">

                                                {/* Tracking Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">

                                                    <div>
                                                        <h3 className="text-base font-semibold text-slate-900">
                                                            Application Status
                                                        </h3>

                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Track the status of your submitted government applications.
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => setActiveTab("portal")}
                                                        className="text-sm font-medium text-blue-800 hover:text-blue-950"
                                                    >
                                                        View Government Portal →
                                                    </button>

                                                </div>


                                                {/* Applications */}
                                                <div className="space-y-3">

                                                    {applications.map((app) => (
                                                        <div
                                                            key={app.id}
                                                            className="border border-slate-200 rounded-md p-4 bg-white hover:border-blue-200 transition"
                                                        >

                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                                                <div>

                                                                    <div className="flex flex-wrap items-center gap-2">

                                                                        <span className="font-mono text-sm font-semibold text-slate-900">
                                                                            {app.id}
                                                                        </span>

                                                                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                                            {app.status}
                                                                        </span>

                                                                    </div>

                                                                    <p className="text-sm text-slate-600 mt-1">
                                                                        {app.serviceName}
                                                                    </p>

                                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                                        Applicant: {app.applicantName}
                                                                    </p>

                                                                </div>


                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedAppId(app.id);
                                                                        setActiveTab("portal");
                                                                    }}
                                                                    className="px-4 py-2 rounded-md border border-blue-800 text-blue-900 hover:bg-blue-900 hover:text-white text-sm font-medium transition"
                                                                >
                                                                    View Details
                                                                </button>

                                                            </div>

                                                        </div>
                                                    ))}

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                )}


                {/* Government Portal */}
                {activeTab === "portal" && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <GovernmentPortal
                            applications={applications}
                            setApplications={setApplications}
                            selectedAppId={selectedAppId}
                            setSelectedAppId={setSelectedAppId}
                        />
                    </div>
                )}


                {/* Audit Log */}
                {activeTab === "audit" && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <AuditLog auditLogs={auditLogs} />
                    </div>
                )}


                {/* Escalation */}
                {activeTab === "escalation" && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <EscalationDesk
                            escalations={escalations}
                            setEscalations={setEscalations}
                            onSimulateStuckAgent={() =>
                                handleRaiseEscalation({
                                    reason: "Water-damaged 1952 Record & Disputed Boundary",
                                    agentDiagnosis:
                                        "Automated OCR rejected scan twice. Escalated to Jan-Sevak desk."
                                })
                            }
                        />
                    </div>
                )}


                {/* Metrics */}
                {activeTab === "metrics" && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <MetricsDashboard
                            middlemanSaved={totalMiddlemanSaved}
                        />
                    </div>
                )}


                {/* Design Note */}
                {activeTab === "designNote" && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <DesignNote />
                    </div>
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
