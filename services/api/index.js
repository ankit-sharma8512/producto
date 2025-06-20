const Config         = require("../../tools/config/config");
const App            = require("./src/app");
const ServiceManager = require("./remote/service_manager");

const CONFIG_PATH = "/producto/services/api/config.json";
const SERVICES    = [{
    key   : 'product',
    znode : '/service/product'
}]

async function main() {
    // read and store config
    Config.read(CONFIG_PATH);

    // Initiate service discovery
    ServiceManager.initiate(SERVICES).catch(err => {
        console.log("Failed to connect to zookeeper. wont be able to make service requests");
    });

    // Express app
    const app = new App();
    app.start(Config.get('port'));
}

main().catch(err => {
    console.error(err);
    console.log("Error starting");
})