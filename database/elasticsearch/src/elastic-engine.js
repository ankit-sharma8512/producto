const axios = require('axios');

class ElasticEngine {
    static #host;

    static makeEndpoint(url) {
        return this.#host + url;
    }

    static async initialize(host) {
        this.#host = `http://${host}`;
        try {
            const res = await axios.get(this.#host);
            return res?.data;
        }
        catch(err) {
            console.log(err, "Failed to locate elasticsearch instance");
            throw err;
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
}

module.exports = ElasticEngine;