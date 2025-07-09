import Client from './client';

export async function getBills(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get(`/trade/order/list?${qs.toString()}`);
  return data;
}

export async function getBillDetail(id) {
  const { data } = await Client.get(`/trade/order/detail/${id}`);
  return data;
}

export async function getBillOrders(id) {
  const { data } = await Client.get(`/trade/order/item/${id}`);
  return data;
}

export async function createBill(data) {
  const response = await Client.post('/trade/order/create', data);
  return response
}

export async function updateBill({ id, ...body }) {
  const { data } = await Client.put(`/trade/order/update/${id}`, body);
  return data
}

export async function completeBill(id) {
  const { data } = await Client.post(`/trade/order/complete/${id}`);
  return data
}

export async function deleteBill(id) {
  const { data } = await Client.delete(`/trade/order/delete/${id}`);
  return data
}

export async function addBillOrder(id, data) {
  const res = await Client.post('/trade/order/item/' + id, data);
  return res;
}

export async function updateBillOrder(id, data) {
  const res = await Client.put('/trade/order/item/' + id, data);
  return res;
}

export async function removeBillOrder(id, pid) {
  const res = await Client.delete('/trade/order/item/' + id + '/' + pid);
  return res;
}

export async function updateBillState(id, state) {
  const res = await Client.post('/trade/order/state/' + id + '/' + state);
  return res;
}