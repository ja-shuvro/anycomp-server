import { AppDataSource } from "../data-source";
import { ServiceOffering } from "../entities/ServiceOffering.entity";
import { Specialist } from "../entities/Specialist.entity";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import logger from "../utils/logger";

/**
 * Seed service offering assignments (junction table)
 * Links specialists to service offerings from master list
 */
export async function seedServiceOfferingAssignments() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const serviceOfferingRepository = AppDataSource.getRepository(ServiceOffering);
        const specialistRepository = AppDataSource.getRepository(Specialist);
        const masterListRepository = AppDataSource.getRepository(ServiceOfferingsMasterList);

        // Check if data already exists
        const count = await serviceOfferingRepository.count();
        if (count > 0) {
            logger.info("Service offering assignments already seeded, skipping...");
            return;
        }

        // Get all specialists and master services
        const specialists = await specialistRepository.find();
        const masterServices = await masterListRepository.find();

        if (specialists.length === 0 || masterServices.length === 0) {
            logger.warn("Cannot seed service offering assignments: specialists or master services not found");
            return;
        }

        // Create a mapping of service titles to specialist slugs
        const assignments: { [specialistSlug: string]: string[] } = {
            "complete-company-formation-package": ["Company Incorporation", "Business License", "GST Registration"],
            "annual-tax-filing-compliance": ["Tax Consultation", "Compliance Management"],
            "business-legal-consultation": ["Legal Advisory", "Compliance Management"],
            "trademark-registration-protection": ["Trademark Registration", "Legal Advisory"],
            "monthly-bookkeeping-accounting": ["Accounting Services", "Compliance Management"],
            "gst-registration-setup": ["GST Registration", "Tax Consultation"],
            "business-license-acquisition": ["Business License", "Legal Advisory"],
            "full-compliance-management-suite": ["Compliance Management", "Tax Consultation", "Accounting Services", "GST Registration"],
            "startup-legal-package": ["Company Incorporation", "Legal Advisory", "Trademark Registration"],
            "quarterly-financial-review": ["Accounting Services", "Tax Consultation"],
        };

        let assignmentCount = 0;

        // Create assignments
        for (const specialist of specialists) {
            const serviceNames = assignments[specialist.slug];
            if (!serviceNames) continue;

            for (const serviceName of serviceNames) {
                const masterService = masterServices.find(s => s.title === serviceName);
                if (!masterService) continue;

                const assignment = serviceOfferingRepository.create({
                    specialists: specialist.id,
                    serviceOfferingsMasterListId: masterService.id,
                });

                await serviceOfferingRepository.save(assignment);
                assignmentCount++;
            }
        }

        logger.info(`✅ Successfully created ${assignmentCount} service offering assignments`);
    } catch (error) {
        logger.error("❌ Error seeding service offering assignments:", error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedServiceOfferingAssignments()
        .then(() => {
            logger.info("Seed completed");
            process.exit(0);
        })
        .catch((error) => {
            logger.error("Seed failed:", error);
            process.exit(1);
        });
}
