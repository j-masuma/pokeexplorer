"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const pokemonService_1 = require("../services/pokemonService");
class PokemonController {
    static async getPokemonList(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const generation = req.query.generation
                ? Number(req.query.generation)
                : undefined;
            const result = await pokemonService_1.PokemonService.getPokemonList(page, limit, generation);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch Pokemon list" });
        }
    }
    static async getPokemonDetails(req, res) {
        try {
            const nameOrId = req.params.nameOrId;
            const pokemon = await pokemonService_1.PokemonService.getPokemonByName(nameOrId);
            res.json(pokemon);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch Pokemon details" });
        }
    }
    static async searchPokemon(req, res) {
        try {
            const q = req.query.q;
            const generation = req.query.generation
                ? Number(req.query.generation)
                : undefined;
            if (!q) {
                return res.json([]);
            }
            const results = await pokemonService_1.PokemonService.searchPokemon(q, generation);
            res.json(results);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to search Pokemon" });
        }
    }
    static async getGenerations(req, res) {
        try {
            const generations = await pokemonService_1.PokemonService.getGenerations();
            res.json(generations);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch generations" });
        }
    }
}
exports.PokemonController = PokemonController;
//# sourceMappingURL=pokemonController.js.map