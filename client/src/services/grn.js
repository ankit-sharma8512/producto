import Client from './client';

export async function getGrnList(q) {
  const qs = new URLSearchParams(q);
  const { data } = await Client.get(`/grn/list?${qs.toString()}`);
  return data;
}

export async function createGrn(body) {
  const {data} = await Client.post('/grn/create', body);
  return data
}