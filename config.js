const { argv } = require('yargs');

module.exports = {
  RABBITMQ_CONNECTION_URL: argv.rabbitmqConnectionUrl || 'amqp://guest:guest@localhost:5672/%2F',
  RABBITMQ_QUEUE_NAME: argv.rabbitmqQueueName || 'dummy',
  MSG_COUNT_TO_BE_QUEUED: argv.msgCountToBeQueued || 1000,
};
