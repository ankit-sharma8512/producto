const ElasticEngine = require("../../../database/elasticsearch/src/elastic-engine")

const INDEX = 'products'

const methods = {
    'CREATE' : async function(payload) {
        if(Array.isArray(payload)) payload = payload[0];
        // console.log(payload)
        await ElasticEngine.upsertDoc(INDEX, payload.id, payload);
    },
    'UPDATE' : async function(payload) {
        if(Array.isArray(payload)) payload = payload[0];
        await ElasticEngine.upsertDoc(INDEX, payload.id, payload);
    },
    'DELETE' : async function(payload) {
        if(Array.isArray(payload)) payload = payload[0];
        await ElasticEngine.deleteDoc(INDEX, payload.id);
    }
};

async function handler(message) {
    const data = JSON.parse(message);
    await methods[data?.action]?.(data.payload);
}

module.exports = handler;