const Consumer       = require("../../tools/kafka/consumer");
const Config         = require("../../tools/config/config");
const ElasticEngine = require("../../database/elasticsearch/src/elastic-engine")

const productHandler = require("./src/product-index");

const CONFIG_PATH    = "/producto/services/elasticsync/config.json";
const GROUP_ID       = 'elastic-sync'
const TOPIC_HANDLERS = {
    'product-changes': productHandler
}

async function handleMessage(topic, message) {
    if(TOPIC_HANDLERS[topic])
        await TOPIC_HANDLERS[topic](message);
    else
        console.log("No handler specified for topic: "+topic);
}

async function shutdown() {
    await Consumer.shutdown();
    process.exit(0);
}

async function main() {
    Config.read(CONFIG_PATH);

    await Consumer.initiate(Config.get('kafka-broker'), GROUP_ID);
    await ElasticEngine.initialize(Config.get('elastic-host'))

    Object.keys(TOPIC_HANDLERS).forEach(async topic => {
        await Consumer.subscribe(topic, { fromBeginning:true });
    });

    await Consumer.run(handleMessage, false);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main().catch(err => {
    console.log("Failed to start");
})