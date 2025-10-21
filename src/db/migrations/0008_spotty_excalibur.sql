CREATE TABLE `child_wishlist` (
	`id` text PRIMARY KEY NOT NULL,
	`child_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`description` text,
	`priority` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE no action
);
