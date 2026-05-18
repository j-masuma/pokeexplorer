import { Request, Response } from "express";
import { PokemonService } from "../services/pokemonService";

export class PokemonController {
    static async getPokemonList(req: Request, res: Response) {
        try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const generation = req.query.generation
            ? Number(req.query.generation)
            : undefined;

        const result = await PokemonService.getPokemonList(page, limit, generation);
        res.json(result);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch Pokemon list" });
        }
    }

    static async getPokemonDetails(req: Request, res: Response) {
        try {
        const nameOrId = req.params.nameOrId as string;

        const pokemon = await PokemonService.getPokemonByName(nameOrId);

        res.json(pokemon);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch Pokemon details" });
        }
    }

    static async searchPokemon(req: Request, res: Response) {
        try {
        const q = req.query.q as string;
        const generation = req.query.generation
            ? Number(req.query.generation)
            : undefined;

        if (!q) {
            return res.json([]);
        }

        const results = await PokemonService.searchPokemon(q, generation);

        res.json(results);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to search Pokemon" });
        }
    }

    static async getGenerations(req: Request, res: Response) {
        try {
        const generations = await PokemonService.getGenerations();
        res.json(generations);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch generations" });
        }
    }
}