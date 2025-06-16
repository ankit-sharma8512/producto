const Redis = require("ioredis");

class Cache {
    static #client;

    static async initiate(host) {
        try {
            this.#client = new Redis({ host })
            console.log("Connected to product cache");
        }
        catch(err) {
            console.log(err);
            console.log("Failed to connect to Redis");
        }
    }
    
    static async set(key, value, ttl=1800) {
        try {
            const data =  JSON.stringify(value);
            await this.#client.set(key, data, "EX", ttl);
            return true;
        }
        catch {
            console.log(`Cache set fail: ${key}`);
            return false;
        }
    }

    static async get(key) {
        try {
            const cached = await this.#client.get(key);
            return JSON.parse(cached);
        }
        catch {
            console.log(`Cache miss: ${key}`);
            return null;
        }
    }

    static async delete(key) {
        try {
            await this.#client.del(key);
        }
        catch {
            return null;
        }
    }
}

module.exports = Cache;