import { db } from "@/db/db";
import { visitorSchema } from "@/db/schema/visitor/visitor";
import { visitor_cnt } from "@/db/schema/visitor/visitor_cnt";
import { DateUtils } from "@/util/date-uill";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session_id");
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  // 쿠키가 존재하는지 파악,
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

  const response = NextResponse.json({
    message: isNewVisitor ? "new visitor" : "already visited",
    result: {
      allVisitor_cnt: row.visitor_cnt,
      today_cnt: +today_cnt.count,
    },
  });

  console.log(isNewVisitor);

  if (isNewVisitor) {
    // 오늘
    const now = DateUtils.parseKoreanDate(new Date());
    const todayStart = now.startOf("day"); // 오늘 00:00:00
    const tomorrowStart = todayStart.add(1, "day"); // 내일 00:00:00

    const seconds = tomorrowStart.diff(now, "second");

    // 테스팅
    const expireTime = now.add(seconds, "second");
    console.log(expireTime); //만료시간체크

    response.cookies.set({
      name: "session_id",
      value: crypto.randomUUID(),
      maxAge: seconds,
      path: "/",
      httpOnly: true,
    });
  }

  return response;
}
