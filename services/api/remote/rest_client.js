const { getAddress } = require("./load_balancer");
const axios          = require('axios');
const HTTPError      = require('../utils/error');

class RestClient {
    #client;
    #key;

    constructor(key) {
        this.#key    = key;
        this.#client = axios.create();
    }

    getHost() {
        const host = `http://${getAddress(this.#key)}`
        return host;
    }

    handleError(err) {
        if(err.response)
            throw new HTTPError(err.response.status || 500, err.response.data?.code || 'ERR_INTERNAL', err.response.data?.message || "Internal Server Error");

        throw new HTTPError();
    }

    async get(url) {
        try {
            const res = await this.#client.get(`${this.getHost()}${url}`, { timeout: 5000 });
            return res.data;
        }
        catch(err) {
            this.handleError(err);
        }
    }

    async post(url, data) {
        try {
            const res = await this.#client.post(`${this.getHost()}${url}`, data, { timeout: 5000 });
            return res.data;
        }
        catch(err) {
            this.handleError(err);
        }
    }

    async put(url, data) {
        try {
            const res = await this.#client.put(`${this.getHost()}${url}`, data, { timeout: 5000 });
            return res.data;
        }
        catch(err) {
            this.handleError(err);
        }
    }

    async delete(url, data) {
        try {
            const res = await this.#client.delete(`${this.getHost()}${url}`, data, { timeout: 5000 });
            return res.data;
        }
        catch(err) {
            this.handleError(err);
        }
    }
}

module.exports = RestClient;