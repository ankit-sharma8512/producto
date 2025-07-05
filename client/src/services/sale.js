import Client from './client';

export async function getSale(id) {
  const { data } = await Client.get('/sale/' + id);

  return data;
}

export async function updateSale(id, body) {
  const { data } = await Client.put('/sale/' + id, body);

  return data;
}