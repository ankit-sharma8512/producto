from pyflink.datastream                  import StreamExecutionEnvironment
from pyflink.datastream.connectors.kafka import FlinkKafkaConsumer
from pyflink.datastream                  import KeyedProcessFunction, OutputTag
from pyflink.datastream.state            import ValueStateDescriptor
from pyflink.common.serialization        import SimpleStringSchema
from pyflink.common.typeinfo             import Types

import                                          json

# Side output tags
purchase_tag = OutputTag("purchase", Types.STRING())

def parse_message(data):
    try:
        parsed = json.loads(data)
        return (parsed["productId"], parsed["action"], int(parsed["quantity"]))
    except Exception as e:
        print("Bad stock update message received")
        return
    
class UpdateStock(KeyedProcessFunction):
    def open(self, runtime_context):
        availableState = ValueStateDescriptor("available", Types.INT())
        self.available = runtime_context.get_state(availableState)

    def process_element(self, value, ctx):
        product_id, action, quantity = value

        will_pass = True
        available = self.available.value() or 0

        if action == "ADD":
            will_pass = False
            available += quantity
        elif action == "DEDUCT":
            will_pass = False
            available -= quantity

        if will_pass:
            pass
        else:
            self.available.update(available)
            yield (product_id, available)


def main():
    env = StreamExecutionEnvironment.get_execution_environment()
    env.set_parallelism(1)

    kafka_props = {
        'bootstrap.servers' : 'kafka:9092',
        'group.id'          : 'stock-update',
        'auto.offset.reset' : 'earliest',
        'isolation.level'   : 'read_committed'
    }

    consumer = FlinkKafkaConsumer(
        topics                 = 'stock-updates',
        deserialization_schema = SimpleStringSchema(),
        properties             = kafka_props
    )

    stream = env.add_source(consumer)

    # stream = stream.map(
    #     lambda data: parse_message(data),
    #     output_type=Types.TUPLE([Types.STRING(), Types.STRING(), Types.INT()]) # productId, action, quantity
    # )
    # stream = stream.key_by(lambda x : x[0]) # key by productId
    # stream = stream.process(UpdateStock(), output_type=Types.TUPLE([Types.STRING(), Types.INT()])) # productId, available

    stream.print()

    env.execute("Stock Update Processor")

if __name__ == "__main__":
    main()