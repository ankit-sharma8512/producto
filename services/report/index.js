const Config         = require("../../tools/config/config");
const ZRegister      = require("../../tools/zookeeper/register");
const Application    = require("./src/app");
const ServiceManager = require("../../tools/zookeeper/service_manager");
const SERVICES    = [
    {
        key   : 'product',
        znode : '/service/product'
    },
    {
        key   : 'trade',
        znode : '/service/trade'
    }
]

const CONFIG_PATH      = '/producto/services/report/config.json';
let znode;

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

    // Initiate service discovery
    ServiceManager.initiate(SERVICES).catch(err => {
        console.log("Failed to connect to zookeeper. wont be able to make service requests");
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