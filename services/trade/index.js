const ZRegister      = require("../../tools/zookeeper/register");
const Application    = require("./src/app");
const Config         = require("../../tools/config/config");
const Producer       = require("../../tools/kafka/producer");
const Consumer       = require("../../tools/kafka/consumer");
const TProducer      = require("../../tools/kafka/transactional-producer");
const DB             = require("../../database/tradedb/connection");
const ServiceManager = require("../../tools/zookeeper/service_manager");
const registerModels = require("../../database/tradedb/connection/register");
const order          = require("./controller/order")

const CONFIG_PATH      = '/producto/services/trade/config.json';
const TRANSACTIONAL_ID = 'trade-service:stock-updates:0';
const CLIENT_ID        = 'trade-service'
const GROUP_ID         = 'trade-service'
const SERVICES         = [
    {
        key   : 'product',
        znode : '/service/product'
    }
]
const TOPIC_HANDLERS = {
    'order-updates': order.markProcessed
}

async function handleMessage(topic, message) {
    if(TOPIC_HANDLERS[topic])
        await TOPIC_HANDLERS[topic](message);
    else
        console.log("No handler specified for topic: "+topic);
}

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
        await Consumer.shutdown();
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

    // Initiate service discovery
    ServiceManager.initiate(SERVICES).catch(err => {
        console.log("Failed to connect to zookeeper. wont be able to make service requests");
    });

    await Producer.initiate(Config.get("kafka-broker"));
    await TProducer.initiate(Config.get("kafka-broker"), CLIENT_ID, TRANSACTIONAL_ID);
    await Consumer.initiate(Config.get('kafka-broker'), GROUP_ID);

    await DB.init(Config.get("db-url"), registerModels)

    Object.keys(TOPIC_HANDLERS).forEach(async topic => {
        await Consumer.subscribe(topic);
    });

    Consumer.run(handleMessage, true).catch(err => {
        console.log("Failed to start consumer")
        shutdown()
    });

    const app = new Application();
    app.start(Config.get("port"));
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);

main().catch(err => {
    console.error(err);
    console.log("Error starting");
})