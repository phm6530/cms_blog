import { db } from "@/db/db";
import { visitorSchema } from "@/db/schema/visitor/visitor";
import { visitor_cnt } from "@/db/schema/visitor/visitor_cnt";
import { DateUtils } from "@/util/date-uill";
import { WithTransaction } from "@/util/withTransaction";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const SESSION_UUID = "7c7a4d50-17fc-4b18-ae46-5a06252337c8";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(`session_${SESSION_UUID}_blog`);
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  let isNewVisitor = false;

  if (!sessionCookie) {
    try {
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
      isNewVisitor = true;
    } catch (e) {
      console.error("Visitor transaction failed:", e);

      return NextResponse.json(
        { success: false, message: "Visitor update failed" },
        { status: 500 }
      );
    }
  }

  const now = DateUtils.parseKoreanDate(new Date()).format("YYYY-MM-DD");

  const [row] = await db
    .select()
    .from(visitor_cnt)
    .where(eq(visitor_cnt.id, 1));
  const [today_cnt] = await db
    .select({ count: sql<number>`count(*)` })
    .from(visitorSchema)
    .where(
      sql`DATE(${visitorSchema.visited_at} + INTERVAL '9 hours') = ${now}`
    );

  const response = NextResponse.json({
    success: true,
    message: isNewVisitor ? "new visitor" : "already visited",
    result: {
      allVisitor_cnt: row?.visitor_cnt ?? 0,
      today_cnt: Number(today_cnt?.count ?? 0),
    },
  });

  if (isNewVisitor) {
    const nowKST = DateUtils.parseKoreanDate(new Date());
    const todayStart = nowKST.startOf("day");
    const tomorrowStart = todayStart.add(1, "day");
    const seconds = tomorrowStart.diff(nowKST, "second");

    const sessionId = crypto.randomUUID();

    response.cookies.set({
      name: `session_${SESSION_UUID}_blog`,
      value: sessionId,
      maxAge: seconds,
      path: "/",
      httpOnly: true,
    });
  }

  return response;
}
