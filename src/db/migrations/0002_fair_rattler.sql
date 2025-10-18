ALTER TABLE `wishlist` RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE `wishlist` RENAME COLUMN "notes" TO "description";--> statement-breakpoint
ALTER TABLE `wishlist` ADD `priority` text;