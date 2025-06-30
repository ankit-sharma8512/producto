from pyflink.datastream                  import StreamExecutionEnvironment, ExternalizedCheckpointCleanup
from pyflink.common.typeinfo             import Types
from pyflink.common                      import Configuration

from kafka_source                        import kafka_source_consumer
from route                               import purchase_tag, error_tag, ActionRouter
from parsers                             import parse_purchase_message, parse_stock_message, parse_lot_message
from parsers                             import stock_message_type, lot_message_type
from processors                          import UpdateAvailable
from sinks                               import stock_sink, lot_sink

def main():
    config = Configuration()
    config.set_string('state.backend.type', 'rocksdb')
    config.set_string('execution.checkpointing.storage', 'filesystem')
    config.set_string('execution.checkpointing.dir', 'file:///opt/flink/state')

    env = StreamExecutionEnvironment.get_execution_environment(config)
    env.set_parallelism(1)
    env.enable_checkpointing(60000) 
    env.get_checkpoint_config().enable_externalized_checkpoints(ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION)

    base_stream = env.add_source(kafka_source_consumer)
    base_stream = base_stream.process(ActionRouter(), Types.STRING())

    # All Side Streams
    purchase_stream = base_stream.get_side_output(purchase_tag)
    error_stream    = base_stream.get_side_output(error_tag)

    # Process all side streams
    error_stream.print()

    purchase_stream = purchase_stream.map(
        lambda data : parse_purchase_message(data),
        output_type = Types.TUPLE([Types.STRING(), Types.INT(), Types.STRING()])
    )
    purchase_stream = purchase_stream.key_by(lambda x : x[0])
    purchase_stream = purchase_stream.process(UpdateAvailable(), output_type=Types.TUPLE([Types.STRING(), Types.INT(), Types.STRING()]))

    # purchase_stream.print()
    stock_stream = purchase_stream.map(lambda x: parse_stock_message(x), output_type=stock_message_type)
    lot_stream   = purchase_stream.map(lambda x: parse_lot_message(x), output_type=lot_message_type)

    # inventory_stream.print()
    # lot_stream.print()
    stock_stream.add_sink(stock_sink)
    lot_stream.add_sink(lot_sink)

    env.execute("Stock Processor")

if __name__ == "__main__":
    main()