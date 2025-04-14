import { db } from "@/db/db";
import { commentSchema } from "@/db/schema/comments";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams;
  const target = qs.get("target");
  const isGuest = target === "guest";
  const schema = isGuest ? guestBoardSchema : commentSchema;

  try {
    const baseQuery = db.select().from(schema);

    const rows = await (isGuest
      ? baseQuery.where(eq(schema.author_type, "guest"))
      : baseQuery
    )
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
