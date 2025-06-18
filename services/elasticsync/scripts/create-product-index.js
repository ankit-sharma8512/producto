#!/usr/bin/env node
const ElasticEngine = require("../../../database/elasticsearch/src/elastic-engine");
const Config        = require("../../../tools/config/config")

const INDEX_NAME   = "products";
const MAPPING      = require("../mapping/product-mapping.json");

async function main() {
    Config.read("/producto/services/elasticsync/config.json");
    const res = await ElasticEngine.initialize(Config.get('elastic-host'));

    await ElasticEngine.createIndex(INDEX_NAME);
    await ElasticEngine.updateMapping(INDEX_NAME, MAPPING);
    
    console.log("Product index created successfully");
}

main().catch(err => {
    console.error(err?.response?.data || err)
    console.log("Failed to execute script")
})