import config from '~/config';
import amqp from 'amqplib/callback_api';
import LogFormat from "~/utils/log-format";

class RabbitConsumer extends LogFormat {
    constructor() {
        super("RabbitConsumer");
        this.log("", `Connect...`);
        amqp.connect(config.rabbit.url, (err, conn) => {
            if (conn) {
                conn.createChannel((err, ch) => {
                    ch.assertQueue(config.rabbit.queue, {durable: false});
                    this.channel = ch;
                    this.log("", `Connected.`);
                });
            } else {
                this.log("", `No connection - ${err}`);
            }
        });
    }

    publish(type, object) {
        this.log("", `Send message: ${type}`);
        const message = `${type}:${JSON.stringify(object)}`;
        if (this.channel) {
            this.channel.sendToQueue(config.rabbit.queue, new Buffer(message));
            this.log("", `Message sent: ${message}`);
            return;
        }
        this.log("", `Send message failed.`);
    }
}

export default new RabbitConsumer();