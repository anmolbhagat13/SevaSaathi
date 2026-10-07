const API_BASE = "http://localhost:5000";

// Robust fetch helper with fallback handling
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${url}`, {
            headers: { "Content-Type": "application/json" },
            ...options
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`API call to ${url} failed or server offline:`, err.message);
        return null;
    }
}

export const api = {
    // 1. Services
    getServices: async () => {
        const data = await safeFetch("/api/services");
        return data ? data.services : null;
    },

    // 2. Validate Document
    validateDocument: async (payload) => {
        const data = await safeFetch("/api/validate-document", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return data;
    },

    // 3. Consent
    recordConsent: async (payload) => {
        const data = await safeFetch("/api/consent", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return data;
    },

    // 4. Submit to Mock Gov Portal
    submitApplication: async (payload) => {
        const data = await safeFetch("/api/submit-application", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return data;
    },

    // 5. Applications
    getApplications: async () => {
        const data = await safeFetch("/api/applications");
        return data ? data.applications : null;
    },

    getApplicationById: async (id) => {
        const data = await safeFetch(`/api/applications/${id}`);
        return data ? data.application : null;
    },

    // 6. Officer Action on Mock Portal
    officerAction: async (id, actionPayload) => {
        const data = await safeFetch(`/api/applications/${id}/officer-action`, {
            method: "POST",
            body: JSON.stringify(actionPayload)
        });
        return data;
    },

    // 7. Audit Logs
    getAuditLogs: async () => {
        const data = await safeFetch("/api/audit-logs");
        return data ? data.logs : null;
    },

    // 8. Escalations
    getEscalations: async () => {
        const data = await safeFetch("/api/escalations");
        return data ? data.escalations : null;
    },

    raiseEscalation: async (payload) => {
        const data = await safeFetch("/api/escalations", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return data;
    },

    resolveEscalation: async (id, payload) => {
        const data = await safeFetch(`/api/escalations/${id}/resolve`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return data;
    },

    // 9. Agent Chat
    chatWithAgent: async (message, language, history, currentServiceId) => {
        const data = await safeFetch("/api/agent/chat", {
            method: "POST",
            body: JSON.stringify({ message, language, history, currentServiceId })
        });
        return data;
    },

    // 10. Metrics
    getMetrics: async () => {
        const data = await safeFetch("/api/metrics");
        return data ? data.metrics : null;
    }
};