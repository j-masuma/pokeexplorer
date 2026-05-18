import axios from 'axios';
import type {
  PokemonListResponse,
  Pokemon,
  PokemonListItem
} from '../types/pokemon';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

type PokemonQueryParams = {
  page: number;
  limit: number;
  generation?: number;
};

type SearchParams = {
  q: string;
  generation?: number;
};

export const getPokemonList = async (
  page = 1,
  limit = 20,
  generation?: number
) => {
  const params: PokemonQueryParams = { page, limit };

  if (generation && generation !== 0) {
    params.generation = generation;
  }

  const response = await api.get<PokemonListResponse>('/pokemon', {
    params
  });

  return response.data;
};

export const getPokemonDetails = async (nameOrId: string) => {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return response.data;
};

export const searchPokemon = async (query: string, generation?: number) => {
  const params: SearchParams = { q: query };

  if (generation && generation !== 0) {
    params.generation = generation;
  }

  const response = await api.get<PokemonListItem[]>('/pokemon/search', {
    params
  });

  return response.data;
};

export const getGenerations = async () => {
  const response = await api.get('/generations');
  return response.data;
};