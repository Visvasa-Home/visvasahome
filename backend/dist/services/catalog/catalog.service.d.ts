export declare class CatalogService {
    private serviceBloomFilter;
    /**
     * Initializes the Bloom Filter with all existing valid service IDs.
     * Call this on server startup.
     */
    initBloomFilter(): Promise<void>;
    getCategories(): Promise<any>;
    getServicesByCategory(categoryId: string): Promise<any>;
    getServiceDetails(serviceId: string): Promise<any>;
}
export declare const catalogService: CatalogService;
//# sourceMappingURL=catalog.service.d.ts.map