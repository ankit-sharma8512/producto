from pyflink.common.typeinfo import RowTypeInfo, Types
from pyflink.common          import Row
import json

def parse_purchase_message(data):
    try:
        parsed = json.loads(data)
        return (parsed["pid"], int(parsed["quantity"]), data)
    except Exception as e:
        print("Bad stock update message received")
        return

stock_message_type = Types.ROW_NAMED(
    ['id', 'available'],
    [Types.STRING(), Types.INT()]
)
def parse_stock_message(data):
    try:
        return Row(id=data[0], available=int(data[1]))
    except Exception as e:
        print("Bad stock update message received")
        return

lot_message_type = Types.ROW_NAMED(
    ['productid', 'purchaseid', 'date', 'quantity', 'mfgdate', 'expdate', 'price', 'type'],
    [Types.STRING(), Types.STRING(), Types.STRING(), Types.INT(), Types.SQL_TIMESTAMP(), Types.SQL_TIMESTAMP(), Types.INT(), Types.STRING()]
)
def parse_lot_message(data):
    try:
        parsed = json.loads(data[2])
        return Row(
            productid  = data[0],
            purchaseid = parsed['purchaseId'],
            date       = parsed['date'],
            quantity   = int(parsed['quantity']),
            mfgdate    = parsed['mfgDate'],
            expdate    = parsed['expDate'],
            price      = int(parsed['price']),
            type       = parsed.get('type', 'purchase')
        )
    except Exception as e:
        print("Bad stock update message received")
        return
    