from pyflink.datastream       import KeyedProcessFunction
from pyflink.datastream.state import ValueStateDescriptor
from pyflink.common.typeinfo  import Types
import json

class UpdateAvailable(KeyedProcessFunction):
    def open(self, runtime_context):
        availableState = ValueStateDescriptor("available", Types.INT())
        self.available = runtime_context.get_state(availableState)

    def process_element(self, value, ctx):
        try:
            product_id = value[0]
            available  = self.available.value() or 0
            quantity   = value[1]

            available += quantity

            self.available.update(available)
            yield (product_id, available, value[2])

        except Exception as e:
            print("Failed to process stock update (SKIPPING):", e)
            return