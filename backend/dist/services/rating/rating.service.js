"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingService = exports.RatingService = void 0;
/**
 * RatingService — Layer 3: Domain Services
 *
 * Handles customer ratings for bookings.
 * 1. Inserts the review.
 * 2. Asynchronously updates the partner's aggregate rating.
 */
const client_js_1 = require("../../db/client.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const partners_js_1 = require("../../db/schema/partners.js");
const errors_js_1 = require("../../lib/errors.js");
const logger_js_1 = require("../../lib/logger.js");
const drizzle_orm_1 = require("drizzle-orm");
class RatingService {
    async submitReview(bookingId, customerId, rating, comment) {
        if (rating < 1 || rating > 5) {
            throw errors_js_1.Errors.validation('Rating must be between 1 and 5');
        }
        // 1. Validate booking and partner
        const [booking] = await client_js_1.ratingDb.select().from(bookings_js_1.bookings).where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.id, bookingId)).limit(1);
        if (!booking)
            throw errors_js_1.Errors.notFound('Booking');
        if (booking.customerId !== customerId)
            throw errors_js_1.Errors.forbidden('Not your booking');
        if (booking.status !== 'completed') {
            throw errors_js_1.Errors.validation('Only completed bookings can be reviewed');
        }
        if (!booking.partnerId) {
            throw errors_js_1.Errors.validation('No partner was assigned to this booking');
        }
        // 2. Check if already reviewed
        const [existing] = await client_js_1.ratingDb.select().from(bookings_js_1.reviews).where((0, drizzle_orm_1.eq)(bookings_js_1.reviews.bookingId, bookingId)).limit(1);
        if (existing) {
            throw errors_js_1.Errors.conflict('You have already reviewed this booking');
        }
        // 3. Insert review
        const [review] = await client_js_1.ratingDb.insert(bookings_js_1.reviews).values({
            bookingId,
            customerId,
            partnerId: booking.partnerId,
            serviceId: booking.serviceId,
            rating,
            comment,
        }).returning({ id: bookings_js_1.reviews.id });
        logger_js_1.logger.info({ bookingId, customerId, rating }, '[rating] Review submitted');
        // 4. Fire-and-forget: Update Partner Aggregate Rating
        this.updatePartnerAggregateRating(booking.partnerId).catch((err) => {
            logger_js_1.logger.error({ err, partnerId: booking.partnerId }, '[rating] Failed to update aggregate rating');
        });
        return review.id;
    }
    async updatePartnerAggregateRating(partnerId) {
        // Calculate new average and total count
        const [result] = await client_js_1.ratingDb.select({
            avgRating: (0, drizzle_orm_1.sql) `avg(CAST(${bookings_js_1.reviews.rating} AS FLOAT))`,
            count: (0, drizzle_orm_1.sql) `count(*)`,
        })
            .from(bookings_js_1.reviews)
            .where((0, drizzle_orm_1.eq)(bookings_js_1.reviews.partnerId, partnerId));
        if (!result)
            return;
        const avg = parseFloat(Number(result.avgRating || 0).toFixed(2));
        const totalCount = Number(result.count || 0);
        // Business Rule: Traceable suspension process.
        // - After 3+ reviews: warn if avg < 4.0
        // - After 10+ reviews: auto-suspend if avg < 3.8 (strict enforcement)
        // - After 5+ reviews: auto-suspend if avg < 4.2 (VisvasaHome standard)
        let isSuspended = false;
        let suspendReason = '';
        if (totalCount >= 10 && avg < 3.8) {
            isSuspended = true;
            suspendReason = `Rating ${avg} below hard limit 3.8 after ${totalCount} reviews`;
        }
        else if (totalCount >= 5 && avg < 4.2) {
            isSuspended = true;
            suspendReason = `Rating ${avg} below VisvasaHome standard 4.2 after ${totalCount} reviews`;
        }
        // Update the partner profile
        await client_js_1.ratingDb.update(partners_js_1.partners).set({
            rating: avg,
            ...(isSuspended ? { status: 'suspended', workStatus: 'offline' } : {}),
            updatedAt: new Date(),
        }).where((0, drizzle_orm_1.eq)(partners_js_1.partners.id, partnerId));
        if (isSuspended) {
            logger_js_1.logger.warn({ partnerId, avg, totalCount, suspendReason }, '[rating] Partner suspended due to low rating');
            // In production: emit Kafka event 'partner.suspended' → triggers admin review workflow
            // and sends notification to partner about their account status
        }
        else {
            logger_js_1.logger.info({ partnerId, avg, count: totalCount }, '[rating] Aggregate rating updated');
        }
    }
    /**
     * Safety Compliance (POSH)
     * Logs SOS, harassment, or severe safety incidents.
     * Personal identifiers should be encrypted at the DB level.
     */
    async reportIncident(reporterId, reporterType, incidentType, details, bookingId) {
        // 1. Insert into incidents table (Schema stubbed)
        // await db.insert(incidents).values({ ... })
        // 2. Critical Alert Logging
        logger_js_1.logger.fatal({
            reporterId,
            reporterType,
            incidentType,
            bookingId
        }, `[safety] CRITICAL INCIDENT REPORTED: ${incidentType.toUpperCase()}`);
        // 3. Automated Triage
        if (incidentType === 'harassment' || incidentType === 'sos') {
            // Suspend partner immediately pending investigation if reported by customer
            // Or alert Trust & Safety team immediately if reported by partner
            logger_js_1.logger.warn({ reporterId }, '[safety] Triggering Trust & Safety emergency workflow');
        }
    }
}
exports.RatingService = RatingService;
exports.ratingService = new RatingService();
//# sourceMappingURL=rating.service.js.map