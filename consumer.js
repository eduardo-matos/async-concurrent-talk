const amqp = require('amqplib');
const {
  RABBITMQ_QUEUE_NAME,
  RABBITMQ_CONNECTION_URL,
  MIN_DELAY,
  MAX_DELAY,
} = require('./config');

async function main() {
  const conn = await amqp.connect(RABBITMQ_CONNECTION_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE_NAME);
  await channel.prefetch(1);

  console.log('Ready to consume messages...');
  channel.consume(RABBITMQ_QUEUE_NAME, async (rawMsg) => {
    await sleep(random(MIN_DELAY, MAX_DELAY)); // simulate slow process
    channel.ack(rawMsg);
    console.log(`Processed message "${rawMsg.content.toString()}"!`);
  });
}

function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

main();
