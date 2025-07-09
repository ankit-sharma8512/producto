from pyflink.datastream       import KeyedProcessFunction, OutputTag
from pyflink.datastream.state import ValueStateDescriptor, ListStateDescriptor
from pyflink.common.typeinfo  import Types

from validate                 import error_tag
import json

purchase_tag = OutputTag("PURCHASE", Types.TUPLE([Types.STRING(), Types.STRING()]))
order_tag    = OutputTag("ORDER",    Types.TUPLE([Types.STRING(), Types.STRING(), Types.STRING()]))
grn_tag      = OutputTag("GRN",      Types.TUPLE([Types.STRING(), Types.STRING()]))

stock_tag    = OutputTag("STOCK", Types.TUPLE([Types.STRING(), Types.STRING(), Types.INT(), Types.DOUBLE()]))

class UpdateStock(KeyedProcessFunction):
    def open(self, runtime_context):
        available_state = ValueStateDescriptor("available", Types.INT())
        reserved_state  = ValueStateDescriptor("reserved",  Types.INT())

        self.available = runtime_context.get_state(available_state)
        self.reserved  = runtime_context.get_state(reserved_state)

    def process_element(self, value, ctx):
        try:
            product_id, action, quantity, data = value

            available = self.available.value() or 0
            reserved  = self.reserved.value()  or 0

            if action == "PURCHASE":
                available += quantity
                self.available.update(available)

                yield purchase_tag, (product_id, data) # sink to lots tables
                yield (product_id, available, data) # sink for available update
            
            elif action == "GRN":
                type = json.loads(data)['type']

                if type == 'positive':
                    available += quantity
                elif available >= quantity:
                    available -= quantity

                self.available.update(available)

                yield grn_tag, (product_id, data)
                yield (product_id, available, data) # sink for available update

            elif action == "ORDER":
                if available < quantity:
                    # not enough stock to order
                    yield order_tag, (product_id, "FAILED", data)
                else:
                    available -= quantity
                    reserved  += quantity

                    self.available.update(available)
                    self.reserved.update(reserved)

                    yield order_tag, (product_id, "RESERVED", data)

            elif action == "DEDUCT":
                reserved -= quantity
                self.reserved.update(reserved)

                yield (product_id, available, data)

            elif action == "RELEASE":
                reserved  -= quantity
                available += quantity

                self.available.update(available)
                self.reserved.update(reserved)

        except Exception as e:
            yield error_tag, "Error: "+str(e)

class ProcessOrder(KeyedProcessFunction):
    def open(self, runtime_context):
        # productid, quantity
        products_state = ListStateDescriptor("products", Types.TUPLE([Types.STRING(), Types.INT(), Types.DOUBLE()]))
        total_state    = ValueStateDescriptor("count", Types.INT())
        seen_state     = ValueStateDescriptor("seen", Types.INT())
        finish_state   = ValueStateDescriptor("finished", Types.BOOLEAN())

        self.products = runtime_context.get_list_state(products_state)
        self.total    = runtime_context.get_state(total_state)
        self.seen     = runtime_context.get_state(seen_state)
        self.finished = runtime_context.get_state(finish_state)

    def handle_reject(self, orderid):
        products = self.products.get()

        for product_id, quantity, rate in products:
            yield stock_tag, (product_id, "RELEASE", quantity, rate)

        yield (orderid, "REJECTED")

    def handle_success(self, orderid):
        products = self.products.get()

        for product_id, quantity, rate in products:
            yield stock_tag, (product_id, "DEDUCT", quantity, rate)

        yield (orderid, "ACCEPTED")

    def process_element(self, value, ctx):
        # value - (orderid, productid, quantity, status, count, data)
        try:
            if self.finished.value(): # skip if already finished
                return

            orderid, productid, quantity, status, count, rate = value

            if self.total.value() is None:
                self.finished.update(False)
                self.total.update(count)
                ctx.timer_service().register_processing_time_timer(
                    ctx.timer_service().current_processing_time() + 60_000
                )

            total = self.total.value() or count
            seen  = self.seen.value() or 0

            if status == "RESERVED":
                seen += 1
                self.products.add((productid, quantity, rate))
                self.seen.update(seen)

                if seen == total:
                    yield from self.handle_success(orderid)
                    self.finished.update(True)

            else:
                yield from self.handle_reject(orderid)
                self.finished.update(True)

        except Exception as e:
            yield error_tag, "Error: "+str(e)

    def on_timer(self, timestamp, ctx):
        total = self.total.value() or 0
        seen  = self.seen.value() or 0

        if self.finished.value() or seen >= total:
            self.clear_state()
            return

        orderid = ctx.get_current_key()
        yield from self.handle_reject(orderid)
        self.finished.update(True)
        self.clear_state()

    def clear_state(self):
        self.products.clear()
        self.total.clear()
        self.seen.clear()
        self.finished.clear()