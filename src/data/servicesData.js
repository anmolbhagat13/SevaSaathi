export const SERVICES_DATA = [
    {
        id: "income-cert",
        name: "Income Certificate (आय प्रमाण पत्र)",
        shortName: "Income Certificate",
        dept: "Department of Revenue & Land Records",
        category: "Certificates",
        icon: "FileText",
        tatDays: 3,
        govFee: 15,
        middlemanFeeAvoided: 1200,
        description: "Official certificate verifying family gross annual income for scholarships, fee waivers, and government welfare programs.",
        eligibility: "State resident family with total annual household income below specified scheme limits (e.g., ₹2,50,000 for EWS).",
        color: "from-blue-600 to-indigo-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card", mandatory: true, type: "Identity & Address", sampleName: "Aadhaar_AnmolKumar.pdf" },
            { id: "salary_slip", name: "Salary Slip / Patwari Land Report", mandatory: true, type: "Income Proof", sampleName: "Patwari_IncomeReport.pdf" },
            { id: "ration_card", name: "Ration Card / Family Register", mandatory: true, type: "Family Proof", sampleName: "RationCard_NFSA.pdf" },
            { id: "photo", name: "Passport Photo", mandatory: true, type: "Biometric", sampleName: "Applicant_Photo.jpg" }
        ],
        defaultFields: {
            applicantName: "Anmol Kumar",
            fatherName: "Rajesh Kumar",
            annualIncome: "₹85,000",
            occupation: "Agriculture & Small Retail",
            district: "Lucknow",
            tehsil: "Bakshi Ka Talab",
            aadhaarNumber: "XXXX-XXXX-6523",
            mobileNumber: "+91 98765 43210"
        }
    },
    {
        id: "caste-cert",
        name: "Caste / Community Certificate (जाति प्रमाण पत्र)",
        shortName: "Caste Certificate",
        dept: "Department of Social Welfare & Empowerment",
        category: "Certificates",
        icon: "ShieldCheck",
        tatDays: 7,
        govFee: 20,
        middlemanFeeAvoided: 1800,
        description: "Official validation of SC/ST/OBC category status for affirmative action quotas, scholarships, and civil services.",
        eligibility: "Permanent resident citizen belonging to notified backward castes with genealogy records.",
        color: "from-purple-600 to-violet-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card", mandatory: true, type: "Identity Proof", sampleName: "Aadhaar_Citizen.pdf" },
            { id: "ancestry_proof", name: "Ancestral 1950/1967 Land Record or Paternal Certificate", mandatory: true, type: "Genealogy Proof", sampleName: "Revenue_Record_1967.pdf" },
            { id: "photo", name: "Passport Photo", mandatory: true, type: "Biometric", sampleName: "Photo_Identity.jpg" }
        ],
        defaultFields: {
            applicantName: "Rameshwar Prasad",
            fatherName: "Harish Chandra Prasad",
            casteCategory: "OBC (Other Backward Class)",
            subCaste: "Kurmi / Patel",
            district: "Varanasi",
            village: "Shivpur",
            aadhaarNumber: "XXXX-XXXX-4819",
            mobileNumber: "+91 91234 56789"
        }
    },
    {
        id: "domicile-cert",
        name: "Residence / Domicile Certificate (निवास प्रमाण पत्र)",
        shortName: "Domicile Certificate",
        dept: "District Magistrate / e-District Revenue",
        category: "Certificates",
        icon: "Home",
        tatDays: 4,
        govFee: 15,
        middlemanFeeAvoided: 900,
        description: "Legal affirmation of continuous domicile residence for state public service exams, university admissions, and housing.",
        eligibility: "Continuous residence in state for minimum 10 years or born to native parents.",
        color: "from-emerald-600 to-teal-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card", mandatory: true, type: "Identity Proof", sampleName: "Aadhaar_Card.pdf" },
            { id: "electricity_bill", name: "Electricity / Water Utility Bill (3 Years)", mandatory: true, type: "Residence Proof", sampleName: "UPPCL_Bill_2025.pdf" },
            { id: "school_tc", name: "School Leaving Certificate / 10th Marksheet", mandatory: true, type: "School Record", sampleName: "HighSchool_Certificate.pdf" }
        ],
        defaultFields: {
            applicantName: "Pooja Verma",
            fatherName: "Satish Verma",
            yearsOfResidence: "18 Years",
            residentialAddress: "Flat 402, Ganga Heights, Alambagh",
            pincode: "226005",
            district: "Lucknow",
            aadhaarNumber: "XXXX-XXXX-8821",
            mobileNumber: "+91 94500 11223"
        }
    },
    {
        id: "pm-kisan",
        name: "PM-Kisan Samman Nidhi (पीएम किसान सम्मान निधि)",
        shortName: "PM-Kisan Subsidy",
        dept: "Ministry of Agriculture & Farmers Welfare",
        category: "Subsidies",
        icon: "Wheat",
        tatDays: 5,
        govFee: 0,
        middlemanFeeAvoided: 2000,
        description: "Direct Bank Transfer (DBT) income support of ₹6,000 annually in 3 installments directly to farmer bank accounts.",
        eligibility: "Landholding farmer family having cultivable agricultural land up to 2 hectares in government revenue database.",
        color: "from-amber-600 to-orange-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card (Mobile Linked)", mandatory: true, type: "Identity Proof", sampleName: "Aadhaar_Farmer.pdf" },
            { id: "land_khatoni", name: "Land Record (Khasra / Khatauni RoR)", mandatory: true, type: "Land Ownership", sampleName: "Bhulekh_Khatoni_Extract.pdf" },
            { id: "bank_passbook", name: "Bank Passbook with Active DBT", mandatory: true, type: "Financial Proof", sampleName: "SBI_Passbook_DBT.pdf" }
        ],
        defaultFields: {
            farmerName: "Mukesh Kumar",
            fatherName: "Ramswaroop Yadav",
            khasraNumber: "142/Ka, Khatauni #891",
            landAreaAcres: "2.4 Acres",
            bankAccountNumber: "00003891029102",
            ifscCode: "SBIN0001248",
            aadhaarNumber: "XXXX-XXXX-7391",
            district: "Barabanki"
        }
    },
    {
        id: "solar-rooftop",
        name: "PM Surya Ghar: Solar Rooftop Subsidy (पीएम सूर्य घर)",
        shortName: "Solar Subsidy",
        dept: "Ministry of New & Renewable Energy (MNRE)",
        category: "Subsidies",
        icon: "Sun",
        tatDays: 10,
        govFee: 0,
        middlemanFeeAvoided: 3500,
        description: "Up to ₹78,000 direct central subsidy for installing 1-3 kW rooftop solar plants for free household electricity.",
        eligibility: "Domestic residential grid-connected electricity consumer with adequate shadow-free roof.",
        color: "from-yellow-600 to-amber-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card", mandatory: true, type: "Identity Proof", sampleName: "Aadhaar_Rooftop.pdf" },
            { id: "electricity_bill", name: "Latest Electricity Bill with Consumer CA No.", mandatory: true, type: "Power Connection", sampleName: "Discom_Bill_Latest.pdf" },
            { id: "roof_photo", name: "Photograph of Shadow-Free Rooftop", mandatory: true, type: "Site Survey", sampleName: "Roof_Survey_GeoTagged.jpg" }
        ],
        defaultFields: {
            consumerName: "Anmol Kumar",
            electricityConsumerNo: "CA-889102934",
            discomName: "Madhyanchal Vidyut Vitaran Nigam Ltd",
            proposedCapacityKw: "2.5 kW",
            installationAddress: "House 24, Vikas Nagar, Sector 4",
            sanctionedLoadKw: "3.0 kW",
            aadhaarNumber: "XXXX-XXXX-6523"
        }
    },
    {
        id: "driving-licence",
        name: "Learner's Driving Licence (लर्नर लाइसेंस - सारथी)",
        shortName: "Learner's Licence",
        dept: "Ministry of Road Transport & Highways (MoRTH)",
        category: "Licences",
        icon: "Car",
        tatDays: 2,
        govFee: 200,
        middlemanFeeAvoided: 1500,
        description: "Provisional driving licence valid for 6 months, issued contactless online with remote Aadhaar-proctored test.",
        eligibility: "Citizen aged 18+ for light motor vehicle (LMV), or 16+ for gearless two-wheeler.",
        color: "from-cyan-600 to-blue-600",
        requiredDocs: [
            { id: "aadhaar", name: "Aadhaar Card (e-KYC Verified)", mandatory: true, type: "e-KYC Proof", sampleName: "Aadhaar_eKYC_XML.xml" },
            { id: "medical_form1", name: "Self Declaration Form 1 (Physical Fitness)", mandatory: true, type: "Fitness Certificate", sampleName: "Form1_SelfDeclaration.pdf" },
            { id: "blood_group", name: "Blood Group Report", mandatory: true, type: "Medical Info", sampleName: "BloodGroup_LabReport.pdf" }
        ],
        defaultFields: {
            applicantName: "Anmol Kumar",
            dob: "2001-08-14",
            vehicleClass: "MCWG (Motor Cycle with Gear) & LMV (Car)",
            bloodGroup: "O Positive (O+)",
            emergencyContact: "+91 98765 00000",
            rtoLocation: "UP-32 (Lucknow Transport Office)",
            aadhaarNumber: "XXXX-XXXX-6523"
        }
    }
];
