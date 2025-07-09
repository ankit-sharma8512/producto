const RestClient = require("../../../tools/zookeeper/rest_client");

const methods = {};
const client  = new RestClient('product');

methods.ping = async function () {
    const res = await client.get(`/ping`);
    return res.data;
}

methods.list = async function (query={}) {
    const res = await client.get(`/list?${new URLSearchParams(query).toString()}`);
    return res;
}

methods.create = async function (data) {
    const res = await client.post(`/create`, data);
    return res;
}

methods.detail = async function (id) {
    const res = await client.get(`/detail/${id}`);
    return res;
}

methods.update = async function (id, data) {
    const res = await client.put(`/update/${id}`, data);
    return res;
}

methods.delete = async function (id) {
    const res = await client.delete(`/delete/${id}`);
    return res;
}

methods.getLots = async function (query={}) {
    const res = await client.get(`/list/lot?${new URLSearchParams(query).toString()}`);
    return res;
}

methods.getAvailable = async function (id) {
    const res = await client.get(`/available/${id}`);
    return res;
}

methods.getGrnList = async function (query = {}) {
    const res = await client.get(`/grn/list?${new URLSearchParams(query).toString()}`);

    return res;
}

methods.createGrn = async function (data) {
    const res = await client.post(`/grn/create`, data);

    return res;
}

module.exports = methods;