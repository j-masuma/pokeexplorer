"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pokemonCacheSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    id: { type: Number, required: true, unique: true },
    data: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    generation: { type: Number },
    types: [{ type: String }],
    fetchedAt: { type: Date, default: Date.now }
});
pokemonCacheSchema.index({ name: 1 });
pokemonCacheSchema.index({ generation: 1 });
pokemonCacheSchema.index({ types: 1 });
const PokemonCache = mongoose_1.default.model("PokemonCache", pokemonCacheSchema);
exports.default = PokemonCache;
//# sourceMappingURL=PokemonCache.js.map