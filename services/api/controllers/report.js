const HTTPError  = require("../utils/error");
const report     = require("../remote/report_service");
const {Readable} = require('stream')

class ReportController {
    static async downloadBill(req, res) {
        try {
            const {id}     = req.params;
            const response = await report.downloadBill(id);

            res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');

            const nodeStream = Readable.fromWeb(response.body);
            nodeStream.pipe(res);
        }
        catch(err) {
            console.log(err);
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = ReportController;