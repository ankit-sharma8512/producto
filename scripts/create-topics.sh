#!/bin/bash

NAME=$1
CONTAINER_NAME=kafka
KAFKA_SERVER=localhost:9092
SCRIPT_LOC=/opt/kafka/bin/kafka-topics.sh

if [ -z "$NAME" ]; then
    echo "Topic name not given"
    exit 1
fi

CHECK_EXISTS=$(docker exec -i "$CONTAINER_NAME" "$SCRIPT_LOC" --bootstrap-server "$KAFKA_SERVER" --list | grep -w "$NAME")

if [ -n "$CHECK_EXISTS" ]; then
    echo "Topic "$NAME" already exists"
    exit 0
fi

docker exec -i "$CONTAINER_NAME" \
    "$SCRIPT_LOC" --create \
    --bootstrap-server "$KAFKA_SERVER" \
    --topic "$NAME" \
    --partitions 1 \
    --replication-factor 1

echo "Topic $NAME created successfully"