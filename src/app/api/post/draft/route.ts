import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { POST_STATUS } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq } from "drizzle-orm";

export async function GET() {
  return await apiHandler(async () => {
    return await db
      .select()
      .from(blogMetaSchema)
      .where(eq(blogMetaSchema.status, POST_STATUS.DRAFT));
  });
}
