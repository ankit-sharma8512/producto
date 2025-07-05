import Client from './client';

export async function getPurchases(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get(`/purchase/list?${qs.toString()}`);
  return data;
}

export async function getPurchaseDetail(id) {
  const { data } = await Client.get(`/purchase/detail/${id}`);
  return data;
}

export async function getPurchaseOrders(id) {
  const { data } = await Client.get(`/purchase/order/list/${id}`);
  return data;
}

export async function createPurchase(data) {
  const response = await Client.post('/purchase/create', data);
  return response
}

export async function updatePurchase({ id, ...body }) {
  const { data } = await Client.put(`/purchase/update/${id}`, body);
  return data
}

export async function completePurchase(id) {
  const { data } = await Client.post(`/purchase/complete/${id}`);
  return data
}

export async function deletePurchase(id) {
  const { data } = await Client.delete(`/purchase/delete/${id}`);
  return data
}

export async function addPurchaseOrder(id, data) {
  const res = await Client.post('/purchase/order/add/' + id, data);
  return res;
}

export async function updatePurchaseOrder(id, data) {
  const res = await Client.put('/purchase/order/update/' + id, data);
  return res;
}

export async function removePurchaseOrder(id, pid) {
  const res = await Client.delete('/purchase/order/remove/' + id + '/' + pid);
  return res;
}