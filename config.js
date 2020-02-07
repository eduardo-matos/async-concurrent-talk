const { argv } = require('yargs');

module.exports = {
  RABBITMQ_CONNECTION_URL: argv.rabbitmqConnectionUrl || 'amqp://guest:guest@localhost:5672/%2F',
  RABBITMQ_QUEUE_NAME: argv.rabbitmqQueueName || 'dummy',
  MSG_COUNT_TO_BE_QUEUED: argv.msgCountToBeQueued || 1000,
  CHUNK_SIZE: argv.chunkSize || 1,
  MIN_DELAY: argv.minDelay || 100,
  MAX_DELAY: argv.maxDelay || 1000,
  CONCURRENCY: argv.concurrency || 1,
  DB_INSERT_CONCURRENCY: argv.dbInsertConcurrency || 1,
  DB_URL: argv.dbUrl || 'sqlite::memory:',
};
