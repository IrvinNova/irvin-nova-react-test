import axios from "axios";
import { RMCharacter } from "../types/rm";

const API_URL = "https://rickandmortyapi.com/api/character/";

export const fetchCharacters = async (page: number): Promise<{ results: RMCharacter[], info: any }> => {
  const res = await axios.get(`${API_URL}?page=${page}`);
  return res.data;
};
