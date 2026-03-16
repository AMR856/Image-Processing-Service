import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();
  await channel.assertQueue("image_transform", { durable: true });
  await channel.assertQueue("image_upload", { durable: true });
  await channel.assertQueue("image_upload_dead", { durable: true });
}

export function publishTransformJob(data: any) {
  channel.sendToQueue(
    "image_transform",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
}

export function publishUploadJob(data: any) {
  channel.sendToQueue(
    "image_upload",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
}
