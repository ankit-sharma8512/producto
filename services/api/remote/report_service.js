const RestClient = require("../../../tools/zookeeper/rest_client");
const HTTPError  = require("../utils/error");

const methods = {};
const client  = new RestClient('report');

methods.downloadBill = async function (id) {
    const url = client.getUrl(`/report/bill/${id}`);
    
    const response = await fetch(url);

    if (!response.ok)
        throw new HTTPError(400, 'ERR_FAILED', 'failed to generate pdf');

    return response;
}

module.exports = methods;