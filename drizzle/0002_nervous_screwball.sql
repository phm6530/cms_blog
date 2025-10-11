CREATE TABLE "migration-test" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "migration-test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tester" text NOT NULL,
	CONSTRAINT "migration-test_tester_unique" UNIQUE("tester")
);
