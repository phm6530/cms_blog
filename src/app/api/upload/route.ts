import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_KEY_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ACCESS!,
    secretAccessKey: process.env.AWS_KEY_SECRET!,
  },
});

export async function POST(req: NextRequest) {
  const { fileName, fileType, imgKey } = await req.json();

  const key = `uploads/project/${imgKey}/${Date.now()}-${fileName}`;

  // Preline 방식
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  console.log(url, key);
  return Response.json({ url, key });
}
