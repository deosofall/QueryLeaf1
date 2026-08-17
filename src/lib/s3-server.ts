import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const region = process.env.NEXT_PUBLIC_S3_REGION || "eu-north-1";
      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });
      const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      });

      const obj = await s3Client.send(command);
      const tmpDir = os.tmpdir();
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const file_name = path.join(tmpDir, `queryleaf-${Date.now().toString()}.pdf`);

      if (obj.Body) {
        const fileStream = fs.createWriteStream(file_name);
        const stream = obj.Body as any;
        stream.pipe(fileStream);
        stream.on("finish", () => resolve(file_name));
        stream.on("error", (err: any) => reject(err));
      } else {
        reject(new Error("Empty body received from S3"));
      }
    } catch (error) {
      console.error("Error downloading from S3:", error);
      reject(error);
    }
  });
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
