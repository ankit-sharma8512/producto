const { Kafka } = require("kafkajs");

const RETRIES   = 5;
const RETRY_GAP = 3000;

class Consumer {
    static #client;
    static #consumer;
    
    static async connect() {
        let retries = RETRIES;

        while(retries > 0) {
            try {
                await this.#consumer.connect();
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

    static async initiate(broker, groupId) {
        try {
            this.#client = new Kafka({
                clientId: 'elastic-sync',
                brokers: [broker]
            })
            
            this.#consumer = this.#client.consumer({groupId});

            await this.connect();
            console.log("Connected to kafka as consumer")
        }
        catch(e) {
            console.log("Failed to connect to kafka")
        }
    }

    static async subscribe(topic, opts={}) {
        await this.#consumer.subscribe({ topic, ...opts });
    }

    static async run(onEachMsg, autoCommit=true) {
        await this.#consumer.run({
            autoCommit,
            eachMessage: async ({ topic, message, commitOffsetsIfNecessary }) => {
                try {
                    await onEachMsg(topic, message.value.toString())

                    if(!autoCommit) await commitOffsetsIfNecessary();
                }
                catch(err) {
                    console.error(err, "Failed to process msg");
                }
            }
        })
    }

    static async shutdown() {
        await this.#consumer.disconnect();
    }
};

module.exports = Consumer;