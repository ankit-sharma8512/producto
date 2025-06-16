const express   = require("express");
const morgan    = require("morgan");

const productRouter = require("../routes/product");

class Application {
    #app;

    constructor() {
        this.#app = express();
        this.#app.use(morgan('dev'));
        this.#app.use(express.json());

        this.#app.get('/ping', (req, res) => res.send("Hello from product"));
        this.#app.use('/', productRouter);
    }

    start(port) {
        this.#app.listen(port, () => {
            console.log("Server started");
        })
    }
}

module.exports = Application;