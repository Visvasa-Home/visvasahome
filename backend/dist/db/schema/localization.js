"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translations = void 0;
/**
 * Drizzle Schema — Localization Service
 * Database: visvasahome_catalog (or separate visvasahome_localization)
 */
const pg_core_1 = require("drizzle-orm/pg-core");
exports.translations = (0, pg_core_1.pgTable)('translations', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    locale: (0, pg_core_1.varchar)('locale', { length: 10 }).notNull(), // e.g., 'en-US', 'hi-IN'
    key: (0, pg_core_1.varchar)('key', { length: 255 }).notNull(), // e.g., 'home.welcome_message'
    value: (0, pg_core_1.text)('value').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (t) => ({
    localeKeyIdx: (0, pg_core_1.uniqueIndex)('translations_locale_key_idx').on(t.locale, t.key),
}));
//# sourceMappingURL=localization.js.map