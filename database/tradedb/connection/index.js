const mongoose = require("mongoose");

class DB {
    static #connection;

    static async init(url, callback) {
        try {
            await mongoose.connect(url);
            console.log("Connected to Trade DB");
            
            this.#connection = mongoose.connection;
            if(callback) callback();
        }
        catch(err) {
            console.log("Failed to connect to DB");
            throw err;
        }
    }

    static get connection() {
        return this.#connection;
    }
}

module.exports = DB;