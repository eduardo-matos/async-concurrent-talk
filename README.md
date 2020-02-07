# Async/Concurrent Talk

Esse projeto foi apresentado durante a palestra sobre assincronismo e concorrência no evento _JavaScript Beyond The Basics_ na Loft.

## Install

```
npm install
```

## Lint

```
npm run lint
```

## RabbitMQ

```
docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:management-alpine
```

## MySQL

Se você não tiver o MySQL instalado localmente, pode rodá-lo pelo Docker:

```
docker run --rm -it -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
```

O schema usado no projeto é:

```sql
CREATE TABLE dummy (
  id int not null primary key auto_increment,
  name varchar(255) not null
);
```

## Publisher

Publica mensagens na fila para serem consumidas pelo _consumer_.

Flags:
1. `rabbitmq-connection-url` (`amqp://guest:guest@localhost:5672/%2F`): URL de conexão com o RabbitMQ.
1. `rabbitmq-queue-name` (`dummy`): Fila na qual as mensagens serão publicadas.
1. `msg-count-to-be-queued` (`1000`): Quantidade de mensagens que serão publicadas (assumindo `chunk-size=1`).
1. `chunk-size` (`1`): Tamanho do agrupamento das mensagens.

Ex.:

```
node publisher.js \
  --rabbitmq-connection-url="amqp://guest:guest@localhost:5672/%2F"
  --rabbitmq-queue-name=spam \
  --msg-count-to-be-enqueued=5000 \
  --chunk-size=15
```

## Consumer

Consome mensagens da fila persistindo-as no banco de dados.

Flags:
1. `rabbitmq-connection-url` (`amqp://guest:guest@localhost:5672/%2F`): URL de conexão com o RabbitMQ.
1. `rabbitmq-queue-name` (`dummy`): Fila na qual as mensagens serão publicadas.
1. `min-delay` (`100`): Delay mínimo para salvar um registro no banco de dados.
1. `max-delay` (`1000`): Delay máximo para salvar um registro no banco de dados.
1. `concurrency` (`1`): Quandidade máxima de mensagens do RabbitMQ a serem processadas assincronamente.
1. `db-insert-concurrency` (`1`): Quandidade máxima de inserções no banco de dados.
1. `db-url` (`sqlite::memory:`): URL de conexão com o banco de dados.

```
node consumer.js \
  --rabbitmq-connection-url="amqp://guest:guest@localhost:5672/%2F"
  --rabbitmq-queue-name=spam \
  --min-delay=2000 \
  --max-delay=5000 \
  --concurrency=4 \
  --db-insert-concurrency=10 \
  --db-url="mysql://user:pass@host:port/db_name"
```
