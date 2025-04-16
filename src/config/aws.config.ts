import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
  region: process.env.AWS_KEY_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ACCESS!,
    secretAccessKey: process.env.AWS_KEY_SECRET!,
  },
});

export default s3;
