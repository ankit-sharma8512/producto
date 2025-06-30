const { Kafka } = require("kafkajs");

const RETRIES   = 5;
const RETRY_GAP = 3000;

class TProducer {
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

    static async initiate(broker, clientId, transactionalId) {
        try {
            this.#client = new Kafka({
                clientId,
                brokers: [broker]
            })
            
            this.#producer = this.#client.producer({
                transactionalId,
                maxInFlightRequest : 1,
                idempotent         : true
            });

            await this.connect();

            console.log("Connected to kafka as transactional producer")
        }
        catch(e) {
            console.log("Failed to connect to kafka")
        }
    }

    static async publish(topic, messages) {
        const txn = await this.#producer.transaction();
        try {
            await txn.send({ topic, messages });
            await txn.commit();
        }
        catch(err) {
            console.log("Failed to complete transaction", err);
            await txn.abort();
            throw err
        }
    }
}

module.exports = TProducer;