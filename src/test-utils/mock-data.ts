export const mockPlatformFee = (overrides = {}) => ({
    tierName: "Test Tier",
    minValue: 0,
    maxValue: 5000,
    platformFeePercentage: 5.0,
    ...overrides
});

export const mockServiceOffering = (overrides = {}) => ({
    title: "Test Service",
    description: "Test service description",
    serviceId: `service_${Date.now()}`,
    ...overrides
});

export const mockSpecialist = (overrides = {}) => ({
    title: "Test Specialist",
    description: "Test specialist description",
    basePrice: 5000,
    durationDays: 7,
    ...overrides
});

export const mockCreateSpecialistDto = (serviceIds: string[] = []) => ({
    title: "Test Specialist",
    description: "Expert professional",
    basePrice: 10000,
    durationDays: 10,
    serviceIds
});
