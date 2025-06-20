const Admin = require("./admin");

const TOPICS = [
    {
        topic: 'product-changes'
    }
]

async function main() {
    try {
        if(!process.env.KAFKA_SEED_BROKER)
            throw new Error("Kafka seed broker is missing");

        await Admin.initiate(process.env.KAFKA_SEED_BROKER);

        const isCreated = await Admin.createTopics(TOPICS);

        if(!isCreated)
            console.log("Topics already exists");
        else
            console.log("Kafka topics created successfully");
        
    } catch (err) {
        console.error(err);
        console.log("Failed to create topics");
    }
    finally {
        await Admin.disconnect();
    }
}

main();