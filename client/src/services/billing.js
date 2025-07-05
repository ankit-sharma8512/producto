import Client from './client';

export async function getBills(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get(`/bill/list?${qs.toString()}`);
  return data;
}

export async function getBillDetail(id) {
  const { data } = await Client.get(`/bill/detail/${id}`);
  return data;
}

export async function getBillOrders(id) {
  const { data } = await Client.get(`/bill/order/list/${id}`);
  return data;
}

export async function createBill(data) {
  const response = await Client.post('/bill/create', data);
  return response
}

export async function updateBill({ id, ...body }) {
  const { data } = await Client.put(`/bill/update/${id}`, body);
  return data
}

export async function completeBill(id) {
  const { data } = await Client.post(`/bill/complete/${id}`);
  return data
}

export async function deleteBill(id) {
  const { data } = await Client.delete(`/bill/delete/${id}`);
  return data
}

export async function addBillOrder(id, data) {
  const res = await Client.post('/bill/order/add/' + id, data);
  return res;
}

export async function updateBillOrder(id, data) {
  const res = await Client.put('/bill/order/update/' + id, data);
  return res;
}

export async function removeBillOrder(id, pid) {
  const res = await Client.delete('/bill/order/remove/' + id + '/' + pid);
  return res;
}

export async function updateBillState(id, state) {
  const res = await Client.post('/bill/state/' + id + '/' + state);
  return res;
}