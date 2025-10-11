CREATE TYPE "public"."author_type" AS ENUM('admin', 'guest', 'super');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'guest', 'super');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'private');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"nickname" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"profile_img" text,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_contents" (
	"content_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_contents_content_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"contents" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_metadata" (
	"post_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_metadata_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_title" text NOT NULL,
	"post_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL,
	"category_id" integer,
	"sub_group_id" integer,
	"author_id" integer NOT NULL,
	"thumbnail_url" text,
	"status" "post_status" DEFAULT 'published' NOT NULL,
	"img_key" text NOT NULL,
	"like_cnt" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "blog_sub_group" (
	"sub_group_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_sub_group_sub_group_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sub_group_name" text NOT NULL,
	"group_id" integer NOT NULL,
	"default_thum" text
);
--> statement-breakpoint
CREATE TABLE "category" (
	"group_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_group_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"group_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"comment" text NOT NULL,
	"parent_id" integer,
	"author_id" integer NOT NULL,
	"author_type" "author_type" NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_board" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "guest_board_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"comment" text NOT NULL,
	"author_type" "author_type" NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE "guest" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "guest_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nickname" text NOT NULL,
	"password" text NOT NULL,
	"guest_icon" text,
	CONSTRAINT "guest_nickname_unique" UNIQUE("nickname"),
	CONSTRAINT "guest_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE TABLE "pinned_post" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pinned_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"post_id" integer NOT NULL,
	"active" boolean,
	"order" integer
);
--> statement-breakpoint
ALTER TABLE "blog_contents" ADD CONSTRAINT "blog_contents_post_id_blog_metadata_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_metadata"("post_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blog_metadata" ADD CONSTRAINT "blog_metadata_author_id_admin_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blog_sub_group" ADD CONSTRAINT "blog_sub_group_group_id_category_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."category"("group_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_blog_metadata_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_metadata"("post_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "pinned_post" ADD CONSTRAINT "pinned_post_post_id_blog_metadata_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_metadata"("post_id") ON DELETE cascade ON UPDATE cascade;