#!/bin/sh

# Run knex migrations for product db
cd /producto/database/productdb
npm run migrate

# Create Elasticsearch indexes
cd /producto/database/elasticsearch
node ./indexes/create-product-index.js

# Create kafka topics
cd /producto/tools/kafka
node ./create-topics.js

echo "System setup run complete"