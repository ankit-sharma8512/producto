from pyflink.datastream      import ProcessFunction, OutputTag
from pyflink.common.typeinfo import Types

import json

error_tag = OutputTag("ERROR", Types.STRING())

valid_tags = ["PURCHASE", "ORDER", "DEDUCT", "RELEASE", "GRN", "RETURN"]

class Validate(ProcessFunction):
    def process_element(self, value, ctx):
        try:
            parsed = json.loads(value)
            action = parsed['action']

            if action in valid_tags:
                yield value
            else:
                yield error_tag, "Invalid Action Tag"

        except Exception as e:
            yield error_tag, "Error: +" + str(e)