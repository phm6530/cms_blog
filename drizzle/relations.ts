import { relations } from "drizzle-orm/relations";
import { projectMeta, projectMetaStack, projectStack, blogMetadata, pinnedPost, comments, admin, category, blogSubGroup, projectSurmmry, blogContents, projectContents } from "./schema";

export const projectMetaStackRelations = relations(projectMetaStack, ({one}) => ({
	projectMeta: one(projectMeta, {
		fields: [projectMetaStack.projectId],
		references: [projectMeta.id]
	}),
	projectStack: one(projectStack, {
		fields: [projectMetaStack.stackId],
		references: [projectStack.id]
	}),
}));

export const projectMetaRelations = relations(projectMeta, ({many}) => ({
	projectMetaStacks: many(projectMetaStack),
	projectSurmmries: many(projectSurmmry),
	projectContents: many(projectContents),
}));

export const projectStackRelations = relations(projectStack, ({many}) => ({
	projectMetaStacks: many(projectMetaStack),
}));

export const pinnedPostRelations = relations(pinnedPost, ({one}) => ({
	blogMetadatum: one(blogMetadata, {
		fields: [pinnedPost.postId],
		references: [blogMetadata.postId]
	}),
}));

export const blogMetadataRelations = relations(blogMetadata, ({one, many}) => ({
	pinnedPosts: many(pinnedPost),
	comments: many(comments),
	admin: one(admin, {
		fields: [blogMetadata.authorId],
		references: [admin.id]
	}),
	category: one(category, {
		fields: [blogMetadata.categoryId],
		references: [category.groupId]
	}),
	blogSubGroup: one(blogSubGroup, {
		fields: [blogMetadata.subGroupId],
		references: [blogSubGroup.subGroupId]
	}),
	blogContents: many(blogContents),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	blogMetadatum: one(blogMetadata, {
		fields: [comments.postId],
		references: [blogMetadata.postId]
	}),
}));

export const adminRelations = relations(admin, ({many}) => ({
	blogMetadata: many(blogMetadata),
}));

export const categoryRelations = relations(category, ({many}) => ({
	blogMetadata: many(blogMetadata),
	blogSubGroups: many(blogSubGroup),
}));

export const blogSubGroupRelations = relations(blogSubGroup, ({one, many}) => ({
	blogMetadata: many(blogMetadata),
	category: one(category, {
		fields: [blogSubGroup.groupId],
		references: [category.groupId]
	}),
}));

export const projectSurmmryRelations = relations(projectSurmmry, ({one}) => ({
	projectMeta: one(projectMeta, {
		fields: [projectSurmmry.projectId],
		references: [projectMeta.id]
	}),
}));

export const blogContentsRelations = relations(blogContents, ({one}) => ({
	blogMetadatum: one(blogMetadata, {
		fields: [blogContents.postId],
		references: [blogMetadata.postId]
	}),
}));

export const projectContentsRelations = relations(projectContents, ({one}) => ({
	projectMeta: one(projectMeta, {
		fields: [projectContents.projectId],
		references: [projectMeta.id]
	}),
}));