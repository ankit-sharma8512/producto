import Client from './client';

export async function downloadPDF(url) {
  const res = await Client({ url:'report'+url, method: 'get', responseType: 'blob' });
  return res.data;
}