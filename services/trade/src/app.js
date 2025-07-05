const express = require("express");
const morgan  = require('morgan');

const stockRouter    = require("../routes/stock");
const purchaseRouter = require("../routes/purchase");
const orderRouter    = require("../routes/order");

class Application {
    #app;

    constructor() {
        this.#app = express();
        this.#app.use(express.json());
        this.#app.use(morgan('dev'));

        this.#app.get("/ping", (req, res) => res.send("Hello from trade"));
        this.#app.use("/stock", stockRouter);
        this.#app.use("/purchase", purchaseRouter)
        this.#app.use("/order", orderRouter)
    }

    start(port=8000) {
        this.#app.listen(port, () => {
            console.log("Server started successfully");
        })
    }
}

module.exports = Application;