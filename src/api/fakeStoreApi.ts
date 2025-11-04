import axios from "axios";

const API_URL = "https://fakestoreapi.com/products";

export const fetchProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
