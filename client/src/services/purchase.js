import Client from './client';

export async function getPurchases(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get(`/trade/purchase/list?${qs.toString()}`);
  return data;
}

export async function getPurchaseDetail(id) {
  const { data } = await Client.get(`/trade/purchase/detail/${id}`);
  return data;
}

export async function getPurchaseOrders(id) {
  const { data } = await Client.get(`/trade/purchase/order/${id}`);
  return data;
}

export async function createPurchase(data) {
  const response = await Client.post('/trade/purchase/create', data);
  return response.data
}

export async function updatePurchase({ id, ...body }) {
  const { data } = await Client.put(`/trade/purchase/update/${id}`, body);
  return data
}

export async function completePurchase(id) {
  const { data } = await Client.post(`/trade/purchase/complete/${id}`);
  return data
}

export async function deletePurchase(id) {
  const { data } = await Client.delete(`/trade/purchase/delete/${id}`);
  return data
}

export async function addPurchaseOrder(id, data) {
  const res = await Client.post('/trade/purchase/order/' + id, data);
  return res;
}

export async function updatePurchaseOrder(id, data) {
  const res = await Client.put('/trade/purchase/order/' + id, data);
  return res;
}

export async function removePurchaseOrder(id, pid) {
  const res = await Client.delete('/trade/purchase/order/' + id + '/' + pid);
  return res;
}