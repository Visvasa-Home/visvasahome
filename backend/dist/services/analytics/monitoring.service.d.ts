/**
 * MonitoringService — Layer 3: Domain Services (Admin)
 *
 * Provides real-time operational metrics for the admin monitoring dashboard:
 *   - Live bookings heatmap (status + locations)
 *   - Active partner map (online partners + their GPS)
 *   - Completed jobs per city (today/rolling)
 *   - SLA breach alerts
 *   - Surge multiplier per zone
 *
 * Delivered via Server-Sent Events (SSE) to the admin dashboard WebSocket/SSE stream.
 * Also supports one-shot HTTP snapshots for initial page load.
 *
 * Data is assembled from:
 *   - PostgreSQL (booking counts, statuses)
 *   - Redis (online partners, GPS coordinates, surge multipliers)
 */
export interface BookingStatusSnapshot {
    pending: number;
    searching: number;
    assigned: number;
    en_route: number;
    in_progress: number;
    completed: number;
    no_partner: number;
    cancelled: number;
}
export interface ActivePartnerPoint {
    partnerId: string;
    lat: number;
    lng: number;
    name?: string;
}
export interface DashboardSnapshot {
    timestamp: string;
    bookingCounts: BookingStatusSnapshot;
    onlinePartners: number;
    activeBookings: number;
    todayCompleted: number;
    slaBreaches: number;
    avgEtaMinutes: number | null;
    partnerLocations: ActivePartnerPoint[];
    zoneMultipliers: Record<string, number>;
}
export declare class MonitoringService {
    /**
     * Produce a complete dashboard snapshot.
     * Called on SSE heartbeat (every 5s) and on initial HTTP load.
     */
    snapshot(): Promise<DashboardSnapshot>;
    /**
     * Count bookings by status (current state of the system).
     */
    private getBookingCounts;
    /**
     * Get all online partners' GPS coordinates from Redis.
     * Uses GEOPOS for each member in the online set.
     */
    private getPartnerLocations;
    /**
     * Count of partners currently online (Redis set).
     */
    private getOnlinePartnerCount;
    /**
     * Completed bookings since midnight today.
     */
    private getTodayCompleted;
    /**
     * Number of bookings that breached SLA (stuck in 'searching' > SLA threshold).
     */
    private getSlaBreachCount;
    /**
     * Read all zone surge multipliers from Redis.
     */
    private getZoneMultipliers;
}
export declare const monitoringService: MonitoringService;
//# sourceMappingURL=monitoring.service.d.ts.map