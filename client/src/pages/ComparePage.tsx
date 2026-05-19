import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TypeBadge } from '../components/TypeBadge';
import { usePokemon } from '../context/PokemonContext';

export const ComparePage: React.FC = () => {
  const { compareList, clearCompare } = usePokemon();
  const [pokemons, setPokemons] = useState<(Pokemon | null)[]>([null, null]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  const loadCompareList = async () => {
    setLoading(true);
    try {
      const loadedPokemons = await Promise.all(
        compareList.map(async (id) => {
          try {
            return await getPokemonDetails(id.toString());
          } catch {
            return null;
          }
        })
      );

      while (loadedPokemons.length < 2) {
        loadedPokemons.push(null);
      }

      setPokemons(loadedPokemons);
    } catch (error) {
      console.error('Error loading compare list:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatValue = (pokemon: Pokemon | null, statName: string): number => {
    if (!pokemon) return 0;
    const stat = pokemon.stats.find((s) => s.stat.name === statName);
    return stat?.base_stat || 0;
  };

  const getTotalStats = (pokemon: Pokemon | null): number => {
    if (!pokemon) return 0;
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  };

  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statLabels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

  useEffect(() => {
    loadCompareList();
  }, [compareList]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-5 py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Compare Pokémon</h1>
        <button
          onClick={clearCompare}
          className="px-5 py-2.5 bg-red-500 text-white border-none rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
        >
          Clear Comparison
        </button>
      </div>

      {/* Pokémon Cards Grid */}
      <div className="grid grid-cols-2 gap-10">
        {[0, 1].map((index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-5">
            {pokemons[index] ? (
              <>
                <img
                  src={pokemons[index]!.sprites.front_default}
                  alt={pokemons[index]!.name}
                  className="w-36 mx-auto block"
                />
                <h2 className="text-center capitalize text-xl font-semibold mt-2">
                  #{String(pokemons[index]!.id).padStart(3, '0')} {pokemons[index]!.name}
                </h2>
                <div className="flex gap-2 justify-center mb-5">
                  {pokemons[index]!.types.map((t) => (
                    <TypeBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>
                <div className="mb-5 space-y-1 text-sm">
                  <p><strong>Height:</strong> {pokemons[index]!.height / 10} m</p>
                  <p><strong>Weight:</strong> {pokemons[index]!.weight / 10} kg</p>
                  <p><strong>Total Stats:</strong> {getTotalStats(pokemons[index])}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No Pokémon selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stat Comparison */}
      {pokemons[0] && pokemons[1] && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Stat Comparison</h2>
          {statNames.map((statName, idx) => {
            const val1 = getStatValue(pokemons[0], statName);
            const val2 = getStatValue(pokemons[1], statName);
            const maxVal = Math.max(val1, val2, 255);

            return (
              <div key={statName} className="mb-5">
                <h3 className="font-semibold mb-1">{statLabels[idx]}</h3>
                <div className="flex gap-5 items-center">
                  {/* Bar for Pokémon 1 */}
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                      <div
                        className={`h-5 flex items-center justify-end pr-2.5 text-white text-sm rounded-lg transition-all ${
                          val1 >= val2 ? 'bg-green-500' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${(val1 / maxVal) * 100}%` }}
                      >
                        {val1}
                      </div>
                    </div>
                  </div>

                  {/* Bar for Pokémon 2 */}
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                      <div
                        className={`h-5 flex items-center justify-end pr-2.5 text-sm text-white rounded-lg transition-all ${
                          val2 >= val1 ? 'bg-green-500' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${(val2 / maxVal) * 100}%` }}
                      >
                        {val2}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};