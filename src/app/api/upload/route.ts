import s3 from "@/config/aws.config";
import { apiHandler } from "@/util/api-hanlder";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const imgKey = formData.get("imgKey") as string;

    if (!file) throw new Error("파일 없음");

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error("MIME 타입이 이미지 아님");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error("5MB 넘음");
    }

    const fileName = `${Date.now()}-${imgKey}`;
    const Key = `uploads/blog/${imgKey}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);
    return NextResponse.json({ success: true, url: Key });
  });
}
