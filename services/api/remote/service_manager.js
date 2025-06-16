const ZDiscover = require("../../../tools/zookeeper/discover");
const Config    = require("../../../tools/config/config");

// Responsible to query and hold addresses of remote services
class ServiceManager {
    static discoverer;
    static addressMap = {};

    static save(key, addresses) {
        if(addresses?.length <= 0) return;

        console.log(`Service Discovery Update: ${key}=${addresses.join(',')}`);
        this.addressMap[key] = addresses;
    }

    // Service Discovery
    static async initiate(services = []) {
        this.discoverer = new ZDiscover(Config.get('zookeeper-host')+':2181');

        await this.discoverer.connect();

        console.log("Initiating service discovery");
        for(const { key, znode } of services) {
            // start and watch discovery of this node
            this.discoverer.discover(znode, (d) => this.save(key, d));
        }
    }

    static get(key) {
        if(!this.addressMap[key]) return [];

        return this.addressMap[key];
    }
}

module.exports = ServiceManager;