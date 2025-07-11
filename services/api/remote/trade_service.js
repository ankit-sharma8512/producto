const RestClient = require("../../../tools/zookeeper/rest_client");

const methods = {};
const client  = new RestClient('trade');

// Purchase API's

methods.getPurchases = async function (query = {}) {
    const res = await client.get(`/purchase/list?${new URLSearchParams(query).toString()}`);

    return res;
}

methods.getPurchaseDetail = async function (id) {
    const res = await client.get(`/purchase/detail/${id}`);

    return res;
}

methods.createPurchase = async function (data) {
    const res = await client.post(`/purchase/create`, data);

    return res;
}

methods.updatePurchase = async function (id, data) {
    const res = await client.put(`/purchase/update/${id}`, data);

    return res;
}

methods.deletePurchase = async function (id) {
    const res = await client.delete(`/purchase/delete/${id}`);

    return res;
}

methods.markComplete = async function (id) {
    const res = await client.post(`/purchase/complete/${id}`);

    return res;
}

methods.getPurchaseOrders = async function (id) {
    const res = await client.get(`/purchase/order/${id}`);

    return res;
}

methods.addPurchaseOrder = async function (id, data) {
    const res = await client.post(`/purchase/order/${id}`, data);

    return res;
}

methods.updatePurchaseOrder = async function (id, data) {
    const res = await client.put(`/purchase/order/${id}`, data);

    return res;
}

methods.deletePurchaseOrder = async function (id, pid) {
    const res = await client.delete(`/purchase/order/${id}/${pid}`);

    return res;
}

// Order API's

methods.getOrders = async function (query = {}) {
    const res = await client.get(`/order/list?${new URLSearchParams(query).toString()}`);

    return res;
}

methods.getOrderDetail = async function (id) {
    const res = await client.get(`/order/detail/${id}`);

    return res;
}

methods.createOrder = async function (data) {
    const res = await client.post(`/order/create`, data);

    return res;
}

methods.updateOrder = async function (id, data) {
    const res = await client.put(`/order/update/${id}`, data);

    return res;
}

methods.deleteOrder = async function (id) {
    const res = await client.delete(`/order/delete/${id}`);

    return res;
}

// methods.markComplete = async function (id) {
//     const res = await client.post(`/purchase/complete/${id}`);

//     return res;
// }

methods.getOrderItems = async function (id) {
    const res = await client.get(`/order/item/${id}`);

    return res;
}

methods.addOrderItem = async function (id, data) {
    const res = await client.post(`/order/item/${id}`, data);

    return res;
}

methods.updateOrderItem = async function (id, data) {
    const res = await client.put(`/order/item/${id}`, data);

    return res;
}

methods.removeOrderItem = async function (id, pid) {
    const res = await client.delete(`/order/item/${id}/${pid}`);

    return res;
}

methods.processOrder = async function (id) {
    const res = await client.post(`/order/process/${id}`);

    return res;
}

methods.executeReturn = async function (id) {
    const res = await client.post(`/order/return/${id}`);

    return res;
}

methods.addPayment = async function (id, body) {
    const res = await client.post(`/order/payment/${id}`, body);

    return res;
}



// Trader APis

methods.listBuyer = async function(query = {}) {
    const res = await client.get(`/trader/list/buyer?${new URLSearchParams(query).toString()}`);

    return res;
}

methods.listVendor = async function(query = {}) {
    const res = await client.get(`/trader/list/vendor?${new URLSearchParams(query).toString()}`);

    return res;
}

methods.traderDetail = async function(id) {
    const res = await client.get(`/trader/detail/${id}`);

    return res;
}

methods.addTrader = async function(data) {
    const res = await client.post(`/trader/add`, data);

    return res;
}

methods.updateTrader = async function(id, data) {
    const res = await client.put(`/trader/update/${id}`, data);

    return res;
}

methods.deleteTrader = async function(id) {
    const res = await client.delete(`/trader/delete/${id}`);

    return res;
}

module.exports = methods;