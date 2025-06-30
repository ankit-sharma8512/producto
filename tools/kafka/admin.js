const { Kafka } = require("kafkajs");

const RETRIES   = 10;
const RETRY_GAP = 3000;

class Admin {
    static #client;
    static #admin;

    static async initiate(broker) {
        try {
            this.#client = new Kafka({
                clientId : 'setup',
                brokers  : [broker],
                retry    : {
                    retries          : RETRIES,
                    initialRetryTime : RETRY_GAP,
                }
            })
            
            this.#admin = this.#client.admin();

            await this.#admin.connect();
            console.log("Connected to kafka as admin")
        }
        catch(e) {
            console.log("Failed to connect to kafka")
        }
    }

    static async disconnect() {
        await this.#admin.disconnect();
    }

    static async createTopics(topics) {
        const res = await this.#admin.createTopics({ topics });
        return res;
    }

    static async listTopics() {
        const res = await this.#admin.listTopics();
        return res;
    }
}

module.exports = Admin;