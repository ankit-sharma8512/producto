from pyflink.datastream.connectors.kafka import FlinkKafkaConsumer
from pyflink.common.serialization        import SimpleStringSchema

BOOTSTRAP_SERVER = 'kafka:9092'
SOURCE_TOPIC     = 'stock-updates'

kafka_props = {
    'bootstrap.servers' : BOOTSTRAP_SERVER,
    'group.id'          : 'stock-update',
    'auto.offset.reset' : 'earliest',
    'isolation.level'   : 'read_committed'
}

kafka_source_consumer = FlinkKafkaConsumer(
    topics                 = SOURCE_TOPIC,
    deserialization_schema = SimpleStringSchema(),
    properties             = kafka_props
)