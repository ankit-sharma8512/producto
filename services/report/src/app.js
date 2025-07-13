const express = require("express");
const morgan  = require('morgan');

const reportRouter = require("../routes/report");

class Application {
    #app;

    constructor() {
        this.#app = express();
        this.#app.use(express.json());
        this.#app.use(morgan('dev'));

        this.#app.get("/ping", (req, res) => res.send("Hello from report"));

        this.#app.use("/report", reportRouter);
    }

    start(port=8000) {
        this.#app.listen(port, () => {
            console.log("Server started successfully");
        })
    }
}

module.exports = Application;