const Application = require("./src/app");
const Config      = require("../../tools/config/config");

const CONFIG_PATH = '/producto/services/trade/config.json';

async function main() {
    await Config.read(CONFIG_PATH);

    Application.initialize();
    Application.start();
}

main().catch(err => {
    console.log(err);
    console.log("Failed to start");
})