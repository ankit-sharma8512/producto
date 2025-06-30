flink run -pyFiles stock-update/kafka_source.py,stock-update/route.py,stock-update/parsers.py,stock-update/processors.py,stock-update/sinks.py \
    --python stock-update/main.py