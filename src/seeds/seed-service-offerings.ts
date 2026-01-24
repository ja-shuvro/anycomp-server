import { AppDataSource } from "../data-source";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import logger from "../utils/logger";

/**
 * Seed service offerings master list
 */
export async function seedServiceOfferings() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const serviceRepository = AppDataSource.getRepository(ServiceOfferingsMasterList);

        // Check if data already exists
        const count = await serviceRepository.count();
        if (count > 0) {
            logger.info("Service offerings already seeded, skipping...");
            return;
        }

        const serviceOfferings = [
            {
                title: "Company Incorporation",
                description: "Complete company registration and incorporation services including documentation, filing, and legal compliance.",
            },
            {
                title: "Tax Consultation",
                description: "Expert tax planning, preparation, and consultation services for businesses and individuals.",
            },
            {
                title: "Legal Advisory",
                description: "Professional legal consultation and advisory services for business operations and compliance.",
            },
            {
                title: "Trademark Registration",
                description: "Comprehensive trademark search, application, and registration services to protect your brand.",
            },
            {
                title: "Accounting Services",
                description: "Full-service bookkeeping, accounting, and financial reporting for businesses of all sizes.",
            },
            {
                title: "Business License",
                description: "Assistance with obtaining business licenses and permits required for your operations.",
            },
            {
                title: "GST Registration",
                description: "Goods and Services Tax registration and compliance services for businesses.",
            },
            {
                title: "Compliance Management",
                description: "Ongoing compliance monitoring and management to ensure regulatory adherence.",
            },
            {
                title: "Patent Filing",
                description: "Patent application and filing services to protect your innovative inventions and technologies.",
            },
            {
                title: "Copyright Registration",
                description: "Copyright registration services for creative works, literary works, and artistic creations.",
            },
            {
                title: "Partnership Deed",
                description: "Professional drafting and registration of partnership agreements and deed documentation.",
            },
            {
                title: "Import Export Code",
                description: "IEC registration and documentation for international trade and business operations.",
            },
            {
                title: "MSME Registration",
                description: "Micro, Small, and Medium Enterprise registration for government benefits and subsidies.",
            },
            {
                title: "ISO Certification",
                description: "ISO certification consulting and documentation assistance for quality management systems.",
            },
            {
                title: "Food License (FSSAI)",
                description: "Food Safety and Standards Authority license registration for food businesses.",
            },
            {
                title: "Labour Law Compliance",
                description: "Employee provident fund, ESI, and other labour law registration and compliance services.",
            },
            {
                title: "Property Registration",
                description: "Real estate and property documentation, verification, and registration services.",
            },
            {
                title: "Will & Testament",
                description: "Legal will drafting, estate planning, and testament registration services.",
            },
            {
                title: "Contract Drafting",
                description: "Professional legal contract preparation, review, and negotiation services.",
            },
            {
                title: "Audit Services",
                description: "Internal audit, statutory audit, and tax audit services for businesses.",
            },
            {
                title: "Payroll Management",
                description: "Complete payroll processing, salary disbursement, and tax deduction management.",
            },
            {
                title: "Digital Signature",
                description: "Digital signature certificate registration for online filing and e-governance.",
            },
            {
                title: "Business Valuation",
                description: "Professional business valuation and financial analysis for mergers and acquisitions.",
            },
            {
                title: "Secretarial Services",
                description: "Company secretary services for board meetings, AGM, and corporate governance.",
            },
        ];

        for (const serviceData of serviceOfferings) {
            const service = serviceRepository.create(serviceData);
            await serviceRepository.save(service);
        }

        logger.info(`✅ Successfully seeded ${serviceOfferings.length} service offerings`);
    } catch (error) {
        logger.error("❌ Error seeding service offerings:", error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedServiceOfferings()
        .then(() => {
            logger.info("Seed completed");
            process.exit(0);
        })
        .catch((error) => {
            logger.error("Seed failed:", error);
            process.exit(1);
        });
}
