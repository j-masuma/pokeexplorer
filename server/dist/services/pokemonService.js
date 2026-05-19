"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonService = void 0;
const axios_1 = __importDefault(require("axios"));
const PokemonCache_1 = __importDefault(require("../models/PokemonCache"));
const POKEAPI_BASE = process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2";
class PokemonService {
    static async fetchFromPokeAPI(url) {
        try {
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching from PokeAPI:", error);
            throw error;
        }
    }
    static async cachePokemonData(pokemonData) {
        let generation = 1;
        if (pokemonData.id <= 151)
            generation = 1;
        else if (pokemonData.id <= 251)
            generation = 2;
        else if (pokemonData.id <= 386)
            generation = 3;
        else if (pokemonData.id <= 493)
            generation = 4;
        else if (pokemonData.id <= 649)
            generation = 5;
        else if (pokemonData.id <= 721)
            generation = 6;
        else if (pokemonData.id <= 809)
            generation = 7;
        else if (pokemonData.id <= 898)
            generation = 8;
        else
            generation = 9;
        const types = pokemonData.types.map((t) => t.type.name);
        const cacheEntry = {
            name: pokemonData.name,
            id: pokemonData.id,
            data: pokemonData,
            generation,
            types
        };
        await PokemonCache_1.default.findOneAndUpdate({ name: pokemonData.name }, cacheEntry, { upsert: true, new: true });
    }
    static async fetchGenerationSpecies(generation) {
        const response = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/generation/${generation}`);
        return response.pokemon_species.map((species) => ({
            name: species.name,
            url: `${POKEAPI_BASE}/pokemon/${species.name}`
        }));
    }
    static async fetchPokemonDetailsByName(name) {
        const cached = await PokemonCache_1.default.findOne({ name });
        if (cached)
            return cached;
        const details = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon/${name}`);
        await this.cachePokemonData(details);
        return await PokemonCache_1.default.findOne({ name });
    }
    static async getPokemonList(page = 1, limit = 20, generation) {
        let query = {};
        if (generation && generation !== 0) {
            query.generation = generation;
        }
        const cachedPokemons = await PokemonCache_1.default.find(query)
            .sort({ id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        if (generation && generation !== 0) {
            const species = await this.fetchGenerationSpecies(generation);
            const total = species.length;
            const pagedSpecies = species.slice((page - 1) * limit, page * limit);
            const detailedPokemons = await Promise.all(pagedSpecies.map(async (item) => {
                const existing = await PokemonCache_1.default.findOne({ name: item.name });
                if (existing)
                    return existing;
                const details = await this.fetchFromPokeAPI(item.url);
                await this.cachePokemonData(details);
                return await PokemonCache_1.default.findOne({ name: item.name });
            }));
            return {
                pokemons: detailedPokemons.filter(Boolean),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        }
        if (cachedPokemons.length < limit) {
            const offset = (page - 1) * limit;
            const response = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
            const detailedPokemons = await Promise.all(response.results.map(async (item) => {
                const existing = await PokemonCache_1.default.findOne({ name: item.name });
                if (existing)
                    return existing;
                const details = await this.fetchFromPokeAPI(item.url);
                await this.cachePokemonData(details);
                return await PokemonCache_1.default.findOne({ name: item.name });
            }));
            return {
                pokemons: detailedPokemons.filter(Boolean),
                total: response.count,
                page,
                totalPages: Math.ceil(response.count / limit)
            };
        }
        const total = await PokemonCache_1.default.countDocuments(query);
        return {
            pokemons: cachedPokemons,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    static async getPokemonByName(nameOrId) {
        const cached = await PokemonCache_1.default.findOne({
            $or: [
                { name: nameOrId.toLowerCase() },
                { id: parseInt(nameOrId) }
            ]
        });
        if (cached)
            return cached.data;
        const data = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon/${nameOrId.toLowerCase()}`);
        await this.cachePokemonData(data);
        return data;
    }
    static async searchPokemon(query, generation) {
        const regex = new RegExp(query, 'i');
        if (generation && generation !== 0) {
            const species = await this.fetchGenerationSpecies(generation);
            const matchingNames = species
                .filter((item) => regex.test(item.name))
                .map((item) => item.name);
            const cachedResults = await PokemonCache_1.default.find({
                name: { $in: matchingNames }
            })
                .sort({ id: 1 })
                .limit(50);
            const missingNames = matchingNames.filter((name) => !cachedResults.some((pokemon) => pokemon.name === name));
            const fetchedResults = await Promise.all(missingNames.slice(0, 50 - cachedResults.length).map(async (name) => {
                const details = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/pokemon/${name}`);
                await this.cachePokemonData(details);
                return await PokemonCache_1.default.findOne({ name });
            }));
            return [...cachedResults, ...fetchedResults.filter(Boolean)];
        }
        const results = await PokemonCache_1.default.find({
            name: { $regex: query, $options: 'i' }
        })
            .sort({ id: 1 })
            .limit(50);
        return results;
    }
    static async getGenerations() {
        const generations = [];
        for (let i = 1; i <= 9; i++) {
            const genData = await this.fetchFromPokeAPI(`${POKEAPI_BASE}/generation/${i}`);
            generations.push({
                id: i,
                name: genData.name,
                pokemonCount: genData.pokemon_species.length
            });
        }
        return generations;
    }
}
exports.PokemonService = PokemonService;
//# sourceMappingURL=pokemonService.js.map