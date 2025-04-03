import { db } from "@/db/db";
import { blogGroup } from "@/db/schema/blog-group";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const [rows] = await db.select().from(blogGroup);
  console.log(rows);
  return NextResponse.json({ message: "Hello, world!" });
}
