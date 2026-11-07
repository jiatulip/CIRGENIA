import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const siteContent = sqliteTable('site_content', {
 id: text('id').primaryKey(), payload: text('payload').notNull(),
 revision: integer('revision').notNull().default(1), updatedAt: text('updated_at').notNull(),
});
export const siteOwner = sqliteTable('site_owner', {id:text('id').primaryKey(),userId:text('user_id').notNull()});

export const inquiries = sqliteTable('inquiries', {
 id:text('id').primaryKey(), name:text('name').notNull(), email:text('email').notNull(),
 message:text('message').notNull(), locale:text('locale').notNull(),
 status:text('status').notNull().default('new'), createdAt:text('created_at').notNull(),
 privacyVersion:text('privacy_version'),
});
export const pageViews = sqliteTable('page_views', {
 id:text('id').primaryKey(), day:text('day').notNull(), page:text('page').notNull(),
 source:text('source').notNull(), views:integer('views').notNull().default(0),
});
export const submissionLimits = sqliteTable('submission_limits', {
 id:text('id').primaryKey(), value:text('value').notNull(), expiresAt:integer('expires_at').notNull(),
});
