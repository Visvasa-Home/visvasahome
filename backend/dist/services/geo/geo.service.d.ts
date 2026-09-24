export declare class GeoService {
    private readonly GEO_KEY;
    private mapsBreaker;
    updateLocation(partnerId: string, lat: number, lng: number): Promise<void>;
    findNearbyPartners(lat: number, lng: number, radiusKm: number): Promise<string[]>;
    getETA(originLat: number, originLng: number, destLat: number, destLng: number): Promise<number>;
}
export declare const geoService: GeoService;
//# sourceMappingURL=geo.service.d.ts.map