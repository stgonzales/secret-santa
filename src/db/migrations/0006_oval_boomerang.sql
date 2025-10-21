PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_wishlist` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`child_id` text,
	`name` text NOT NULL,
	`url` text,
	`description` text,
	`priority` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_wishlist`("id", "user_id", "child_id", "name", "url", "description", "priority", "created_at", "updated_at") SELECT "id", "user_id", "child_id", "name", "url", "description", "priority", "created_at", "updated_at" FROM `wishlist`;--> statement-breakpoint
DROP TABLE `wishlist`;--> statement-breakpoint
ALTER TABLE `__new_wishlist` RENAME TO `wishlist`;--> statement-breakpoint
PRAGMA foreign_keys=ON;