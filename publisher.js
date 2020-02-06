const amqp = require('amqplib');
const faker = require('faker');
const {
  RABBITMQ_CONNECTION_URL,
  RABBITMQ_QUEUE_NAME,
  MSG_COUNT_TO_BE_QUEUED,
  CHUNK_SIZE,
} = require('./config');

async function main() {
  const conn = await amqp.connect(RABBITMQ_CONNECTION_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE_NAME);

  const chunks = chunkfy(generateNames(MSG_COUNT_TO_BE_QUEUED), CHUNK_SIZE);

  console.log(`Enqueueing ${chunks.length} messages...`);
  chunks.forEach(chunk => channel.sendToQueue(
    RABBITMQ_QUEUE_NAME,
    Buffer.from(JSON.stringify(chunk)),
  ));

  console.log('Messages enqueued!');

  await channel.close();
  await conn.close();
}

function chunkfy(array, chunkSize){
  var index = 0;
  var arrayLength = array.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
      const myChunk = array.slice(index, index + chunkSize);
      tempArray.push(myChunk);
  }

  return tempArray;
}

function generateNames(count) {
  return Array(count).fill('').map(() => `${faker.name.firstName()} ${faker.name.lastName()}`);
}

main();
