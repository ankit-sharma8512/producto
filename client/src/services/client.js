import axios from "axios";

const Client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

export default Client;