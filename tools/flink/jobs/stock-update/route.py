from pyflink.datastream      import ProcessFunction, OutputTag
from pyflink.common.typeinfo import Types
import json

# Side output tags
purchase_tag = OutputTag("PURCHASE", Types.STRING())
error_tag    = OutputTag("ERROR",    Types.STRING())

class ActionRouter(ProcessFunction):
    def process_element(self, value, ctx):
        try:
            parsed = json.loads(value)
            action = parsed["action"]

            if action == "PURCHASE":
                yield purchase_tag, value
            else:
                yield error_tag, "Undefined action"
        except Exception as e:
            yield error_tag, "Error: "+e