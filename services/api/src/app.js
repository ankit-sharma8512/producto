const express   = require("express");
const morgan    = require("morgan");
const cors      = require("cors");

const productRouter = require("../routes/product");
const tradeRouter   = require("../routes/trade");
const grnRouter     = require("../routes/grn");
const traderRouter  = require("../routes/trader");
const reportRouter  = require("../routes/report");

class Application {
    #app;

    constructor() {
        this.#app = express(); 
        this.#app.use(morgan('dev'));
        this.#app.use(cors())
        this.#app.use(express.json());

        this.#app.get('/ping', (req, res) => res.send("Hello from api"));
        this.#app.use('/product', productRouter);
        this.#app.use('/trade',   tradeRouter);
        this.#app.use('/grn',     grnRouter);
        this.#app.use('/trader',  traderRouter);
        this.#app.use('/report',  reportRouter);
    }

    start(port) {
        this.#app.listen(port, () => {
            console.log("Server started");
        })
    }
}

module.exports = Application;