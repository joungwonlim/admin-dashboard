CREATE TYPE "public"."backhand" AS ENUM('two-handed', 'one-handed', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."match_format" AS ENUM('singles', 'doubles', 'mixed_doubles');--> statement-breakpoint
CREATE TYPE "public"."hand" AS ENUM('right', 'left');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'completed', 'retired', 'walkover');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'manager', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."surface" AS ENUM('hard', 'clay', 'grass', 'carpet');--> statement-breakpoint
CREATE TYPE "public"."team_type" AS ENUM('doubles', 'mixed_doubles');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid NOT NULL,
	"changed_by" uuid NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"change_type" text NOT NULL,
	"diff" jsonb
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location_city" text,
	"location_country" text,
	"surface" "surface",
	"indoor" boolean DEFAULT false,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "match_competitors" (
	"match_id" uuid NOT NULL,
	"side" smallint NOT NULL,
	"player_id" uuid,
	"team_id" uuid,
	CONSTRAINT "match_competitors_match_id_side_pk" PRIMARY KEY("match_id","side")
);
--> statement-breakpoint
CREATE TABLE "match_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"changed_by" uuid,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"diff" jsonb
);
--> statement-breakpoint
CREATE TABLE "match_sets" (
	"match_id" uuid NOT NULL,
	"set_number" smallint NOT NULL,
	"side1_games" smallint NOT NULL,
	"side2_games" smallint NOT NULL,
	"side1_tiebreak_points" smallint,
	"side2_tiebreak_points" smallint,
	CONSTRAINT "match_sets_match_id_set_number_pk" PRIMARY KEY("match_id","set_number")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"format" "match_format" NOT NULL,
	"round" text,
	"best_of_sets" smallint DEFAULT 3 NOT NULL,
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"start_time" timestamp,
	"completed_at" timestamp,
	"winner_side" smallint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "player_tennis_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"handedness" "hand",
	"backhand_style" "backhand" DEFAULT 'unknown',
	"height_cm" integer,
	"weight_kg" integer,
	"birthdate" date,
	"birthplace_city" text,
	"birthplace_country" text,
	"residence_city" text,
	"residence_country" text,
	"nationality" text,
	"turned_pro_year" smallint,
	"coach_names" text[],
	"preferred_surface" "surface",
	"racket_brand" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "player_tennis_profile_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "player_tennis_profile_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"changed_by" uuid,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"change_type" text NOT NULL,
	"snapshot" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ranking" integer DEFAULT 0,
	"stats" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"role" text DEFAULT 'member',
	"start_at" timestamp DEFAULT now() NOT NULL,
	"end_at" timestamp,
	CONSTRAINT "team_members_team_id_player_id_start_at_pk" PRIMARY KEY("team_id","player_id","start_at")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_type" "team_type" NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"role" "role" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token"),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
