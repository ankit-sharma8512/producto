const { Kafka } = require("kafkajs");

const RETRIES   = 10;
const RETRY_GAP = 3000;

class Admin {
    static #client;
    static #admin;

    // static async connect() {
    //     let retries = RETRIES;

    //     while(retries > 0) {
    //         try {
    //             await this.#producer.connect();
    //             return
    //         }
    //         catch(err) {
    //             retries--;
    //             if(retries == 0)
    //                 throw new Error("Failed to connect to kafka");
    //             await (new Promise((resolve) => setTimeout(resolve, RETRY_GAP)));
    //         }
    //     }
    // }

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
}

module.exports = Admin;