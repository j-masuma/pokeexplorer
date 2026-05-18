import express from 'express';
import { PokemonController } from '../controllers/pokemonController';

const router = express.Router();

// Pokemon routes
router.get('/pokemon', PokemonController.getPokemonList);
router.get('/pokemon/search', PokemonController.searchPokemon);
router.get('/pokemon/:nameOrId', PokemonController.getPokemonDetails);
router.get('/generations', PokemonController.getGenerations);

export default router;