CREATE TABLE IF NOT EXISTS "file-dropper_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "file-dropper_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file-dropper_apiKey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone,
	"keyId" text NOT NULL,
	"keyHash" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "file-dropper_apiKey_keyId_unique" UNIQUE("keyId"),
	CONSTRAINT "file-dropper_apiKey_name_userId_unique" UNIQUE("name","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file-dropper_files" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_at" text DEFAULT '2025-02-04T22:49:27.818Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file-dropper_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file-dropper_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" text,
	"password" text,
	"role" text DEFAULT 'user',
	CONSTRAINT "file-dropper_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file-dropper_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "file-dropper_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DROP TABLE "self-auth_account";--> statement-breakpoint
DROP TABLE "self-auth_apiKey";--> statement-breakpoint
DROP TABLE "self-auth_post";--> statement-breakpoint
DROP TABLE "self-auth_session";--> statement-breakpoint
DROP TABLE "self-auth_user";--> statement-breakpoint
DROP TABLE "self-auth_verification_token";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file-dropper_account" ADD CONSTRAINT "file-dropper_account_userId_file-dropper_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."file-dropper_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file-dropper_apiKey" ADD CONSTRAINT "file-dropper_apiKey_userId_file-dropper_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."file-dropper_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file-dropper_session" ADD CONSTRAINT "file-dropper_session_userId_file-dropper_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."file-dropper_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "file-dropper_account" USING btree ("userId");