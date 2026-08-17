import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";
import { getS3Url } from "./s3";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const tmpDir = os.tmpdir();
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const file_name = path.join(tmpDir, `queryleaf-${Date.now().toString()}.pdf`);

    // 1. Try direct HTTP download (fastest, bypasses AWS SDK ListBucket IAM checks)
    try {
      const url = getS3Url(file_key);
      console.log("Fetching PDF directly from S3 URL:", url);
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
      if (response.status === 200 && response.data) {
        fs.writeFileSync(file_name, Buffer.from(response.data));
        console.log("Successfully downloaded PDF via HTTP:", file_name);
        return resolve(file_name);
      }
    } catch (httpError: any) {
      console.warn("Direct HTTP fetch failed or object is private, falling back to S3Client...");
    }

    // 2. Fallback to S3Client GetObjectCommand
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
