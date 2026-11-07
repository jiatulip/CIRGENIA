CREATE TABLE `site_content` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_owner` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
