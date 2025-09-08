import { pgTable, pgPolicy, bigint, text, foreignKey, unique, timestamp, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const postStatus = pgEnum("post_status", ['draft', 'published', 'private'])


export const projectStack = pgTable("project_stack", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "project_stack_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	stack: text().notNull(),
	type: text().default(').notNull(),
}, (table) => [
	pgPolicy("ReadOnly", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("deleteRLS", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("insertRLS", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("updateRLS", { as: "permissive", for: "update", to: ["public"] }),
]);

export const projectMetaStack = pgTable("project_meta_stack", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "project_meta_stack_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	projectId: bigint("project_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stackId: bigint("stack_id", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projectMeta.id],
			name: "project_meta_stack_project_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.stackId],
			foreignColumns: [projectStack.id],
			name: "project_meta_stack_stack_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("project_meta_stack_id_key").on(table.id),
	pgPolicy("ReadOnly", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("deleteRLS", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("insertRLS", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("updateRLS", { as: "permissive", for: "update", to: ["public"] }),
]);

export const pinnedPost = pgTable("pinned_post", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "pinned_post_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postId: bigint("post_id", { mode: "number" }).notNull(),
	active: boolean(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	order: bigint({ mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [blogMetadata.postId],
			name: "pinned_post_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("pinned_post_id_key").on(table.id),
	unique("pinned_post_post_id_key").on(table.postId),
]);

export const comments = pgTable("comments", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "comments_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	comment: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	authorId: bigint("author_id", { mode: "number" }).notNull(),
	authorType: text("author_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postId: bigint("post_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [blogMetadata.postId],
			name: "comments_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const guestBoard = pgTable("guest_board", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "guest_board_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	comment: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	authorType: text("author_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	authorId: bigint("author_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
});

export const blogMetadata = pgTable("blog_metadata", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postId: bigint("post_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "blog_metadata_post_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	postTitle: text("post_title"),
	postDescription: text("post_description"),
	createAt: timestamp("create_at", { withTimezone: true, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	authorId: bigint("author_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	subGroupId: bigint("sub_group_id", { mode: "number" }),
	updateAt: timestamp("update_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	thumbnailUrl: text("thumbnail_url"),
	imgKey: text("img_key").default('),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	likeCnt: bigint("like_cnt", { mode: "number" }).default(sql`'0'`),
	status: postStatus().default('published'),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [admin.id],
			name: "blog_metadata_author_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.groupId],
			name: "blog_metadata_category_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.subGroupId],
			foreignColumns: [blogSubGroup.subGroupId],
			name: "blog_metadata_sub_group_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const guest = pgTable("guest", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "guest_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	nickname: text(),
	password: text(),
	guestIcon: text("guest_icon"),
});

export const projectSurmmry = pgTable("project_surmmry", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "project_summry_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	projectId: bigint("project_id", { mode: "number" }),
	title: text(),
	contents: text(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projectMeta.id],
			name: "project_summry_project_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("project_summry_id_key").on(table.id),
	pgPolicy("ReadOnly", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("deleteRLS", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("insertRLS", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("updateRLS", { as: "permissive", for: "update", to: ["public"] }),
]);

export const blogContents = pgTable("blog_contents", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	contentId: bigint("content_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "blog_contents_content_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postId: bigint("post_id", { mode: "number" }),
	contents: text(),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [blogMetadata.postId],
			name: "blog_contents_post_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const visitor = pgTable("visitor", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "visitor_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	visitedAt: timestamp("visited_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	visitorAgent: text("visitor_agent"),
	ip: text(),
	where: text(),
});

export const visitorCnt = pgTable("visitor_cnt", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "visitor_cnt_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	visitorCnt: bigint("visitor_cnt", { mode: "number" }).notNull(),
});

export const projectMeta = pgTable("project_meta", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "project_meta_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	imgKey: text("img_key"),
	title: text(),
	company: text(),
	description: text(),
	startDate: text("start_date"),
	endDate: text("end_date"),
	projectUrl: text("project_url"),
	thumbnail: text(),
	projectMember: text("project_member"),
}, (table) => [
	unique("project_meta_id_key").on(table.id),
	pgPolicy("deleteRLS", { as: "permissive", for: "delete", to: ["public"], using: sql`(auth.uid() IS NOT NULL)` }),
	pgPolicy("insertRLS", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("readOnly", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("updateRLS", { as: "permissive", for: "update", to: ["public"] }),
]);

export const category = pgTable("category", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	groupId: bigint("group_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "category_group_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	groupName: text("group_name"),
}, (table) => [
	unique("category_group_id_key").on(table.groupId),
]);

export const blogSubGroup = pgTable("blog_sub_group", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	subGroupId: bigint("sub_group_id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "blog_sub_group_sub_group_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	subGroupName: text("sub_group_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	groupId: bigint("group_id", { mode: "number" }),
	defaultThum: text("default_thum"),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [category.groupId],
			name: "blog_sub_group_group_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("blog_sub_group_sub_group_id_key").on(table.subGroupId),
]);

export const projectContents = pgTable("project_contents", {
	contents: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	projectId: bigint("project_id", { mode: "number" }).generatedByDefaultAsIdentity({ name: "project_contents_project_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "project_contents_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projectMeta.id],
			name: "project_contents_project_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("project_contents_id_key").on(table.id),
	pgPolicy("ReadOnly", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("deleteRLS", { as: "permissive", for: "delete", to: ["public"] }),
	pgPolicy("insertRLS", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("updateRLS", { as: "permissive", for: "update", to: ["public"] }),
]);

export const tempContents = pgTable("temp_contents", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	contentId: bigint("content_id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	postId: bigint("post_id", { mode: "number" }).notNull(),
	contents: text(),
	contentsKey: text("contents_key"),
});

export const admin = pgTable("admin", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).notNull(),
	email: text().notNull(),
	password: text(),
	role: text(),
	nickname: text(),
	profileImg: text("profile_img"),
}, (table) => [
	primaryKey({ columns: [table.id, table.email], name: "admin_pkey"}),
	unique("admin_idx_key").on(table.id),
]);
