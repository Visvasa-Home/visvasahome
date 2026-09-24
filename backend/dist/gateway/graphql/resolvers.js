"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const booking_service_js_1 = require("../../services/booking/booking.service.js");
const partner_service_js_1 = require("../../services/partner/partner.service.js");
const client_js_1 = require("../../db/client.js");
const services_js_1 = require("../../db/schema/services.js");
const bookings_js_1 = require("../../db/schema/bookings.js");
const drizzle_orm_1 = require("drizzle-orm");
exports.resolvers = {
    Query: {
        booking: async (_, { id }, context) => {
            // Access control via context (which holds the token)
            if (!context.user)
                throw new Error('Unauthorized');
            return booking_service_js_1.bookingService.get(id);
        },
        service: async (_, { id }) => {
            const [svc] = await client_js_1.db.select().from(services_js_1.services).where((0, drizzle_orm_1.eq)(services_js_1.services.id, id)).limit(1);
            return svc;
        },
        partner: async (_, { id }, context) => {
            if (!context.user)
                throw new Error('Unauthorized');
            return partner_service_js_1.partnerService.getProfile(id);
        },
        myBookings: async (_, __, context) => {
            if (!context.user)
                throw new Error('Unauthorized');
            const list = await client_js_1.db.select().from(bookings_js_1.bookings)
                .where((0, drizzle_orm_1.eq)(bookings_js_1.bookings.customerId, context.user.sub))
                .orderBy((0, drizzle_orm_1.desc)(bookings_js_1.bookings.createdAt))
                .limit(20);
            return list;
        }
    },
    Mutation: {
        createBooking: async (_, { input }, context) => {
            if (!context.user)
                throw new Error('Unauthorized');
            const { serviceId, addressId, couponCode, isInstant, scheduledTime, notes, idempotencyKey } = input;
            // We pass the parameters down to the core booking service
            return booking_service_js_1.bookingService.create({
                customerId: context.user.sub,
                serviceId,
                addressId,
                couponCode,
                bookingType: isInstant ? 'instant' : 'scheduled',
                scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
                notes,
            });
        },
        cancelBooking: async (_, { id }, context) => {
            if (!context.user)
                throw new Error('Unauthorized');
            await booking_service_js_1.bookingService.transition(id, 'cancelled', { changedById: context.user.sub, changedByRole: 'customer', note: 'Customer requested cancellation via GraphQL' });
            return true;
        }
    }
};
//# sourceMappingURL=resolvers.js.map