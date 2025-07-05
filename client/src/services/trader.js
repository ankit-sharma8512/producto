import Client from './client';

export async function getBuyers(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get('/trader/list/buyer?' + qs.toString());

  return data;
}

export async function getVendors(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get('/trader/list/vendor?' + qs.toString());

  return data;
}

export async function addTrader(data) {
  const res = await Client.post('/trader/add', data);

  return res;
}

export async function updateTrader(data) {
  const res = await Client.put('/trader/update/' + data._id, data);

  return res;
}

export async function deleteTrader(_id) {
  const res = await Client.delete('/trader/delete/' + _id);

  return res;
}