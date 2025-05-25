import { db } from "@/db/db";
import { visitorSchema } from "@/db/schema/visitor/visitor";
import { visitor_cnt } from "@/db/schema/visitor/visitor_cnt";
import { DateUtils } from "@/util/date-uill";
import { WithTransaction } from "@/util/withTransaction";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session_id");
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  // 신규니?
  let isNewVisitor = false;

  if (!sessionCookie) {
    isNewVisitor = true;
    await WithTransaction.run(async (tx) => {
      await tx.insert(visitorSchema).values({
        visitor_agent: userAgent,
        ip: realIP,
      });

      await tx
        .update(visitor_cnt)
        .set({ visitor_cnt: sql`${visitor_cnt.visitor_cnt} + 1` })
        .where(eq(visitor_cnt.id, 1));
    });
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

  if (isNewVisitor) {
    // 오늘
    const now = DateUtils.parseKoreanDate(new Date());
    const todayStart = now.startOf("day"); // 오늘 00:00:00
    const tomorrowStart = todayStart.add(1, "day"); // 내일 00:00:00

    const seconds = tomorrowStart.diff(now, "second");

    // 테스팅
    const expireTime = now.add(seconds, "second");
    console.log(expireTime); //만료시간체크

    const sessionId = crypto.randomUUID();

    response.cookies.set({
      name: sessionId,
      value: sessionId,
      maxAge: seconds,
      path: "/",
      httpOnly: true,
    });
  }

  return response;
}
