import mongoose from "mongoose";

const pokemonCacheSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  id: { type: Number, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  generation: { type: Number },
  types: [{ type: String }],
  fetchedAt: { type: Date, default: Date.now }
});

pokemonCacheSchema.index({ name: 1 });
pokemonCacheSchema.index({ generation: 1 });
pokemonCacheSchema.index({ types: 1 });

const PokemonCache = mongoose.model("PokemonCache", pokemonCacheSchema);

export default PokemonCache;