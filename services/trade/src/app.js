const express = require("express");
const Config  = require("../../tools/config");

class Application {
    static #app;

    static initialize() {
        this.#app = express();

        this.#app.get("/", (req, res) => res.send("Hello from trade"));
    }

    static start() {
        this.#app.listen(Config.read("port"), () => {
            console.log("Server started successfully");
        })
    }
}

module.exports = Application;