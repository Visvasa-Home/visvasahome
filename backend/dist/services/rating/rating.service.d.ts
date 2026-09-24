export declare class RatingService {
    submitReview(bookingId: string, customerId: string, rating: number, comment?: string): Promise<string>;
    private updatePartnerAggregateRating;
    /**
     * Safety Compliance (POSH)
     * Logs SOS, harassment, or severe safety incidents.
     * Personal identifiers should be encrypted at the DB level.
     */
    reportIncident(reporterId: string, reporterType: 'customer' | 'partner', incidentType: 'harassment' | 'sos' | 'fraud' | 'other', details: string, bookingId?: string): Promise<void>;
}
export declare const ratingService: RatingService;
//# sourceMappingURL=rating.service.d.ts.map