import amqp from "amqplib";
import cloudinary from "./config/cloudinary";
import { ImageModel } from "./modules/images/image.model";

async function startWorker() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue("image_transform", { durable: true });
  await channel.assertQueue("image_upload", { durable: true });
  await channel.assertQueue("image_upload_dead", { durable: true });

  channel.consume("image_upload", async (msg) => {
    if (!msg) return;

    const job = JSON.parse(msg.content.toString());
    const { uploadId, userId, fileBuffer } = job;
    const attempts = job.attempts || 0;

    try {
      const buffer = Buffer.from(fileBuffer, "base64");

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `images/${userId}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      await ImageModel.updateStatus(uploadId, {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        status: "completed",
      });

      console.log("Upload job completed", uploadResult.public_id);
    } catch (err: any) {
      console.error("Error processing upload job", err);

      const maxAttempts = 3;
      if (attempts + 1 >= maxAttempts) {
        await ImageModel.updateStatus(uploadId, {
          status: "failed",
        });

        channel.sendToQueue(
          "image_upload_dead",
          Buffer.from(JSON.stringify({ ...job, attempts: attempts + 1, error: err?.message })),
          { persistent: true }
        );
      } else {
        channel.sendToQueue(
          "image_upload",
          Buffer.from(JSON.stringify({ ...job, attempts: attempts + 1 })),
          { persistent: true }
        );
      }
    } finally {
      channel.ack(msg);
    }
  });

  channel.consume("image_transform", async (msg) => {
    if (!msg) return;

    const job = JSON.parse(msg.content.toString());

    console.log("Processing image transform job:", job);

    channel.ack(msg);
  });
}

startWorker();
