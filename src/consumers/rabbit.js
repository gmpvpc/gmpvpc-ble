import logger from "~/utils/logger"
import config from '~/config';
import amqp from 'amqplib/callback_api';

class RabbitConsumer {
    constructor() {
        logger.log(`RabbitConsumer: Connect...`);
        amqp.connect(config.rabbit.url, (err, conn) => {
            if (conn) {
                conn.createChannel((err, ch) => {
                    ch.assertQueue(config.rabbit.queue, {durable: false});
                    this.channel = ch;
                    logger.log(`RabbitConsumer: Connected.`);
                });
            } else {
                logger.log(`RabbitConsumer: No connection - ${err}`);
            }
        });
    }

    publish(message) {
        logger.log(`RabbitConsumer: Send message: ${message}`);
        this.channel.sendToQueue(config.rabbit.queue, new Buffer(message));
        logger.log(`RabbitConsumer: Message sent.`);
    }
}

export default new RabbitConsumer();