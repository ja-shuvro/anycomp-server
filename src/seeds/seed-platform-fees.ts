import { AppDataSource } from "../data-source";
import { PlatformFee, TierName } from "../entities/PlatformFee.entity";
import logger from "../utils/logger";

/**
 * Seed platform fee tiers
 */
export async function seedPlatformFees() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const platformFeeRepository = AppDataSource.getRepository(PlatformFee);

        // Check if data already exists
        const count = await platformFeeRepository.count();
        if (count > 0) {
            logger.info("Platform fees already seeded, skipping...");
            return;
        }

        const platformFees = [
            // Micro tier (0-500)
            { tierName: TierName.BASIC, minValue: 0, maxValue: 500, platformFeePercentage: 12.0 },
            { tierName: TierName.BASIC, minValue: 501, maxValue: 1000, platformFeePercentage: 11.5 },
            { tierName: TierName.BASIC, minValue: 1001, maxValue: 1500, platformFeePercentage: 11.0 },
            { tierName: TierName.BASIC, minValue: 1501, maxValue: 2000, platformFeePercentage: 10.5 },
            { tierName: TierName.BASIC, minValue: 2001, maxValue: 2500, platformFeePercentage: 10.0 },
            { tierName: TierName.BASIC, minValue: 2501, maxValue: 3000, platformFeePercentage: 9.5 },

            // Standard tier (3001-10000)
            { tierName: TierName.STANDARD, minValue: 3001, maxValue: 4000, platformFeePercentage: 9.0 },
            { tierName: TierName.STANDARD, minValue: 4001, maxValue: 5000, platformFeePercentage: 8.5 },
            { tierName: TierName.STANDARD, minValue: 5001, maxValue: 6000, platformFeePercentage: 8.2 },
            { tierName: TierName.STANDARD, minValue: 6001, maxValue: 7000, platformFeePercentage: 8.0 },
            { tierName: TierName.STANDARD, minValue: 7001, maxValue: 8000, platformFeePercentage: 7.8 },
            { tierName: TierName.STANDARD, minValue: 8001, maxValue: 10000, platformFeePercentage: 7.5 },

            // Premium tier (10001-25000)
            { tierName: TierName.PREMIUM, minValue: 10001, maxValue: 12000, platformFeePercentage: 7.2 },
            { tierName: TierName.PREMIUM, minValue: 12001, maxValue: 15000, platformFeePercentage: 7.0 },
            { tierName: TierName.PREMIUM, minValue: 15001, maxValue: 18000, platformFeePercentage: 6.8 },
            { tierName: TierName.PREMIUM, minValue: 18001, maxValue: 20000, platformFeePercentage: 6.5 },
            { tierName: TierName.PREMIUM, minValue: 20001, maxValue: 25000, platformFeePercentage: 6.2 },

            // Enterprise tier (25001+)
            { tierName: TierName.ENTERPRISE, minValue: 25001, maxValue: 30000, platformFeePercentage: 6.0 },
            { tierName: TierName.ENTERPRISE, minValue: 30001, maxValue: 40000, platformFeePercentage: 5.5 },
            { tierName: TierName.ENTERPRISE, minValue: 40001, maxValue: 50000, platformFeePercentage: 5.0 },
            { tierName: TierName.ENTERPRISE, minValue: 50001, maxValue: 75000, platformFeePercentage: 4.5 },
            { tierName: TierName.ENTERPRISE, minValue: 75001, maxValue: 100000, platformFeePercentage: 4.0 },
            { tierName: TierName.ENTERPRISE, minValue: 100001, maxValue: 500000, platformFeePercentage: 3.5 },
            { tierName: TierName.ENTERPRISE, minValue: 500001, maxValue: 999999, platformFeePercentage: 3.0 },
        ];

        for (const feeData of platformFees) {
            const platformFee = platformFeeRepository.create(feeData);
            await platformFeeRepository.save(platformFee);
        }

        logger.info(`✅ Successfully seeded ${platformFees.length} platform fee tiers`);
    } catch (error) {
        logger.error("❌ Error seeding platform fees:", error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedPlatformFees()
        .then(() => {
            logger.info("Seed completed");
            process.exit(0);
        })
        .catch((error) => {
            logger.error("Seed failed:", error);
            process.exit(1);
        });
}
