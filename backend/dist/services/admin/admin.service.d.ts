export declare class AdminService {
    getConfig(key: string): Promise<any | null>;
    setConfig(key: string, value: any, adminId: string, description?: string): Promise<void>;
    getFeatureFlag(flag: string): Promise<boolean>;
    toggleFeatureFlag(flag: string, isEnabled: boolean, adminId: string): Promise<void>;
}
export declare const adminService: AdminService;
//# sourceMappingURL=admin.service.d.ts.map