import { db } from "@/db/db";
import { commentSchema } from "@/db/schema/comments";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const target = "guest";
  const schema = target === "guest" ? guestBoardSchema : commentSchema;

  try {
    const rows = await db
      .select()
      .from(schema)
      .where(eq(schema.author_type, "guest"))
      .orderBy(desc(schema.id))
      .limit(5);

    return NextResponse.json({ success: true, result: rows }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }
  }
}
