from pyflink.datastream                  import StreamExecutionEnvironment, ExternalizedCheckpointCleanup
from pyflink.common.typeinfo             import Types
from pyflink.common                      import Configuration

from kafka_source                        import kafka_source_consumer
from validate                            import Validate, error_tag
from parsers                             import parse_action_message, \
                                                parse_stock_message, stock_message_type, \
                                                parse_lot_message, lot_message_type, \
                                                parse_order_message, order_message_type, \
                                                parse_stock_update_message, parse_order_update_message, \
                                                parse_grn_message, grn_message_type, \
                                                parse_sale_message, sale_message_type, \
                                                parse_return_message, return_message_type
from processors                          import UpdateStock, ProcessOrder, purchase_tag, order_tag, stock_tag, grn_tag, sale_tag, return_tag
from sinks                               import stock_sink, lot_sink, stock_updates_sink, order_updates_sink, grn_sink, sale_sink, return_sink

def main():
    config = Configuration()
    config.set_string('state.backend.type', 'rocksdb')
    config.set_string('execution.checkpointing.storage', 'filesystem')
    config.set_string('execution.checkpointing.dir', 'file:///tmp/flink/state')
    config.set_string('state.checkpoint-storage', 'filesystem')
    config.set_string('state.checkpoints.dir', 'file:///tmp/flink/state')

    env = StreamExecutionEnvironment.get_execution_environment(config)
    env.set_parallelism(1)
    env.enable_checkpointing(60000) 
    env.get_checkpoint_config().enable_externalized_checkpoints(ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION)

    base_stream  = env.add_source(kafka_source_consumer)
    base_stream  = base_stream.process(Validate(), output_type=Types.STRING())
    error_stream = base_stream.get_side_output(error_tag)
    error_stream.print()

    update_stream = base_stream.map(
        lambda data : parse_action_message(data),
        output_type = Types.TUPLE([Types.STRING(), Types.STRING(), Types.INT(), Types.STRING()]) # pid, action, quantity, <data>
    )

    update_stream = update_stream.key_by(lambda x : x[0]) # key by product id
    update_stream = update_stream.process(UpdateStock())

    # sink to update available first
    stock_stream  = update_stream.map(lambda x: parse_stock_message(x), output_type=stock_message_type)
    stock_stream.add_sink(stock_sink)

    # get the side outputs to their respective places
    purchase_stream = update_stream.get_side_output(purchase_tag)
    order_stream    = update_stream.get_side_output(order_tag)
    grn_stream      = update_stream.get_side_output(grn_tag)
    return_stream   = update_stream.get_side_output(return_tag)

    # get the purchase stream and add its lots
    purchase_stream = purchase_stream.map(lambda x: parse_lot_message(x), output_type=lot_message_type)
    purchase_stream.add_sink(lot_sink)

    # get the grn stream and sink to postgres
    grn_stream = grn_stream.map(lambda x:parse_grn_message(x), output_type=grn_message_type)
    grn_stream.add_sink(grn_sink)

    # send updates to sale lot to update return
    return_stream = return_stream.map(lambda x:parse_return_message(x), output_type=return_message_type)
    return_stream.add_sink(return_sink)

    # get the order stream and send it to order aggregator
    order_stream = order_stream.map(lambda x: parse_order_message(x), output_type=order_message_type)
    order_stream = order_stream.key_by(lambda x:x[0]) # key by order id

    order_stream = order_stream.process(ProcessOrder())
    # order_stream.print()

    # # update the stock orders DEDUCT or RELEASE as given by sending it again to kafka stock-updates topic
    product_update_stream = order_stream.get_side_output(stock_tag)
    product_update_stream = product_update_stream.map(lambda x:parse_stock_update_message(x), output_type=Types.STRING())
    product_update_stream.sink_to(stock_updates_sink)

    # send the sale data to sale table
    sale_stream = order_stream.get_side_output(sale_tag)
    # sale_stream.print()
    sale_stream = sale_stream.map(lambda x:parse_sale_message(x), output_type=sale_message_type)
    sale_stream.add_sink(sale_sink)

    # # finally send the order update to kafka topic
    order_stream = order_stream.map(lambda x:parse_order_update_message(x), output_type=Types.STRING())
    order_stream.sink_to(order_updates_sink)

    env.execute("Stock Processor")

if __name__ == "__main__":
    main()