#!/bin/bash

set -e

/producto/wait-for-it.sh ${ZOOKEEPER_HOST}:2181 --timeout=180
/producto/wait-for-it.sh ${ELASTIC_HOST} --timeout=180
/producto/wait-for-it.sh ${KAFKA_SEED_BROKER} --timeout=180


exec "$@"