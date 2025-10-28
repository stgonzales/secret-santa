CREATE UNIQUE INDEX `draws_giver_id_unique` ON `draws` (`giver_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `draws_receiver_id_unique` ON `draws` (`receiver_id`);