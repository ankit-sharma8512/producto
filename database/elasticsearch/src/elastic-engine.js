const axios     = require('axios');
const RETRIES   = 5;
const RETRY_GAP = 5000;

class ElasticEngine {
    static #host;

    static makeEndpoint(url) {
        return this.#host + url;
    }

    static async initialize(host) {
        this.#host = `http://${host}`;
        let retries = RETRIES;

        while(retries > 0) {
            try {
                console.log("Trying elastic connection")
                const res = await axios.get(this.#host);
                console.log("Connected to elasticsearch");
                return res?.data;
            }
            catch(err) {
                retries--;
                if(retries == 0)
                    throw new Error("Failed to connect to elasticsearch instance");
                await (new Promise((resolve) => setTimeout(resolve, RETRY_GAP)));
            }
        }
    }

    static async createIndex(indexName) {
        const res = await axios.put(this.makeEndpoint(`/${indexName}`));
        return res?.data;
    }

    static async updateMapping(indexName, mapping) {
        const res = await axios.put(this.makeEndpoint(`/${indexName}/_mapping`), mapping);
        return res?.data;
    }

    static async upsertDoc(indexName, id, doc) {
        const res = await axios.put(this.makeEndpoint(`/${indexName}/_doc/${id}`), doc);
        return res?.data;
    }

    static async deleteDoc(indexName, id) {
        const res = await axios.delete(this.makeEndpoint(`/${indexName}/_doc/${id}`));
        return res?.data;
    }

    static async getDocs(indexName, search) {
        const res = await axios.post(this.makeEndpoint(`/${indexName}/_search`), search)
        return res?.data
    }
}

module.exports = ElasticEngine;