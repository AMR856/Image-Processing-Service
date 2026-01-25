import amqp from "amqplib";

async function startWorker() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertQueue("image_transform", { durable: true });

  channel.consume("image_transform", async (msg) => {
    if (!msg) return;

    const job = JSON.parse(msg.content.toString());

    console.log("Processing image transform job:", job);

    channel.ack(msg);
  });
}

startWorker();
