const zookeeper = require("node-zookeeper-client");

class ZRegister {
    #zhost;   // zookeeper server
    #path;    // path to all equivalent services (/service/product) [joined with id below]
    #id;      // current node id (prod1)
    #address; // current node address 

    #client;

    constructor(host, path, id, address) {
        if(!host || !path || !address)
            throw new Error("Invalid config");

        // this ephemeral(leaf) znode id and address to register to zookeeper
        this.#zhost   = host;
        this.#path    = path;

        this.#id      = id;
        this.#address = address;

        // initialize a client
        this.#client  = zookeeper.createClient(host);
    }

    async #createPath() {
        return new Promise((resolve, reject) => {
            this.#client.exists(this.#path, (err, stat) => {
                if(err) return reject(err);
                // if the node path already exists dont recreate it

                if(stat) return resolve();

                // otherwise create a path for this service
                this.#client.mkdirp(this.#path, (err) => {
                    if(err) return reject(err);
                    
                    resolve();
                });
            });
        });
    }

    async #createNode() {
        return new Promise((resolve, reject) => {
            const pathId = this.#path + '/' + this.#id;
                this.#client.create(pathId, Buffer.from(this.#address), zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, (err) => {
                    if(err) return reject(err);
                    
                    resolve();
                });
        });
    }

    async connectAndRegister() {
        return new Promise((resolve, reject) => {
            let timeout;
            this.#client.once('connected', async () => {
                clearTimeout(timeout);
                try {
                    await this.#createPath();
                    await this.#createNode();
                    return resolve();
                }
                catch(err) {
                    return reject(err);
                }
            });

            this.#client.connect();
            timeout = setTimeout(() => reject(new Error("Timeout on connecting to zookeeper")), 6000);
        });
    }

    async closeConnection() {
        this.#client.close();
    }
}

module.exports = ZRegister;