"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pokemonController_1 = require("../controllers/pokemonController");
const router = express_1.default.Router();
// Pokemon routes
router.get('/pokemon', pokemonController_1.PokemonController.getPokemonList);
router.get('/pokemon/search', pokemonController_1.PokemonController.searchPokemon);
router.get('/pokemon/:nameOrId', pokemonController_1.PokemonController.getPokemonDetails);
router.get('/generations', pokemonController_1.PokemonController.getGenerations);
exports.default = router;
//# sourceMappingURL=api.js.map