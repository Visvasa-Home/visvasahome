"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlags = void 0;
const env_js_1 = require("../env.js");
exports.featureFlags = {
    isRealtimeDispatchEnabled: () => env_js_1.env.FEATURE_REALTIME_DISPATCH === 'true',
    isInstantBookingEnabled: () => env_js_1.env.FEATURE_INSTANT_BOOKING === 'true',
    isGraphqlBffEnabled: () => env_js_1.env.FEATURE_GRAPHQL_BFF === 'true',
};
//# sourceMappingURL=featureFlags.js.map