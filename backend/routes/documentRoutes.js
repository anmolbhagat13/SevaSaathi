// DEMO VERIFICATION ONLY.
// Replace with official DigiLocker/API Setu/government verification
// after obtaining authorized API credentials.

const express = require("express");
const router = express.Router();
const { verifyDocument } = require("../services/documentVerification");

/**
 * POST /api/documents/verify
 * Accepts document payload and runs SevaSaathi Document Verification Engine.
 * Security: Does not console.log or persist sensitive document numbers.
 */
router.post("/verify", async (req, res) => {
    try {
        const result = await verifyDocument(req.body);

        if (result.status === "INVALID_REQUEST" || !req.body.documentType) {
            return res.status(400).json(result);
        }

        return res.status(result.verified ? 200 : 422).json(result);
    } catch (error) {
        // Do not expose stack traces or backend errors
        return res.status(500).json({
            verified: false,
            status: "SERVER_ERROR",
            documentType: req.body?.documentType || "unknown",
            message: "Unable to verify the document."
        });
    }
});

module.exports = router;
