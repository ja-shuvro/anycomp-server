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
                description:
                    "Complete company registration and incorporation services including documentation, filing, and legal compliance.",
                serviceId: "service_001",
            },
            {
                title: "Tax Consultation",
                description:
                    "Expert tax planning, preparation, and consultation services for businesses and individuals.",
                serviceId: "service_002",
            },
            {
                title: "Legal Advisory",
                description:
                    "Professional legal consultation and advisory services for business operations and compliance.",
                serviceId: "service_003",
            },
            {
                title: "Trademark Registration",
                description:
                    "Comprehensive trademark search, application, and registration services to protect your brand.",
                serviceId: "service_004",
            },
            {
                title: "Accounting Services",
                description:
                    "Full-service bookkeeping, accounting, and financial reporting for businesses of all sizes.",
                serviceId: "service_005",
            },
            {
                title: "Business License",
                description:
                    "Assistance with obtaining business licenses and permits required for your operations.",
                serviceId: "service_006",
            },
            {
                title: "GST Registration",
                description:
                    "Goods and Services Tax registration and compliance services for businesses.",
                serviceId: "service_007",
            },
            {
                title: "Compliance Management",
                description:
                    "Ongoing compliance monitoring and management to ensure regulatory adherence.",
                serviceId: "service_008",
            },
            {
                title: "Patent Filing",
                description:
                    "Patent application and filing services to protect your innovative inventions and technologies.",
                serviceId: "service_009",
            },
            {
                title: "Copyright Registration",
                description:
                    "Copyright registration services for creative works, literary works, and artistic creations.",
                serviceId: "service_010",
            },
            {
                title: "Partnership Deed",
                description:
                    "Professional drafting and registration of partnership agreements and deed documentation.",
                serviceId: "service_011",
            },
            {
                title: "Import Export Code",
                description:
                    "IEC registration and documentation for international trade and business operations.",
                serviceId: "service_012",
            },
            {
                title: "MSME Registration",
                description:
                    "Micro, Small, and Medium Enterprise registration for government benefits and subsidies.",
                serviceId: "service_013",
            },
            {
                title: "ISO Certification",
                description:
                    "ISO certification consulting and documentation assistance for quality management systems.",
                serviceId: "service_014",
            },
            {
                title: "Food License (FSSAI)",
                description:
                    "Food Safety and Standards Authority license registration for food businesses.",
                serviceId: "service_015",
            },
            {
                title: "Labour Law Compliance",
                description:
                    "Employee provident fund, ESI, and other labour law registration and compliance services.",
                serviceId: "service_016",
            },
            {
                title: "Property Registration",
                description:
                    "Real estate and property documentation, verification, and registration services.",
                serviceId: "service_017",
            },
            {
                title: "Will & Testament",
                description:
                    "Legal will drafting, estate planning, and testament registration services.",
                serviceId: "service_018",
            },
            {
                title: "Contract Drafting",
                description:
                    "Professional legal contract preparation, review, and negotiation services.",
                serviceId: "service_019",
            },
            {
                title: "Audit Services",
                description:
                    "Internal audit, statutory audit, and tax audit services for businesses.",
                serviceId: "service_020",
            },
            {
                title: "Payroll Management",
                description:
                    "Complete payroll processing, salary disbursement, and tax deduction management.",
                serviceId: "service_021",
            },
            {
                title: "Digital Signature",
                description:
                    "Digital signature certificate registration for online filing and e-governance.",
                serviceId: "service_022",
            },
            {
                title: "Business Valuation",
                description:
                    "Professional business valuation and financial analysis for mergers and acquisitions.",
                serviceId: "service_023",
            },
            {
                title: "Secretarial Services",
                description:
                    "Company secretary services for board meetings, AGM, and corporate governance.",
                serviceId: "service_024",
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
