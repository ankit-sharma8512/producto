const ZRegister      = require("../../tools/zookeeper/register");
const Application    = require("./src/app");
const Config         = require("../../tools/config/config");
const Producer       = require("../../tools/kafka/producer");
const TProducer      = require("../../tools/kafka/transactional-producer");
const DB             = require("../../database/tradedb/connection");
const registerModels = require("../../database/tradedb/connection/register");

const CONFIG_PATH      = '/producto/services/trade/config.json';
const TRANSACTIONAL_ID = 'trade-service:stock-updates:0';
const CLIENT_ID        = 'trade-service'

async function register() {
    try {
        znode = new ZRegister(
            Config.get('zookeeper-host')+':2181',
            Config.get('zookeeper-node'),
            Config.get('service'),
            Config.get('host') + ":" + Config.get('port')
        )
        await znode.connectAndRegister();
    }
    catch(err) {
        console.log(err);
        console.log('Failed to register to zookeeper')
    }
}

async function shutdown() {
    try {
        if(znode)
            await znode.closeConnection();

        console.log("shutdown successful");
    }
    catch(err) {
        console.log(err);
        console.log('Failed to close zookeeper connection');
    }
    finally {
        process.exit(0);
    }
}

async function main() {
    await Config.read(CONFIG_PATH);

    register();
    await Producer.initiate(Config.get("kafka-broker"));
    await TProducer.initiate(Config.get("kafka-broker"), CLIENT_ID, TRANSACTIONAL_ID);
    await DB.init(Config.get("db-url"), registerModels)

    const app = new Application();
    app.start(Config.get("port"));
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);

main().catch(err => {
    console.error(err);
    console.log("Error starting");
})