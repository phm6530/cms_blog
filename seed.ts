import "dotenv/config";
import { db } from "@/db/db";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

async function main() {
  const plainText = process.env.MY_PASSWORD as string;
  const password = await bcrypt.hash(plainText, 10);
  console.log(password);

  const comparePassword = await bcrypt.compare(
    plainText,
    "$2b$10$Hk6bcT0mBlwu2Vgrwm/1Bu5pj8xbF9f1s3SXfwrAc3nAJww5xVoWS"
  );
  console.log(comparePassword);
}

// 연결확인
async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT 1`);
    console.log("DB 연결 성공:", result);
  } catch (err) {
    console.error("DB 연결 실패:", err);
  }
}
testConnection();
main();
