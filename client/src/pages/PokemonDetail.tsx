import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { TypeBadge } from '../components/TypeBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePokemon } from '../context/PokemonContext';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';

export const PokemonDetail: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = usePokemon();
  const navigate = useNavigate();
  const { addToCompare, compareList } = usePokemon();

  useEffect(() => {
    if (nameOrId) {
      loadPokemon();
    }
  }, [nameOrId]);

  const loadPokemon = async () => {
    setLoading(true);
    try {
      const data = await getPokemonDetails(nameOrId!);
      setPokemon(data);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (!pokemon) return;

    if (compareList.includes(pokemon.id)) {
      alert('Already added!');
      return;
    }

    if (compareList.length >= 2) {
      alert('Only 2 Pokémon can be compared');
      return;
    }

    addToCompare(pokemon.id);
  };

  if (loading) return <LoadingSpinner />;
  if (!pokemon) return <div>Pokemon not found</div>;

  const maxStat = 255;
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="max-w-6xl mx-auto px-5 py-5">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-5 py-2.5 bg-orange-400 text-white border-none rounded-lg cursor-pointer mb-5 hover:bg-orange-500 transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-2 gap-10">
        {/* Left Column - Image & Basic Info */}
        <div>
          <img
            src={artwork}
            alt={pokemon.name}
            className="w-full max-w-sm mx-auto block"
          />
          <div className="text-center mt-5">
            <div className="text-sm text-gray-500">
              #{String(pokemon.id).padStart(3, '0')}
            </div>
            <h1 className="capitalize my-2.5 text-3xl font-bold">{pokemon.name}</h1>
            <div className="flex gap-2.5 justify-center mb-5">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <div className="flex gap-5 justify-center">
              <button
                onClick={() => toggleFavorite(pokemon.id)}
                className={`px-5 py-2.5 text-white border-none rounded-lg cursor-pointer transition-colors ${
                  isFavorite(pokemon.id)
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-400 hover:bg-orange-500'
                }`}
              >
            {isFavorite(pokemon.id) ? (
            <span className='flex items-center gap-1'>
                <IoIosHeart className="text-red-900 " size={20} /> 
                Remove
            </span>
            ) : (
            <span className='flex items-center gap-1'>
                <IoIosHeartEmpty className="text-white" size={20} />
                Add
            </span>
            )}
              </button>
              <button
                onClick={handleCompare}
                className="px-5 py-2.5 bg-green-500 text-white border-none rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
              >
                🔄 Compare
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Details */}
        <div className='flex flex-col justify-between'>
          {/* Base Stats */}
        <div className="mb-4">
        <h2 className="text-lg font-bold mb-3">Base Stats</h2>
        {pokemon.stats.map((stat) => {
            const percentage = (stat.base_stat / maxStat) * 100;
            return (
            <div key={stat.stat.name} className="mb-4">
                <div className="flex justify-between mb-1">
                <span className="capitalize font-semibold text-gray-700 text-sm">
                    {stat.stat.name.replace('special', 'Sp. ')}
                </span>
                <span>{stat.base_stat}</span>
                </div>
                <div className="bg-gray-200 rounded-lg overflow-hidden">
                <div
                    className={`h-3 rounded-lg transition-all duration-500 ease-in-out ${
                    percentage > 70
                        ? 'bg-green-500'
                        : percentage > 40
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
                </div>
            </div>
            );
        })}
        </div>

          {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-5 mb-8">
        <div>
            <h3 className="font-semibold text-gray-700">Height</h3>
            <p>{pokemon.height / 10} m</p>
        </div>
        <div>
            <h3 className="font-semibold text-gray-700">Weight</h3>
            <p>{pokemon.weight / 10} kg</p>
        </div>
        </div>

          {/* Abilities */}
        <div>
            <h3 className="font-semibold text-gray-700 mb-2">Abilities</h3>
            <div className="flex gap-2.5 flex-wrap">
                {pokemon.abilities.map((ability) => (
                <div
                    key={ability.ability.name}
                    className={`px-4 py-2 text-white rounded-lg capitalize ${
                    ability.is_hidden ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && ' (Hidden)'}
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};