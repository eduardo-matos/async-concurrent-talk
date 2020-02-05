const amqp = require('amqplib');
const faker = require('faker');
const {
  RABBITMQ_CONNECTION_URL,
  RABBITMQ_QUEUE_NAME,
  MSG_COUNT_TO_BE_QUEUED,
} = require('./config');

async function main() {
  const conn = await amqp.connect(RABBITMQ_CONNECTION_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE_NAME);

  console.log(`Enqueueing ${MSG_COUNT_TO_BE_QUEUED} messages...`);
  for (let i = 0; i < MSG_COUNT_TO_BE_QUEUED; i += 1) {
    channel.sendToQueue(
      RABBITMQ_QUEUE_NAME,
      Buffer.from(`${faker.name.firstName()} ${faker.name.lastName()}`),
    );
  }
  console.log('Messages enqueued!');

  await channel.close();
  await conn.close();
}

main();
