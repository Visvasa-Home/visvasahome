"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = `
  type Booking {
    id: ID!
    customerId: String!
    serviceId: String!
    status: String!
    scheduledTime: String
    finalAmount: String
  }

  type Service {
    id: ID!
    name: String!
    description: String
    basePrice: String!
    estimatedArrivalMins: Int!
  }

  type Partner {
    id: ID!
    name: String!
    rating: Float
    status: String!
  }

  type Query {
    booking(id: ID!): Booking
    service(id: ID!): Service
    partner(id: ID!): Partner
    myBookings: [Booking]
  }

  input AddressInput {
    lat: Float!
    lng: Float!
    line: String!
    pincode: String
  }

  input BookingInput {
    serviceId: String!
    addressId: String!
    isInstant: Boolean
    scheduledTime: String
    couponCode: String
    notes: String
    idempotencyKey: String
  }

  type Mutation {
    createBooking(input: BookingInput!): Booking
    cancelBooking(id: ID!): Boolean
  }
`;
//# sourceMappingURL=schema.js.map