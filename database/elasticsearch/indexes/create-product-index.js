#!/usr/bin/env node

const ElasticEngine = require("../src/elastic-engine");

const INDEX_NAME   = "products";
const MAPPING      = require("../mappings/product-mapping.json");

async function main() {
    try {

        if(!process.env.ELASTIC_HOST)
            throw new Error("Elastic Host is missing");
        
        await ElasticEngine.initialize(process.env.ELASTIC_HOST);
        
        await ElasticEngine.createIndex(INDEX_NAME);
        await ElasticEngine.updateMapping(INDEX_NAME, MAPPING);
        
        console.log("Product index created successfully");
    }
    catch(err) {
        const res = err?.response?.data;
        if(res)
            console.log(res.error?.root_cause?.[0]?.reason || "Failed to create indexes");
        else {
            console.log(err)
            console.log("Failed to create indexes");
        }
    }
}

main()