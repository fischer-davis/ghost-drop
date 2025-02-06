CREATE TABLE `ghost-drop_account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `ghost-drop_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ghost-drop_apiKey` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer NOT NULL,
	`keyId` text NOT NULL,
	`keyHash` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `ghost-drop_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ghost-drop_files` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`file_path` text NOT NULL,
	`file_size` integer NOT NULL,
	`uploaded_at` text DEFAULT '2025-02-06T05:35:12.549Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ghost-drop_session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `ghost-drop_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ghost-drop_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password` text,
	`role` text DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE `ghost-drop_verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ghost-drop_apiKey_keyId_unique` ON `ghost-drop_apiKey` (`keyId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ghost-drop_apiKey_name_userId_unique` ON `ghost-drop_apiKey` (`name`,`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ghost-drop_user_email_unique` ON `ghost-drop_user` (`email`);