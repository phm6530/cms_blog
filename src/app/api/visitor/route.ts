import { db } from "@/db/db";
import { visitorSchema } from "@/db/schema/visitor/visitor";
import { visitor_cnt } from "@/db/schema/visitor/visitor_cnt";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session_id");

  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  let isNewVisitor = false;

  if (!sessionCookie) {
    isNewVisitor = true;

    await db.insert(visitorSchema).values({
      visitor_agent: userAgent,
      ip: realIP,
    });

    await db
      .update(visitor_cnt)
      .set({ visitor_cnt: sql`${visitor_cnt.visitor_cnt} + 1` })
      .where(eq(visitor_cnt.id, 1));
  }

  const [row] = await db
    .select()
    .from(visitor_cnt)
    .where(eq(visitor_cnt.id, 1));

  const [today_cnt] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(visitorSchema)
    .where(sql`DATE(${visitorSchema.visited_at}) = CURRENT_DATE`);

  console.log(today_cnt);
  const response = NextResponse.json({
    message: isNewVisitor ? "new visitor" : "already visited",
    result: {
      allVisitor_cnt: row.visitor_cnt,
      today_cnt: +today_cnt.count,
    },
  });

  if (isNewVisitor) {
    response.cookies.set({
      name: "session_id",
      value: crypto.randomUUID(),
      maxAge: 60 * 60 * 24,
      path: "/",
      httpOnly: true,
    });
  }

  return response;
}
