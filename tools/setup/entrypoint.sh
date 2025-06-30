#!/bin/sh

set -e
# Run knex migrations for product db
/producto/wait-for-it.sh ${DB_HOST}:5432 --timeout=180
cd /producto/database/productdb
npm run migrate

# Create Elasticsearch indexes
/producto/wait-for-it.sh ${ELASTIC_HOST} --timeout=180
cd /producto/database/elasticsearch
node ./indexes/create-product-index.js

# Create kafka topics
/producto/wait-for-it.sh ${KAFKA_SEED_BROKER} --timeout=180
cd /producto/tools/kafka
node ./create-topics.js

echo "System setup run complete"