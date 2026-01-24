import { AppDataSource } from "../data-source";
import { Specialist, VerificationStatus } from "../entities/Specialist.entity";
import logger from "../utils/logger";

/**
 * Seed specialists
 */
export async function seedSpecialists() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const specialistRepository = AppDataSource.getRepository(Specialist);

        // Check if data already exists
        const count = await specialistRepository.count();
        if (count > 0) {
            logger.info("Specialists already seeded, skipping...");
            return;
        }

        const specialists = [
            {
                title: "Complete Company Formation Package",
                slug: "complete-company-formation-package",
                description:
                    "Get your company registered and incorporated with all necessary documentation. Includes name approval, MOA/AOA preparation, registration certificate, PAN, TAN, and GST registration. Perfect for new entrepreneurs looking for a hassle-free company setup.",
                basePrice: 15000,
                platformFee: 1500,
                finalPrice: 16500,
                averageRating: 4.8,
                totalNumberOfRatings: 124,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 15,
            },
            {
                title: "Annual Tax Filing & Compliance",
                slug: "annual-tax-filing-compliance",
                description:
                    "Comprehensive annual tax filing service for individuals and businesses. Includes income tax return preparation, audit support, TDS filing, and full compliance management. Expert guidance on tax optimization and deductions.",
                basePrice: 8000,
                platformFee: 800,
                finalPrice: 8800,
                averageRating: 4.9,
                totalNumberOfRatings: 267,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 7,
            },
            {
                title: "Business Legal Consultation",
                slug: "business-legal-consultation",
                description:
                    "Professional legal advisory for your business operations. Contract drafting and review, partnership agreements, employment law guidance, and regulatory compliance. Get expert legal support to protect your business interests.",
                basePrice: 5000,
                platformFee: 500,
                finalPrice: 5500,
                averageRating: 4.7,
                totalNumberOfRatings: 89,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 5,
            },
            {
                title: "Trademark Registration & Protection",
                slug: "trademark-registration-protection",
                description:
                    "Secure your brand identity with comprehensive trademark registration. Includes trademark search, application filing, objection handling, and registration certificate. Full support until registration is complete.",
                basePrice: 12000,
                platformFee: 1020,
                finalPrice: 13020,
                averageRating: 4.6,
                totalNumberOfRatings: 156,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 90,
            },
            {
                title: "Monthly Bookkeeping & Accounting",
                slug: "monthly-bookkeeping-accounting",
                description:
                    "Complete monthly accounting and bookkeeping services for small to medium businesses. Bank reconciliation, expense tracking, financial statements, and GST compliance. Stay on top of your finances with professional support.",
                basePrice: 6000,
                platformFee: 510,
                finalPrice: 6510,
                averageRating: 4.9,
                totalNumberOfRatings: 342,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 30,
            },
            {
                title: "GST Registration & Setup",
                slug: "gst-registration-setup",
                description:
                    "Quick and easy GST registration for your business. Includes documentation, application filing, and registration certificate. Get your GSTIN in just a few days and start operating legally.",
                basePrice: 3000,
                platformFee: 255,
                finalPrice: 3255,
                averageRating: 4.8,
                totalNumberOfRatings: 478,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 5,
            },
            {
                title: "Business License Acquisition",
                slug: "business-license-acquisition",
                description:
                    "Obtain all necessary business licenses and permits for your operations. Trade license, health license, professional tax registration, and more. We handle all paperwork and follow-ups.",
                basePrice: 4500,
                platformFee: 382.5,
                finalPrice: 4882.5,
                averageRating: 4.5,
                totalNumberOfRatings: 203,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 14,
            },
            {
                title: "Full Compliance Management Suite",
                slug: "full-compliance-management-suite",
                description:
                    "Complete compliance management for your business. Monthly GST filing, TDS compliance, ROC filings, labor law compliance, and regulatory updates. Never miss a deadline with our comprehensive service.",
                basePrice: 20000,
                platformFee: 1700,
                finalPrice: 21700,
                averageRating: 5.0,
                totalNumberOfRatings: 95,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 365,
            },
            {
                title: "Startup Legal Package",
                slug: "startup-legal-package",
                description:
                    "Everything a startup needs from a legal perspective. Company incorporation, founder agreements, employee contracts, IP protection, and investor documentation. Complete legal foundation for your startup journey.",
                basePrice: 25000,
                platformFee: 2125,
                finalPrice: 27125,
                averageRating: 4.9,
                totalNumberOfRatings: 67,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 30,
            },
            {
                title: "Quarterly Financial Review",
                slug: "quarterly-financial-review",
                description:
                    "Comprehensive quarterly financial analysis and reporting. P&L statements, balance sheets, cash flow analysis, and strategic recommendations. Keep your business financially healthy with expert insights.",
                basePrice: 9000,
                platformFee: 765,
                finalPrice: 9765,
                averageRating: 4.7,
                totalNumberOfRatings: 134,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 10,
            },
            {
                title: "Patent Application & Filing",
                slug: "patent-application-filing",
                description:
                    "Protect your innovations with professional patent filing services. Prior art search, patent drafting, application submission, and prosecution support. We handle utility patents, design patents, and provisional applications.",
                basePrice: 18000,
                platformFee: 1530,
                finalPrice: 19530,
                averageRating: 4.8,
                totalNumberOfRatings: 72,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 120,
            },
            {
                title: "Copyright Protection Service",
                slug: "copyright-protection-service",
                description:
                    "Safeguard your creative works with copyright registration. Literary works, music, software, artistic creations - we handle all copyright filings. Quick turnaround with expert guidance.",
                basePrice: 4000,
                platformFee: 340,
                finalPrice: 4340,
                averageRating: 4.6,
                totalNumberOfRatings: 198,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 30,
            },
            {
                title: "Partnership Agreement Drafting",
                slug: "partnership-agreement-drafting",
                description:
                    "Professional partnership deed preparation and registration. Clear profit-sharing terms, responsibilities, dispute resolution mechanisms. Protect your partnership with legally binding documentation.",
                basePrice: 7500,
                platformFee: 637.5,
                finalPrice: 8137.5,
                averageRating: 4.7,
                totalNumberOfRatings: 145,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 7,
            },
            {
                title: "Import Export Code Registration",
                slug: "import-export-code-registration",
                description:
                    "Get your IEC certificate for international trade. Essential for importing or exporting goods and services. Fast processing with complete documentation support and DGFT liaison.",
                basePrice: 2500,
                platformFee: 212.5,
                finalPrice: 2712.5,
                averageRating: 4.9,
                totalNumberOfRatings: 312,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 3,
            },
            {
                title: "MSME/Udyam Registration",
                slug: "msme-udyam-registration",
                description:
                    "Register your enterprise under MSME scheme for government benefits. Access subsidies, easy loan approvals, and tax benefits. Complete Udyam registration with Aadhaar verification.",
                basePrice: 1500,
                platformFee: 165,
                finalPrice: 1665,
                averageRating: 4.8,
                totalNumberOfRatings: 567,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 2,
            },
            {
                title: "ISO Certification Consulting",
                slug: "iso-certification-consulting",
                description:
                    "ISO 9001:2015 certification consulting and implementation. Gap analysis, documentation, internal audits, and certification support. Enhance your business credibility with international quality standards.",
                basePrice: 35000,
                platformFee: 2975,
                finalPrice: 37975,
                averageRating: 4.9,
                totalNumberOfRatings: 43,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 90,
            },
            {
                title: "FSSAI Food License Registration",
                slug: "fssai-food-license-registration",
                description:
                    "Food business license registration - basic, state, or central. Kitchen inspection support, documentation, and FSSAI compliance. Essential for restaurants, cafes, and food manufacturers.",
                basePrice: 5500,
                platformFee: 467.5,
                finalPrice: 5967.5,
                averageRating: 4.7,
                totalNumberOfRatings: 234,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 21,
            },
            {
                title: "Labour Law & EPF Registration",
                slug: "labour-law-epf-registration",
                description:
                    "Complete labour law compliance - EPF, ESI, professional tax, shops & establishments. Monthly compliance, return filing, and employee onboarding support. Stay compliant with all labour regulations.",
                basePrice: 8500,
                platformFee: 722.5,
                finalPrice: 9222.5,
                averageRating: 4.6,
                totalNumberOfRatings: 167,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 14,
            },
            {
                title: "Property Document Verification",
                slug: "property-document-verification",
                description:
                    "Comprehensive property title verification and due diligence. Land registry check, encumbrance certificate, ownership verification. Make informed real estate decisions with expert legal review.",
                basePrice: 12000,
                platformFee: 1020,
                finalPrice: 13020,
                averageRating: 4.8,
                totalNumberOfRatings: 189,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 7,
            },
            {
                title: "Will Drafting & Estate Planning",
                slug: "will-drafting-estate-planning",
                description:
                    "Professional will preparation and estate planning services. Asset distribution, executor appointment, trust creation. Secure your family's future with legally valid testamentary documentation.",
                basePrice: 10000,
                platformFee: 850,
                finalPrice: 10850,
                averageRating: 4.9,
                totalNumberOfRatings: 98,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 5,
            },
            {
                title: "Business Contract Services",
                slug: "business-contract-services",
                description:
                    "Professional contract drafting, review, and negotiation. Employment agreements, vendor contracts, NDAs, service agreements. Protect your business interests with expertly crafted legal documents.",
                basePrice: 6500,
                platformFee: 552.5,
                finalPrice: 7052.5,
                averageRating: 4.7,
                totalNumberOfRatings: 212,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 5,
            },
            {
                title: "Professional Audit Services",
                slug: "professional-audit-services",
                description:
                    "Statutory audit, tax audit, and internal audit services by qualified chartered accountants. Financial statement audit, compliance verification, and audit report preparation for all business types.",
                basePrice: 15000,
                platformFee: 1275,
                finalPrice: 16275,
                averageRating: 5.0,
                totalNumberOfRatings: 156,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 30,
            },
            {
                title: "Payroll Processing & Management",
                slug: "payroll-processing-management",
                description:
                    "Complete payroll management solution for businesses. Salary processing, TDS deduction, payslip generation, Form 16 issuance, and compliance with all statutory requirements. Error-free payroll every month.",
                basePrice: 5000,
                platformFee: 425,
                finalPrice: 5425,
                averageRating: 4.8,
                totalNumberOfRatings: 287,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 30,
            },
            {
                title: "Digital Signature Certificate",
                slug: "digital-signature-certificate",
                description:
                    "Class 2 and Class 3 digital signature certificate for individuals and organizations. E-filing, e-tendering, document signing. Valid for 2 years with complete setup and installation support.",
                basePrice: 1200,
                platformFee: 126,
                finalPrice: 1326,
                averageRating: 4.9,
                totalNumberOfRatings: 643,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 1,
            },
            {
                title: "Business Valuation Report",
                slug: "business-valuation-report",
                description:
                    "Professional business valuation for mergers, acquisitions, fundraising, or partner exits. DCF analysis, comparable company analysis, asset-based valuation. Certified valuation report by qualified experts.",
                basePrice: 30000,
                platformFee: 2550,
                finalPrice: 32550,
                averageRating: 4.8,
                totalNumberOfRatings: 54,
                isDraft: false,
                verificationStatus: VerificationStatus.VERIFIED,
                isVerified: true,
                durationDays: 14,
            },
        ];

        for (const specialistData of specialists) {
            const specialist = specialistRepository.create(specialistData);
            await specialistRepository.save(specialist);
        }

        logger.info(`✅ Successfully seeded ${specialists.length} specialists`);
    } catch (error) {
        logger.error("❌ Error seeding specialists:", error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedSpecialists()
        .then(() => {
            logger.info("Seed completed");
            process.exit(0);
        })
        .catch((error) => {
            logger.error("Seed failed:", error);
            process.exit(1);
        });
}
