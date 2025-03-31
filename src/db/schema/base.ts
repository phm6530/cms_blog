// db/baseColumns.ts
import { timestamp } from "drizzle-orm/pg-core";

export const baseColumns = {
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
};
