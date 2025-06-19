// register for zookeeper
const ZRegister     = require("../../tools/zookeeper/register");
const Config        = require("../../tools/config/config");
const App           = require("./src/app");
const Cache         = require("../../tools/cache/cache");
const Producer      = require("../../tools/kafka/producer");
const ElasticEngine = require("../../database/elasticsearch/src/elastic-engine");

let znode;
const CONFIG_PATH = "/producto/services/product/config.json";

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
    Config.read(CONFIG_PATH);

    // register the service with zookeeper for service discovery
    register();
    await Cache.initiate(Config.get("cache-host"));
    await Producer.initiate(Config.get("kafka-broker"))
    await ElasticEngine.initialize(Config.get('elastic-host'))

    // Express app
    const app = new App();
    app.start(Config.get('port'));
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);

main().catch(err => {
    console.error(err);
    console.log("Error starting");
})