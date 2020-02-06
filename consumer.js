const Sequelize = require('sequelize');
const uuid = require('uuid');
const amqp = require('amqplib');
const db = require('./database');
const {
  RABBITMQ_QUEUE_NAME,
  RABBITMQ_CONNECTION_URL,
  MIN_DELAY,
  MAX_DELAY,
  CONCURRENCY,
} = require('./config');

async function main() {
  const conn = await amqp.connect(RABBITMQ_CONNECTION_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE_NAME);
  await channel.prefetch(CONCURRENCY);

  const consumerTag = uuid.v4();
  let messagesBeingProcessed = 0;

  console.log('Ready to consume messages...');
  channel.consume(RABBITMQ_QUEUE_NAME, async (rawMsg) => {
    messagesBeingProcessed += 1;

    await sleep(random(MIN_DELAY, MAX_DELAY)); // simulate slow process

    const names = JSON.parse(rawMsg.content.toString());

    const insertsPromises = names.map(name => db.query('INSERT INTO dummy (name) VALUES (?);', {
      replacements: [[name]],
      type: Sequelize.QueryTypes.INSERT,
    }));

    await Promise.all(insertsPromises);

    channel.ack(rawMsg);
    console.log(`Processed message "${rawMsg.content.toString()}"!`);

    messagesBeingProcessed -= 1;
  }, { consumerTag });

  process.on('SIGTERM', async () => {
    console.log('Gracefully shutting down...');
    console.log('Stopping to receive new messages...');
    await channel.cancel(consumerTag);

    while(true) {
      if (messagesBeingProcessed === 0) {
        console.log('All messages have been processed. Proceeding with shutdown...');
        break;
      }

      console.log('Waiting all messages to be processed before shutting down...');
      await sleep(1000);
    }

    console.log('Closing channel and connection...');
    await channel.close();
    await conn.close();

    console.log('Shutting down!');
  });
}

function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

main();
