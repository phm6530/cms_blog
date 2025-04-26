"use server";

import s3 from "@/config/aws.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadImageToS3(File: File, imgKey: string) {
  try {
    if (!File) {
      return { success: false, message: "파일 없음" };
    }
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const ext = File.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      throw new Error("확장자가 이미지 아님");
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(File.type)) {
      throw new Error("MIME 타입이 이미지 아님");
    }

    const buffer = Buffer.from(await File.arrayBuffer());

    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error("5MB 넘음");
    }

    const fileName = `${new Date().toISOString()}-${File.name}`;
    const Key = `uploads/blog/${imgKey}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key,
      Body: buffer,
      ContentType: File.type,
    });

    await s3.send(command);
    return { success: true, url: Key };
  } catch (err: unknown) {
    let message = "알 수 없는 에러";

    if (err instanceof Error) {
      message = err.message;
    }

    return {
      success: false,
      message,
    };
  }
}
