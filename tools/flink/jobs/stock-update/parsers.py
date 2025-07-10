from pyflink.common.typeinfo import RowTypeInfo, Types
from pyflink.common          import Row

from datetime import datetime, timezone
import json

def parse_action_message(data):
    try:
        parsed = json.loads(data)
        return (parsed["pid"], parsed["action"], int(parsed["quantity"]), data)
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
    ['productid', 'purchaseid', 'date', 'quantity', 'mfgdate', 'expdate', 'price'],
    [Types.STRING(), Types.STRING(), Types.STRING(), Types.INT(), Types.STRING(), Types.STRING(), Types.FLOAT()]
)
def parse_lot_message(data):
    try:
        parsed = json.loads(data[1])
        return Row(
            productid  = data[0],
            purchaseid = parsed['purchaseId'],
            date       = parsed['date'],
            quantity   = int(parsed['quantity']),
            mfgdate    = parsed['mfgDate'],
            expdate    = parsed['expDate'],
            price      = float(parsed['price']),
        )
    except Exception as e:
        print("Bad stock update message received")
        return

# order_id, product_id, quantity, state, count, data [count-> total count of orders]
order_message_type = Types.TUPLE([Types.STRING(), Types.STRING(), Types.INT(), Types.STRING(), Types.INT(), Types.STRING()])
def parse_order_message(data):
    try:
        parsed = json.loads(data[2])
        return (parsed['orderId'], data[0], int(parsed['quantity']), data[1], int(parsed['count']), data[2])
    except Exception as e:
        print("Bad order update message received")
        return

def parse_stock_update_message(data):
    try:
        pid, action, quantity = data
        return json.dumps({
            "pid"      : pid,
            "action"   : action,
            "quantity" : quantity
        })
    except Exception as e:
        return None

def parse_order_update_message(data):
    try:
        orderid, state = data
        return json.dumps({
            "orderId"   : orderid,
            "state"     : state,
            "timestamp" : datetime.now(timezone.utc).isoformat()
        })
    except Exception as e:
        return None
    

grn_message_type = Types.ROW_NAMED(
    ['productid', 'quantity', 'type'],
    [Types.STRING(), Types.INT(), Types.STRING()]
)
def parse_grn_message(data):
    try:
        parsed = json.loads(data[1])
        return Row(productid=data[0], quantity=int(parsed['quantity']), type=parsed['type'])
    except Exception as e:
        return None
    
sale_message_type = Types.ROW_NAMED(
    ['productid', 'orderid', 'date', 'quantity', 'rate', 'cgst', 'sgst', 'discount'],
    [Types.STRING(), Types.STRING(), Types.STRING(), Types.INT(), Types.DOUBLE(), Types.DOUBLE(), Types.DOUBLE(), Types.DOUBLE()]
)
def parse_sale_message(data):
    try:
        parsed = json.loads(data[2])
        return Row(
            productid = data[0],
            orderid   = data[1],
            date      = parsed['date'],
            quantity  = int(parsed['quantity']),
            rate      = float(parsed['rate']),
            cgst      = float(parsed['cgst']),
            sgst      = float(parsed['sgst']),
            discount  = float(parsed['discount'])
        )
    except Exception as e:
        return None