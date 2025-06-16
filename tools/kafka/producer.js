const { Kafka } = require("kafkajs");

const RETRIES   = 5;
const RETRY_GAP = 3000;

class Producer {
    static #client;
    static #producer;

    static async connect() {
        let retries = RETRIES;

        while(retries > 0) {
            try {
                await this.#producer.connect();
                return
            }
            catch(err) {
                retries--;
                if(retries == 0)
                    throw new Error("Failed to connect to kafka");
                await (new Promise((resolve) => setTimeout(resolve, RETRY_GAP)));
            }
        }
    }

    static async initiate(broker) {
        try {
            this.#client = new Kafka({
                clientId: 'product-service',
                brokers: [broker]
            })
            
            this.#producer = this.#client.producer();

            await this.connect();
            console.log("Connected to kafka as producer")
        }
        catch(e) {
            console.log("Failed to connect to kafka")
        }
    }

    static async publish(topic, key, data) {
        await this.#producer.send({
            topic,
            messages: [
                { key, value:JSON.stringify(data) }
            ]
        })
    }
}

module.exports = Producer;