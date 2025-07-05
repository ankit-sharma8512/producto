const zookeeper = require("node-zookeeper-client");

class Discover {
    #zhost;   // zookeeper server to ask for a service
    #client;

    constructor(host) {
        if(!host)
            throw new Error("Invalid config");

        this.#zhost   = host;
        // initialize a client
        this.#client  = zookeeper.createClient(host);
    }

    connect() {
        let timeout;
        return new Promise((resolve, reject) => {
            this.#client.once('connected', () => {
                clearTimeout(timeout);
                resolve()
            });

            this.#client.connect();
            timeout = setTimeout(() => {
                console.log("Timed out on zookeeper connection")
                reject();
            }, 5000);
        })
    }

    async #getChildren(path, watcher) {
        return new Promise((resolve, reject) => {
            this.#client.exists(path, (ev) => {
                    watcher()
                }, (err, stat) => {
                    if(err) reject(err);
                    if(!stat) resolve([]);

                    this.#client.getChildren(path, (ev) => {
                        watcher();
                    }, (err, children) => {
                        if(err) reject(err);

                        resolve(children);
                    });
            });
        });
    }

    async #getAddresses(path, children) {
        let addresses = children.map(child => new Promise((resolve, reject) => {
            this.#client.getData(path + '/' + child, (err, data) => {
                if(err) reject(err);

                resolve(data.toString());
            })
        }));

        addresses = await Promise.all(addresses);
        return addresses;
    }

    async discover(path, onChange) {
        const children  = await this.#getChildren(path, () => this.discover(path, onChange));
        const addresses = await this.#getAddresses(path, children);

        onChange(addresses);
    }
};

module.exports = Discover;