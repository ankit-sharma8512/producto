const fs = require("fs");

class Config {
    static config;

    static read(path='') {
        if(!path) throw new Error("Missing config path");

        if(!fs.existsSync(path)) throw new Error("Invalid config path");

        let template = fs.readFileSync(path, "utf-8");
        template     = template.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || '');

        this.config  = JSON.parse(template);

        return this.config;
    }

    static get(key) {
        if(!key || !this.config[key]) return '';

        return this.config[key];
    }
}

module.exports = Config