const products = require("../../../products.json");
const TProducer     = require("../../../tools/kafka/transactional-producer");

const purchaseId = '6866c5ad327a2b480085886c'
const orderId = '6866c7223260891c33957362'
const STOCK_TOPIC = 'stock-updates';

class OrderController {
    static async test(req, res) {
        try {
            const messages = products.map(p => ({
                purchaseId,
                date   : new Date().toISOString(),
                action : "PURCHASE",
                pid      : p.id,
                quantity : 20,
                price    : p.mrp*0.65,
                mfgDate  : null,
                expDate  : null
            })).map(m => ({ key: m.pid, value: JSON.stringify(m) }));

            await TProducer.publish(STOCK_TOPIC, messages);

            return res.json(messages);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async test2(req, res) {
        try {
            const q = [2,2,2,2]
            const messages = products.map((p,i) => ({
                orderId,
                date     : new Date().toISOString(),
                action   : "ORDER",
                pid      : p.id,
                quantity : q[i],
                rate     : p.mrp*0.75,
                count    : products.length+1
            }))
            .map(m => ({ key: m.pid, value: JSON.stringify(m) }));

            await TProducer.publish(STOCK_TOPIC, messages);

            return res.json(messages);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = OrderController;