#!/bin/bash

set -e

/producto/wait-for-it.sh ${ZOOKEEPER_HOST}:2181 --timeout=180
/producto/wait-for-it.sh ${ELASTIC_HOST} --timeout=180
/producto/wait-for-it.sh ${DB_HOST}:5432 --timeout=180
/producto/wait-for-it.sh ${KAFKA_SEED_BROKER} --timeout=180
/producto/wait-for-it.sh ${PRODUCT_CACHE_HOST}:6379 --timeout=180

exec "$@"