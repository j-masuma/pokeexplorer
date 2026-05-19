import axios from "axios";
import PokemonCache from "../models/PokemonCache";

const POKEAPI_BASE =
  process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2";

interface PokemonListItem {
  name: string;
  url: string;
}

export class PokemonService {
    private static async fetchFromPokeAPI(url: string) {
        try {
        console.log(`[PokeService] Fetching from PokeAPI: ${url}`);
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        console.error("Error fetching from PokeAPI:", error);
        throw error;
        }
    }

    private static async cachePokemonData(pokemonData: any) {
        let generation = 1;

        if (pokemonData.id <= 151) generation = 1;
        else if (pokemonData.id <= 251) generation = 2;
        else if (pokemonData.id <= 386) generation = 3;
        else if (pokemonData.id <= 493) generation = 4;
        else if (pokemonData.id <= 649) generation = 5;
        else if (pokemonData.id <= 721) generation = 6;
        else if (pokemonData.id <= 809) generation = 7;
        else if (pokemonData.id <= 898) generation = 8;
        else generation = 9;

        const types = pokemonData.types.map((t: any) => t.type.name);

        const cacheEntry = {
        name: pokemonData.name,
        id: pokemonData.id,
        data: pokemonData,
        generation,
        types
        };

        await PokemonCache.findOneAndUpdate(
        { name: pokemonData.name },
        cacheEntry,
        { upsert: true, new: true }
        );
    }

    private static async fetchGenerationSpecies(generation: number) {
        const response = await this.fetchFromPokeAPI(
        `${POKEAPI_BASE}/generation/${generation}`
        );

        return response.pokemon_species.map((species: any) => ({
        name: species.name,
        url: `${POKEAPI_BASE}/pokemon/${species.name}`
        }));
    }

    private static async fetchPokemonDetailsByName(name: string) {
        const cached = await PokemonCache.findOne({ name });
        if (cached) return cached;

        const details = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon/${name}`);
        await this.cachePokemonData(details);
        return await PokemonCache.findOne({ name });
    }

    static async getPokemonList(page = 1, limit = 20, generation?: number) {
        let query: any = {};

        if (generation && generation !== 0) {
        query.generation = generation;
        }

        const cachedPokemons = await PokemonCache.find(query)
        .sort({ id: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

        if (generation && generation !== 0) {
        const species = await this.fetchGenerationSpecies(generation);
        const total = species.length;
        const pagedSpecies = species.slice((page - 1) * limit, page * limit);

        const detailedPokemons = await Promise.all(
            pagedSpecies.map(async (item: PokemonListItem) => {
            const existing = await PokemonCache.findOne({ name: item.name });
            if (existing) return existing;

            const details = await this.fetchFromPokeAPI(item.url);
            await this.cachePokemonData(details);

            return await PokemonCache.findOne({ name: item.name });
            })
        );

        return {
            pokemons: detailedPokemons.filter(Boolean),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
        }

        if (cachedPokemons.length < limit) {
        const offset = (page - 1) * limit;

        const response = await this.fetchFromPokeAPI(
            `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
        );

        const detailedPokemons = await Promise.all(
            response.results.map(async (item: PokemonListItem) => {
            const existing = await PokemonCache.findOne({ name: item.name });
            if (existing) return existing;

            const details = await this.fetchFromPokeAPI(item.url);
            await this.cachePokemonData(details);

            return await PokemonCache.findOne({ name: item.name });
            })
        );

        return {
            pokemons: detailedPokemons.filter(Boolean),
            total: response.count,
            page,
            totalPages: Math.ceil(response.count / limit)
        };
        }

        const total = await PokemonCache.countDocuments(query);

        return {
        pokemons: cachedPokemons,
        total,
        page,
        totalPages: Math.ceil(total / limit)
        };
    }

    static async getPokemonByName(nameOrId: string) {
        const cached = await PokemonCache.findOne({
        $or: [
            { name: nameOrId.toLowerCase() },
            { id: parseInt(nameOrId) }
        ]
        });

        if (cached) {
        console.log(`[PokeService] Cache hit for: ${nameOrId}`);
        return cached.data;
        }

        console.log(`[PokeService] Cache miss for: ${nameOrId} - fetching from PokeAPI`);
        const data = await this.fetchFromPokeAPI(
        `${POKEAPI_BASE}/pokemon/${nameOrId.toLowerCase()}`
        );

        await this.cachePokemonData(data);
        return data;
    }

    static async searchPokemon(query: string, generation?: number) {
        const regex = new RegExp(query, 'i');

        if (generation && generation !== 0) {
        const species = await this.fetchGenerationSpecies(generation);
        const matchingNames = species
            .filter((item: PokemonListItem) => regex.test(item.name))
            .map((item: PokemonListItem) => item.name);

        const cachedResults = await PokemonCache.find({
            name: { $in: matchingNames }
        })
        .sort({ id: 1 })
        .limit(50);

        const missingNames = matchingNames.filter(
            (name: string) => !cachedResults.some((pokemon) => pokemon.name === name)
        );

        const fetchedResults = await Promise.all(
            missingNames.slice(0, 50 - cachedResults.length).map(async (name: string) => {
            const details = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon/${name}`);
            await this.cachePokemonData(details);
            return await PokemonCache.findOne({ name });
            })
        );

        return [...cachedResults, ...fetchedResults.filter(Boolean)];
        }

        const results = await PokemonCache.find({
        name: { $regex: query, $options: 'i' }
        })
        .sort({ id: 1 })
        .limit(50);

        return results;
    }
    static async getGenerations() {
        const generations = [];

        for (let i = 1; i <= 9; i++) {
            const genData = await this.fetchFromPokeAPI(
            `${POKEAPI_BASE}/generation/${i}`
            );

            generations.push({
            id: i,
            name: genData.name,
            pokemonCount: genData.pokemon_species.length
            });
        }

        return generations;
    }
}