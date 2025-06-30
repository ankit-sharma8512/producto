from pyflink.datastream                  import StreamExecutionEnvironment
from pyflink.common.serialization        import SimpleStringSchema
from pyflink.datastream.connectors.kafka import FlinkKafkaConsumer

def main():
    env = StreamExecutionEnvironment.get_execution_environment()
    env.set_parallelism(1)

    kafka_props = {
        'bootstrap.servers' : 'kafka:9092',
        'group.id'          : 'stock-update',
        'auto.offset.reset' : 'earliest'
    }

    consumer = FlinkKafkaConsumer(
        topics                 = 'stock-updates',
        deserialization_schema = SimpleStringSchema(),
        properties             = kafka_props
    )

    stream = env.add_source(consumer)

    stream.print()

    env.execute("Simple")

if __name__ == "__main__":
    main()