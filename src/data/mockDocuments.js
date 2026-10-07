export const MOCK_TEST_PERSONAS = [
    {
        id: "persona-1",
        name: "Anmol Kumar",
        label: "Standard Valid Case (Full Pass)",
        desc: "All documents clean, high resolution, matching names.",
        serviceId: "income-cert",
        fatherName: "Rajesh Kumar",
        annualIncome: "₹85,000",
        district: "Lucknow",
        aadhaar: "XXXX-XXXX-6523",
        expectedOutcome: "End-to-End Success & Auto-Submission"
    },
    {
        id: "persona-2",
        name: "Rameshwar Prasad",
        label: "Discrepancy Case (Triggers Failure Recovery & Escalation)",
        desc: "Aadhaar says Rameshwar P. Singh vs 1967 revenue paper.",
        serviceId: "caste-cert",
        fatherName: "Harish Chandra Prasad",
        annualIncome: "₹1,10,000",
        district: "Varanasi",
        aadhaar: "XXXX-XXXX-4819",
        expectedOutcome: "Safety Block -> Escalates to Jan-Sevak Helpdesk"
    },
    {
        id: "persona-3",
        name: "Mukesh Kumar",
        label: "Farmer Case (PM-Kisan Subsidy)",
        desc: "Khasra land records + active DBT bank passbook.",
        serviceId: "pm-kisan",
        fatherName: "Ramswaroop Yadav",
        annualIncome: "₹95,000",
        district: "Barabanki",
        aadhaar: "XXXX-XXXX-7391",
        expectedOutcome: "DBT Verification -> Direct Subsidy Submission"
    }
];

export const SAMPLE_DOCUMENTS = [
    {
        id: "doc-aadhaar-clean",
        type: "aadhaar",
        title: "Aadhaar Card (Clean High-Res)",
        scenario: "VALID",
        ocrScore: 99.4,
        status: "VALID",
        fileSize: "1.4 MB",
        extractedFields: {
            name: "Anmol Kumar",
            dob: "14/08/2001",
            uid: "XXXX-XXXX-6523",
            address: "House 24, Vikas Nagar, Sector 4, Lucknow, UP"
        }
    },
    {
        id: "doc-salary-slip",
        type: "salary_slip",
        title: "Patwari Revenue Certificate (Income Proof)",
        scenario: "VALID",
        ocrScore: 98.1,
        status: "VALID",
        fileSize: "840 KB",
        extractedFields: {
            certNo: "PATWARI/REV/2026/812",
            declaredIncome: "₹85,000 Per Annum",
            tehsil: "Bakshi Ka Talab",
            landHolding: "0.4 Hectares"
        }
    },
    {
        id: "doc-blurry-cam",
        type: "ration_card",
        title: "Ration Card (Glared / Low Quality)",
        scenario: "BLURRY_IMAGE",
        ocrScore: 42.0,
        status: "WARNING_BLURRY",
        fileSize: "410 KB",
        errorDetails: "OCR confidence 42% below threshold (75%). Excessive glare over head-of-household text.",
        recoverySteps: "Place card on flat dark table without camera flash. Ensure barcode and names are sharp."
    },
    {
        id: "doc-mismatch-name",
        type: "ancestry_proof",
        title: "1967 Land Khatauni (Spelling Discrepancy)",
        scenario: "NAME_MISMATCH",
        ocrScore: 89.0,
        status: "MISMATCH_NAME",
        fileSize: "2.1 MB",
        errorDetails: "Cross-check warning: Record lists 'Rameshwar P. Singh' while Aadhaar records 'Rameshwar Prasad'.",
        recoverySteps: "Provide Form IV Name Identity Clarification affidavit or escalate to Jan-Sevak Human Officer."
    }
];
