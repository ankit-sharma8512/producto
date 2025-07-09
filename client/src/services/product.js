import Client from './client';

export async function getProducts(query = {}) {
	const q        = new URLSearchParams(query);
	const { data } = await Client.get(`/product/list?${q.toString()}`);
	return data;
}

export async function getProductLots(query = {}) {
  const q = new URLSearchParams(query);
  const { data } = await Client.get(`/product/list/lot?${q.toString()}`);
  return data;
}

export async function getProductDetail(_id) {
  const { data } = await Client.get(`/product/detail/${_id}`);
  return data;
}

export async function getProductAvailable(_id) {
  const { data } = await Client.get(`/product/available/${_id}`);
  return data;
}

export async function addProduct(data) {
  const response = await Client.post('/product/create', data);
  return response.data
}

export async function addLot(data) {
  const response = await Client.post('/product/create/lot', data);
  return response
}

export async function updateProduct(data) {
  const id = data.id
  delete data.id
  const response = await Client.put('/product/update/' + id, data);
  return response.data
}

export async function updateProductLot(data) {
  const response = await Client.put('/product/update/lot/' + data._id, data);
  return response
}

export async function deleteProduct(_id) {
  const response = await Client.delete('/product/delete/' + _id);
  return response
}

export async function deleteProductLot(_id) {
  const response = await Client.delete('/product/delete/lot/' + _id);
  return response
}
