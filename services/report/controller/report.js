const HTTPError     = require("../utils/error");
const RestClient    = require("../../../tools/zookeeper/rest_client");
const PDFEngine     = require("../pdf-engine/index.js").default;

const trade         = new RestClient('trade');

class ReportController {
    static async downloadBill(req, res) {
        try {
            const { id } = req.params;

            const data    = await trade.get(`/order/detail/${id}`);
            const {order} = await trade.get(`/order/item/${id}`)
            data.order   = order;

            const stream = await PDFEngine.generatePDFStream('bill', data);

            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = ReportController;