CREATE TABLE "visitor" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "visitor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"visited_at" timestamp DEFAULT now() NOT NULL,
	"visitor_agent" text NOT NULL,
	"ip" text,
	"where" text
);
--> statement-breakpoint
CREATE TABLE "visitor_cnt" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "visitor_cnt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"visitor_cnt" integer
);
