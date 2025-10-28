DROP TABLE `child_wishlist`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_draws` (
	`id` text PRIMARY KEY NOT NULL,
	`giver_id` text NOT NULL,
	`receiver_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_draws`("id", "giver_id", "receiver_id", "created_at", "updated_at") SELECT "id", "giver_id", "receiver_id", "created_at", "updated_at" FROM `draws`;--> statement-breakpoint
DROP TABLE `draws`;--> statement-breakpoint
ALTER TABLE `__new_draws` RENAME TO `draws`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_wishlist` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`description` text,
	`priority` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_wishlist`("id", "user_id", "name", "url", "description", "priority", "created_at", "updated_at") SELECT "id", "user_id", "name", "url", "description", "priority", "created_at", "updated_at" FROM `wishlist`;--> statement-breakpoint
DROP TABLE `wishlist`;--> statement-breakpoint
ALTER TABLE `__new_wishlist` RENAME TO `wishlist`;